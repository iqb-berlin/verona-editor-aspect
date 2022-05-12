import { InputAssistancePreset } from 'common/models/elements/element';

export class KeyLayout {
  static get = (preset: InputAssistancePreset | 'keyboard'): {
    default: string[][],
    shift: string[][],
    additional: string[][]
  } => {
    switch (preset) {
      case 'french': {
        return {
          default: [
            ['â', 'à', 'æ', 'ê', 'è', 'é', 'ë', 'î'],
            ['ï', 'ô', 'ò', 'œ', 'û', 'ù', 'ü', 'ç']
          ],
          shift: [
            ['Â', 'À', 'Æ', 'Ê', 'È', 'É', 'Ë', 'Î'],
            ['Ï', 'Ô', 'Ò', 'Œ', 'Û', 'Ù', 'Ü', 'Ç']
          ],
          additional: [[]]
        };
      }
      case 'comparisonOperators': {
        return {
          default: [
            ['<', '=', '>']
          ],
          shift: [[]],
          additional: [[]]
        };
      }
      case 'numbersAndOperators': {
        return {
          default: [
            ['7', '8', '9'],
            ['4', '5', '6'],
            ['1', '2', '3'],
            ['0']
          ],
          shift: [[]],
          additional: [
            ['+', '-'],
            ['·', ':'], // '·' = U+00B7
            ['=']
          ]
        };
      }
      case 'numbersAndBasicOperators': {
        return {
          default: [
            ['7', '8', '9'],
            ['4', '5', '6'],
            ['1', '2', '3'],
            ['0']
          ],
          shift: [[]],
          additional: [
            ['+', '-'],
            ['·', ':'] // '·' = U+00B7
          ]
        };
      }
      case 'squareDashDot': {
        return {
          default: [
            ['⬜', '❘', '∙'] // U+2B1C, U+2758, U+2219
          ],
          shift: [[]],
          additional: [[]]
        };
      }
      case 'placeValue': {
        return {
          default: [
            ['•'] // U+2022
          ],
          shift: [[]],
          additional: [[]]
        };
      }
      case 'numbers': {
        return {
          default: [
            ['7', '8', '9'],
            ['4', '5', '6'],
            ['1', '2', '3'],
            ['0']
          ],
          shift: [[]],
          additional: [[]]
        };
      }
      default: { // keyboard
        return {
          default: [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'ß', 'BACKSPACE'],
            ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü', 'RETURN'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä'],
            ['SHIFT', 'y', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-'],
            ['SPACE']
          ],
          shift: [
            ['!', '"', '§', '$', '%', '&', '/', '(', ')', '=', '?', 'BACKSPACE'],
            ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Ü', 'RETURN'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä'],
            ['SHIFT', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', ';', ':', '_'],
            ['SPACE']
          ],
          additional: [[]]
        };
      }
    }
  };
}
