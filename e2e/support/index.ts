export {};

declare global {
  namespace Cypress {
    interface Chainable {
      loadUnit(value: string): Chainable<JQuery<HTMLElement>>;
      saveUnit(filepath?: string): Chainable<JQuery<HTMLElement>>;
      openPlayer(): Chainable<JQuery<HTMLElement>>;
      openEditor(): Chainable<JQuery<HTMLElement>>;
    }
  }
}
