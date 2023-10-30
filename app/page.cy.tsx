import Home from "./page";

describe("Home", () => {
  beforeEach(() => {
    cy.mount(<Home />);
  });

  it("should have the wallet brand", () => {
    cy.get('[href="#"]').should("have.text", "My_Wallet");
  });

  it("should have a link to sign in with a secret key", () => {
    cy.contains('Sign In with your Secret Key')
  });

  it("should have a link to create new keys", () => {
    cy.get('[data-te-toggle="modal"]').should(
      "have.text",
      "Create new keys and Sign Up"
    );
  });

  it("should show the keys when clicking the create new keys link", () => {
    cy.get('[data-te-target="#InfoModal"]').click();
    cy.contains("Public Key: ");
    cy.contains("Secret Key: ");
  });

  it("should show the login modal when clicking the sign in link", () => {
    cy.contains("Sign In with your Secret Key").click();
    cy.contains("Sign in with a secret Key");
    cy.contains("Sign In");
  });

  it("should close de login modal when clicking the close button", () => {
    cy.contains("Sign In with your Secret Key").click();
    cy.get('#signin-button').should('exist');
    cy.get('#close-button').click();
    cy.get('#login-modal').should('not.exist');
  });
});
