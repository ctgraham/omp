/**
 * @file cypress/tests/data/60-content/CallanSubmission.spec.js
 *
 * Copyright (c) 2014-2021 Simon Fraser University
 * Copyright (c) 2000-2021 John Willinsky
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @ingroup tests_data
 *
 * @brief Data build suite: Create submission
 */

describe('Data suite tests', function() {
	it('Create a submission', function() {
		cy.register({
			'username': 'callan',
			'givenName': 'Chantal',
			'familyName': 'Allan',
			'affiliation': 'University of Southern California',
			'country': 'Canada'
		});

		var author = 'Chantal Allan';
		var submission = {
			'type': 'monograph',
			//'series': '',
			'title': 'Bomb Canada and Other Unkind Remarks in the American Media',
			'abstract': 'Canada and the United States. Two nations, one border, same continent. Anti-American sentiment in Canada is well documented, but what have Americans had to say about their northern neighbour? Allan examines how the American media has portrayed Canada, from Confederation to Obama’s election. By examining major events that have tested bilateral relations, Bomb Canada tracks the history of anti-Canadianism in the U.S. Informative, thought provoking and at times hilarious, this book reveals another layer of the complex relationship between Canada and the United States.',
			'keywords': [
				'Canadian Studies',
				'Communication & Cultural Studies',
				'Political & International Studies',
			],
			'submitterRole': 'Author',
			'chapters': [
				{
					'title': 'Prologue',
					'contributors': [author],
				},
				{
					'title': 'Chapter 1: The First Five Years: 1867-1872',
					'contributors': [author],
				},
				{
					'title': 'Chapter 2: Free Trade or "Freedom": 1911',
					'contributors': [author],
				},
				{
					'title': 'Chapter 3: Castro, Nukes & the Cold War: 1953-1968',
					'contributors': [author],
				},
				{
					'title': 'Chapter 4: Enter the Intellect: 1968-1984',
					'contributors': [author],
				},
				{
					'title': 'Epilogue',
					'contributors': [author],
				},
			]
		};
		cy.createSubmission(submission);
		cy.logout();

		cy.findSubmissionAsEditor('dbarnes', null, 'Allan');
		cy.clickDecision('Send to Internal Review');
		cy.recordDecisionSendToReview('Send to Internal Review', [author], [submission.title]);
		cy.isActiveStageTab('Internal Review');
		cy.assignReviewer('Paul Hudson');
		cy.clickDecision('Send to External Review');
		cy.recordDecisionSendToReview('Send to External Review', [author], []);
		cy.isActiveStageTab('External Review');
		cy.assignReviewer('Gonzalo Favio');
		cy.clickDecision('Accept Submission');
		cy.recordDecisionAcceptSubmission([author], [], []);
		cy.isActiveStageTab('Copyediting');
		cy.assignParticipant('Copyeditor', 'Sarah Vogt');
		cy.clickDecision('Send To Production');
		cy.recordDecisionSendToProduction([author], []);
		cy.isActiveStageTab('Production');
		cy.assignParticipant('Layout Editor', 'Stephen Hellier');
		cy.assignParticipant('Proofreader', 'Catherine Turner');

		// Add a publication format
		cy.get('button[id="publication-button"]').click();
		cy.get('button[id="publicationFormats-button"]').click();
		cy.get('*[id^="component-grid-catalogentry-publicationformatgrid-addFormat-button-"]').click();
		cy.wait(1000); // Avoid occasional failure due to form init taking time
		cy.get('input[id^="name-en_US-"]').type('PDF', {delay: 0});
		cy.get('div.pkp_modal_panel div.header:contains("Add publication format")').click(); // FIXME: Focus problem with multilingual input
		cy.get('button:contains("OK")').click();

		// Select proof file
		cy.get('table[id*="component-grid-catalogentry-publicationformatgrid"] span:contains("PDF"):parent() a[id*="-name-selectFiles-button-"]').click();
		cy.get('*[id=allStages]').click();
		cy.get('tbody[id^="component-grid-files-proof-manageprooffilesgrid-category-"] input[type="checkbox"][name="selectedFiles[]"]:first').click();
		cy.get('form[id="manageProofFilesForm"] button[id^="submitFormButton-"]').click();
		cy.waitJQuery();

		// Approvals for PDF publication format
		cy.get('table[id^="component-grid-catalogentry-publicationformatgrid-"] tr:contains("PDF") a[id*="-isComplete-approveRepresentation-button-"]').click();
		cy.get('form[id="assignPublicIdentifierForm"] button[id^="submitFormButton-"]').click();
		cy.waitJQuery();
		cy.get('table[id^="component-grid-catalogentry-publicationformatgrid-"] tr:contains("PDF") a[id*="-isAvailable-availableRepresentation-button-"]').click();
		cy.get('.pkpModalConfirmButton').click();
		cy.waitJQuery();

		// File completion
		cy.get('table[id^="component-grid-catalogentry-publicationformatgrid-"] tr:contains("' + Cypress.$.escapeSelector(submission.title) + '") a[id*="-isComplete-not_approved-button-"]').click();
		cy.get('form[id="assignPublicIdentifierForm"] button[id^="submitFormButton-"]').click();
		cy.waitJQuery();

		// File availability
		cy.get('table[id^="component-grid-catalogentry-publicationformatgrid-"] tr:contains("' + Cypress.$.escapeSelector(submission.title) + '") a[id*="-isAvailable-editApprovedProof-button-"]').click();
		cy.get('input[id="openAccess"]').click();
		cy.get('form#approvedProofForm button.submitFormButton').click();

		// Add to catalog
		cy.addToCatalog();
	});
});
