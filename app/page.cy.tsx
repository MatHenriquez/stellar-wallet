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
});
