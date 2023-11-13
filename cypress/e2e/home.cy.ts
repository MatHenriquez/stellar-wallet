import { generateKeys } from "../../app/helpers/generateKeys";

describe("Home page", () => {
  describe("Components", () => {
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
  });

  describe("Login with secret key", () => {
    const secretKey: string = generateKeys().secret();

    beforeEach(() => {
      cy.visit("/");
    });

    it("Should have a button to log in with a secret key", () => {
      cy.get('[data-cy="secretKey-login-button"]').should("exist");
    });

    it("Should have an input field for the secret key", () => {
      cy.get('[data-cy="secret-key-input"]').should("exist");
    });

    it("Should show an error message when the user tries to login with an invalid secret key", () => {
      cy.get('[data-cy="secret-key-input"]').type("fake_secret_key");
      cy.get('[data-cy="secretKey-login-button"]').click();
      cy.get('[data-cy="login-error-message"]').should("exist");
    });

    it("Should hide the error message when the user clicks on the error message close button", () => {
      cy.get('[data-cy="secret-key-input"]').type("fake_secret_key");
      cy.get('[data-cy="secretKey-login-button"]').click();
      cy.get('[data-cy="login-error-message"]').should("exist");
      cy.get('[data-cy="error-message-close-button"]').click();
      cy.get('[data-cy="login-error-message"]').should("not.exist");
    });

    it("Should redirect to the dashboard page after logging in with a valid secret key", () => {
      cy.get('[data-cy="secret-key-input"]').type(secretKey);
      cy.get('[data-cy="secretKey-login-button"]').click();
      cy.url().should("include", "/dashboard");
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

  describe("Albedo login button", () => {
    it("Should exist with text 'Connect with Albedo'", () => {
      cy.visit("/");
      cy.get('[data-cy="albedo-login-button"]')
        .should("exist")
        .should("have.text", "Connect with Albedo");
    });

    it("Should open the Albedo login page", () => {
      cy.visit("/");
      cy.window().then((win) => {
        cy.stub(win, "open").as("open");
      });
      cy.get('[data-cy="albedo-login-button"]').trigger("click");
      cy.get("@open").should(
        "have.been.calledOnceWith",
        "https://albedo.link/confirm"
      );
    });
  });
});
