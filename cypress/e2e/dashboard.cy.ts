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

  const login: (secretKey: string) => void = (secretKey) => {
    cy.visit("/");
    cy.contains("Sign In with your Secret Key").click();
    cy.get('[type="password"]').type(secretKey);
    cy.get("#signin-button").click();
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
    login(keys.unfundedSecretKey);
    cy.get('[data-cy="public-key-value"]').should(
      "have.text",
      keys.unfundedPublicKey
    );
  });

  it("Should show the correct balance for a funded account", () => {
    login(keys.fundedSecretKey);
    cy.get('[data-cy="balance-value"]').should(
      "have.text",
      "10000.0000000 Lumens (XLM)"
    );
  });

  it("Should show the correct balance for an unfunded account", () => {
    login(keys.unfundedSecretKey);
    cy.get('[data-cy="balance-value"]').should("have.text", "0 Lumens (XLM)");
  });

  describe("Dashboard header", () => {
    const abbreviatePublicKey: (key: string) => string = (
      publicKey
    ): string => {
      return publicKey.slice(0, 5) + "..." + publicKey.slice(-2);
    };

    it("Should have the wallet brand", () => {
      cy.visit("/dashboard");
      cy.get('[data-cy="header-brand"]').should("have.text", "My_Wallet");
    });

    it("Should display the correct abbreviated public key when user logs in with a secret key", () => {
      const abbreviatedPublicKey: string = abbreviatePublicKey(
        keys.unfundedPublicKey
      );
      login(keys.unfundedSecretKey);
      cy.get('[data-cy="abbreviated-public-key"]').should(
        "have.text",
        abbreviatedPublicKey
      );
    });

    it("Should have a copy button with the text 'copy'", () => {
      cy.visit("/dashboard");
      cy.get('[data-cy="copy-button"]')
        .should("exist")
        .should("have.text", "copy");
    });

    it("Should have a log out button with the text 'log out'", () => {
      cy.visit("/dashboard");
      cy.get('[data-cy="log-out-button"]')
        .should("exist")
        .should("have.text", "Sign out");
    });

    describe("Copy button", () => {
      it("Should change the text of the copy button to 'copied! when the user clicks on it", () => {
        cy.visit("/dashboard");
        cy.get('[data-cy="copy-button"]').should("exist").trigger("click");
        cy.get('[data-cy="copy-button"]').should("have.text", "copied!");
      });

      it("Should copy the public key to the clipboard when the user clicks on the copy button", () => {
        login(keys.fundedSecretKey);
        cy.get('[data-cy="copy-button"]').should("exist").trigger("click");
        cy.window().then((win) => {
          win.navigator.clipboard.readText().then((text) => {
            expect(text).to.eq(keys.fundedPublicKey);
          });
        });
      });

      it("Should change the text of the copy button back to 'copy' after 1 second", () => {
        const delayTime: number = 1001;
        cy.visit("/dashboard");
        cy.get('[data-cy="copy-button"]').trigger("click");
        cy.wait(delayTime);
        cy.get('[data-cy="copy-button"]').should("have.text", "copy");
      });
    });

    describe("Log out button", () => {
      const homeUrl: string = Cypress.config().baseUrl || "";

      it("Should redirect the user to the home page when the he clicks on the log out button", () => {
        login(keys.fundedSecretKey);
        cy.get('[data-cy="log-out-button"]').should("exist").trigger("click");
        cy.url().should("eq", homeUrl + "/");
      });

      it("Should remove the secret key from the local storage when the user clicks on the log out button", () => {
        cy.window().then((win) => {
          expect(win.localStorage.getItem("publicKey")).to.be.null;
        });
      });
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
