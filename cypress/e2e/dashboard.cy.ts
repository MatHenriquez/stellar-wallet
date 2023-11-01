describe("Dashboard", () => {
  type KeyType = {
    [key: string]: string;
  };

  const keys: KeyType = {
    unfundedPublicKey: Cypress.env("UNFUNDED_PUBLIC_KEY") || "",
    unfundedSecretKey: Cypress.env("UNFUNDED_SECRET_KEY") || "",
    fundedPublicKey: Cypress.env("FUNDED_PUBLIC_KEY") || "",
    fundedSecretKey: Cypress.env("FUNDED_SECRET_KEY") || "",
  };

  it("Should render the header", () => {
    cy.visit("/dashboard");
    cy.get('[data-cy="header-container"]').should("exist");
  });

  it("Should render the footer", () => {
    cy.visit("/dashboard");
    cy.get('[data-cy="footer-container"]').should("exist");
  });

  it("Should have the balance and public key titles", () => {
    cy.visit("/dashboard");
    cy.get('[data-cy="balance-title"]').should("have.text", "Your Balance");
    cy.get('[data-cy="public-key-title"]').should(
      "have.text",
      "Your Stellar Public Key"
    );
  });

  it("Should show the correct public key when user logs in with a secret key", () => {
    cy.visit("/");
    cy.contains("Sign In with your Secret Key").click();
    cy.get('[type="password"]').type(keys.unfundedSecretKey);
    cy.get("#signin-button").click();
    cy.get('[data-cy="public-key-value"]').should(
      "have.text",
      keys.unfundedPublicKey
    );
  });

  it("Should show the correct balance for a funded account", () => {
    cy.visit("/");
    cy.contains("Sign In with your Secret Key").click();
    cy.get('[type="password"]').type(keys.fundedSecretKey);
    cy.get("#signin-button").click();
    cy.get('[data-cy="balance-value"]').should(
      "have.text",
      "10000.0000000 Lumens (XLM)"
    );
  });

  it("Should show the correct balance for an unfunded account", () => {
    cy.visit("/");
    cy.contains("Sign In with your Secret Key").click();
    cy.get('[type="password"]').type(keys.unfundedSecretKey);
    cy.get("#signin-button").click();
    cy.get('[data-cy="balance-value"]').should("have.text", "0 Lumens (XLM)");
  });
});
