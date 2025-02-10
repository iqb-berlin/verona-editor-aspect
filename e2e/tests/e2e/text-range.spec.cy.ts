import {createText, selectRange} from "./options-util";

describe('Text element', { testIsolation: false }, () => {
  context('editor', () => {
    before('opens an editor', () => {
      cy.openEditor();
    });

    it('creates a text element with range mode', () => {
      createText(3,2,2,'Auswahl', {highlightableYellow: true,
        hasSelectionPopup:true, highlightableTurquoise:true})
    });

    after('save an unit definition', () => {
      cy.saveUnit('e2e/downloads/text-range.json');
    });
  });

  context('player', () => {
    before('opens a player, and loads the previously saved json file', () => {
      cy.openPlayer();
      cy.loadUnit('../downloads/text-range.json');
    });

    it('highlights two section in different colors', () => {
    });

    it('removes the second highlight selection of a text ', () => {
      cy.get('aspect-text-group-element')
        .find('button.marking-button').eq(0).click();
      selectRange();
    });
  });
});
