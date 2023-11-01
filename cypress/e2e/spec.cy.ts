import { generateKeys } from "../../app/helpers/generateKeys";

describe("End-to-End testing", () => {
  describe("Home page", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("Should have the proper background color", () => {
      cy.get("#home-container").should(
        "have.css",
        "background-color",
        "rgb(8, 51, 68)"
      );
    });

    it("Should have the wallet brand", () => {
      cy.get('[href="#"]').should("have.text", "My_Wallet");
    });

    it("Should have a link to sign in with a secret key", () => {
      cy.contains("Sign In with your Secret Key");
    });

    it("Should have a link to create new keys", () => {
      cy.get('[data-te-toggle="modal"]').should(
        "have.text",
        "Create new keys and Sign Up"
      );
    });

    it("Should show the keys when clicking the create new keys link", () => {
      cy.get('[data-te-toggle="modal"]').click();
      cy.contains("Public Key: ");
      cy.contains("Secret Key: ");
    });

    it("Should show the login modal when clicking the sign in link", () => {
      cy.contains("Sign In with your Secret Key").click();
      cy.contains("Sign in with a secret Key");
      cy.contains("Sign In");
    });

    it("Should close de login modal when clicking the close button", () => {
      cy.contains("Sign In with your Secret Key").click();
      cy.get("#signin-button").should("exist");
      cy.get("#close-button").click();
      cy.get("#login-modal").should("not.exist");
    });
  });

  describe("Login", () => {
    const secretKey: string = generateKeys().secret();

    beforeEach(() => {
      cy.visit("/");
    });

    it("Should be unable to log in with an invalid secret key", () => {
      cy.contains("Sign In with your Secret Key").click();
      cy.get("#signin-button").click();
      cy.get("#error-message").should("have.text", "Invalid secret key");
    });

    it("Should be able to log in with a valid secret key", () => {
      cy.contains("Sign In with your Secret Key").click();
      cy.get('[type="password"]').type(secretKey);
      cy.get("#signin-button").click();
      cy.get("#error-message").should("not.exist");
    });
  });

  describe("Footer", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("Should be rendered", () => {
      cy.get('[data-cy="footer-container"]').should("exist");
    });

    it("Should have the proper background color", () => {
      cy.get('[data-cy="footer-container"]').should(
        "have.css",
        "background-color",
        "rgb(22, 78, 99)"
      );
    });

    it("Should have the proper text color", () => {
      cy.get('[data-cy="footer-container"]').should(
        "have.css",
        "color",
        "rgb(255, 255, 255)"
      );
    });

    it("Should display the informative links", () => {
      cy.get('[data-cy="terms-link"]').should("have.text", "Terms of Service");
      cy.get('[data-cy="privacy-link"]').should("have.text", "Privacy Policy");
      cy.get('[data-cy="repository-link"]').should("exist");
    });

    describe("Footer links", () => {
      type LinkType = {
        [key: string]: string;
      };

      const links: LinkType = {
        termsLink: Cypress.env("TERMS_OF_SERVICE_LINK") || "",
        privacyLink: Cypress.env("PRIVACY_POLICY_LINK") || "",
        repositoryLink: Cypress.env("GITHUB_LINK") || "",
      };

      beforeEach(() => {
        cy.visit("/");
      });

      it("Should have a Terms of service link that opens the terms of service page in a new tab", () => {
        cy.get('[data-cy="terms-link"]')
          .should("have.attr", "target", "blank")
          .should("have.attr", "href", links.termsLink);
      });

      it("Should have a Privacy policy link that opens the the privacy policy page in a new tab", () => {
        cy.get('[data-cy="privacy-link"]')
          .should("have.attr", "target", "blank")
          .should("have.attr", "href", links.privacyLink);
      });

      it("Should have a Repository link that opens the repository page in a new tab", () => {
        cy.get('[data-cy="repository-link"]')
          .should("have.attr", "target", "blank")
          .should("have.attr", "href", links.repositoryLink);
      });
    });
  });
});
