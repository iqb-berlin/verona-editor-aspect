import { addList, connectLists, dragTo } from './droplist-util';

describe('Droplist element', { testIsolation: false }, () => {
  context('editor', () => {
    before('opens an editor', () => {
      cy.openEditor();
    });

    it('creates several droplists, the second protected edition', () => {
      addList('Startliste', ['AAA'], {copyElement: true}, 'Startliste');
      addList('Zielliste mit Schreibschutz', [], {writeProtected: true}, 'ZiellisteSchutz');
      addList('Zielliste ohne Schreibschutz', [], {}, 'Zielliste');

      connectLists('Startliste', 'ZiellisteSchutz');
      connectLists('Startliste', 'Zielliste');
      connectLists('ZiellisteSchutz', 'Startliste');
      connectLists('Zielliste', 'Startliste');
    });

    after('saves an unit definition', () => {
      cy.saveUnit('e2e/downloads/droplist-writeprotected.json');
    });
  });

  context('player', () => {
    before('opens a player', () => {
      cy.openPlayer();
      cy.loadUnit('../downloads/droplist-writeprotected.json');
    });

    it('drags to write-protected list. ', () => {
      // # Ticket 751
      dragTo('Startliste', 'AAA', 'ZiellisteSchutz');
      cy.getByAlias('ZiellisteSchutz').children()
        .should('have.length', 1);
      // Handle the exception for function dragTo, with no pointer-events:none
      Cypress.on('fail', (error) => {
        if (!error.message.includes('pointer-events: none')) {
          throw error
        }
      });
      dragTo('ZiellisteSchutz','AAA','Startliste');
      cy.getByAlias('ZiellisteSchutz').children()
        .should('have.length', 1);
    });

    it('drags to non write-protected list. ', () => {
      dragTo('Startliste', 'AAA', 'Zielliste');
      cy.getByAlias('Zielliste').children()
        .should('have.length', 1);
      dragTo('Zielliste','AAA','Startliste');
      cy.getByAlias('Zielliste').children()
        .should('have.length', 0);
    });
  });
});
