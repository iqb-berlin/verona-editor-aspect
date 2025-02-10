import {addElement, addTextElement, selectFromDropdown, setCheckbox} from "../util";

export function addDescription(type: string, title: string,
                          settings?: Record<string, boolean>, id?: string): void {
  addElement(type,undefined,id);
  cy.contains('mat-form-field', 'Beschriftung')
    .find('textarea')
    .clear()
    .type(title);
  if (settings?.readOnly) setCheckbox('Schreibschutz');
  if (settings?.required) setCheckbox('Pflichtfeld');
  if (settings?.crossOutChecked) setCheckbox('Auswahl durchstreichen');
  if (settings?.strikeOtherOptions) setCheckbox('Nicht gewählte Optionen durchstreichen');
}

export function addOptions(options: string[] = [], rows: string[] = []): void {
  options.forEach(option => addOption(option));
  rows.forEach(row => addRow(row));
}

// From my point of view addOption and addRow, must be equal, but surprisingly, addOption
// does not work with find('textarea').
export function addOption(optionName: string): void {
  cy.contains('fieldset', 'Optionen')
    .contains('mat-form-field', 'Neue Option')
    .click()
    .type(`${optionName}{enter}`);
}

export function addRow(rowName: string): void {
  cy.contains('fieldset', 'Zeilen')
    .contains('mat-form-field', 'Neue Zeile')
    .find('textarea')
    .clear()
    .type(`${rowName}{enter}`);
}

export function moveSlider(slider:string,value:string): void {
  cy.get(`aspect-slider:contains(${slider})`)
    .find('input').invoke('val',value).trigger("change");
}

// function copied from https://devtoolsdaily.medium.com/generating-random-text-with-javascript-96f99a7fb8f4
export function generateRandomText(numParagraphs:number, numSentencesPerParagraph:number) {
  const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];
  const paragraphs = [];
  for (let p = 0; p < numParagraphs; p++) {
    const sentences = [];
    for (let i = 0; i < numSentencesPerParagraph; i++) {
      const numWords = Math.floor(Math.random() * 10) + 5;
      const sentenceWords = [];
      for (let j = 0; j < numWords; j++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        sentenceWords.push(words[randomIndex]);
      }
      const sentence = sentenceWords.join(' ') + '.';
      sentences.push(sentence.charAt(0).toUpperCase() + sentence.slice(1));
    }
    paragraphs.push(sentences.join(' '));
  }
  return paragraphs.join('\n\n');
}

export function createText(numParagraphs: number, numSentences: number, numColumns:number,
                           modus:string, settings?: Record<string, boolean>, ) {
  addTextElement(generateRandomText(numParagraphs, numSentences));
  // Number of columns
  cy.contains('mat-form-field', 'Anzahl der Spalten')
    .find('input')
    .clear().type(String(numColumns));

  // Color options
  if (settings?.highlightableOrange)  setCheckbox('Orange');
  if (settings?.highlightableTurquoise)  setCheckbox('Türkis');
  if (settings?.highlightableYellow)  setCheckbox('Gelb');
  if (settings?.hasSelectionPopup)  setCheckbox('Farbauswahl-Popup');

  selectFromDropdown('Markierungsmodus',modus);
}

export function selectRange(): void {
  cy.get('.text-container').contains('idunt')
    .trigger('mousedown')
    .then(($el) => {
      const el = $el[0]
      const document = el.ownerDocument;
      const range = document.createRange();
      range.selectNodeContents(el);
      // @ts-ignore
      document.getSelection().removeAllRanges(range);
      // @ts-ignore
      document.getSelection().addRange(range);
    })
    .trigger('mouseup')
}
