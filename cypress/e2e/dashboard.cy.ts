describe("Dashboard", () => {
  type KeyType = {
    [key: string]: string;
  };

  const keys: KeyType = {
    loggedUserUnfundedPublicKey:
      Cypress.env("UNFUNDED_SOURCE_ACCOUNT_PUBLIC_KEY") || "",
    loggedUserUnfundedSecretKey:
      Cypress.env("UNFUNDED_SOURCE_ACCOUNT_SECRET_KEY") || "",
    loggedUserFundedPublicKey:
      Cypress.env("FUNDED_SOURCE_ACCOUNT_PUBLIC_KEY") || "",
    loggedUserFundedSecretKey:
      Cypress.env("FUNDED_SOURCE_ACCOUNT_SECRET_KEY") || "",
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
    login(keys.loggedUserUnfundedSecretKey);
    cy.get('[data-cy="public-key-value"]').should(
      "have.text",
      keys.loggedUserUnfundedPublicKey
    );
  });

  it("Should show the correct balance for a funded account", () => {
    login(keys.loggedUserFundedSecretKey);
    cy.get('[data-cy="balance-value"]').should(
      "have.text",
      "18173.0000000 Lumens (XLM)"
    );
  });

  it("Should show the correct balance for an unfunded account", () => {
    login(keys.loggedUserUnfundedSecretKey);
    cy.get('[data-cy="balance-value"]').should("have.text", "0 Lumens (XLM)");
  });

  describe("Dashboard header", () => {
    it("Should have the wallet brand", () => {
      cy.visit("/dashboard");
      cy.get('[data-cy="header-brand"]').should("have.text", "My_Wallet");
    });

    it("Should display the correct abbreviated public key when user logs in with a secret key", () => {
      const abbreviatedPublicKey: string = "GAS4V...AL";
      login(keys.loggedUserUnfundedSecretKey);
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
        login(keys.loggedUserFundedSecretKey);
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
      const homeUrl: string = Cypress.env("HOME_URL") || "";

      it("Should redirect the user to the home page when the he clicks on the log out button", () => {
        login(keys.loggedUserFundedSecretKey);
        cy.get('[data-cy="log-out-button"]').should("exist").trigger("click");
        cy.url().should("eq", `${homeUrl}/`);
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

  describe("Send assets", () => {
    describe("Send assets button", () => {
      it("Should have a send assets button with the text 'Send'", () => {
        login(keys.loggedUserFundedSecretKey);
        cy.get('[data-cy="send-payment-button"]')
          .should("exist")
          .should("have.text", "Send");
      });

      it("Should have a disabled send assets button when the user logs in with an unfunded account", () => {
        login(keys.loggedUserUnfundedSecretKey);
        cy.get('[data-cy="send-payment-button"]')
          .should("exist")
          .should("be.disabled");
      });

      it("Should have an enabled send assets button when the user logs in with a funded account", () => {
        login(keys.loggedUserFundedSecretKey);
        cy.get('[data-cy="send-payment-button"]')
          .should("exist")
          .should("not.be.disabled");
      });
    });

    describe("Payment modal", () => {
      beforeEach(() => {
        login(keys.loggedUserFundedSecretKey);
        cy.get('[data-cy="send-payment-button"]')
          .should("exist")
          .trigger("click");
      });

      it("Should display the payment modal when the user clicks on the send assets button", () => {
        login(keys.loggedUserFundedSecretKey);
        cy.get('[data-cy="send-payment-button"]')
          .should("exist")
          .trigger("click");
        cy.get('[data-cy="payment-modal"]').should("exist");
      });

      it("Should have a close button with the text 'Close'", () => {
        cy.get('[data-cy="close-payment-modal-button"]')
          .should("exist")
          .should("have.text", "Close");
      });

      it("Should be unmounted when the user clicks on the close button", () => {
        cy.get('[data-cy="close-payment-modal-button"]').trigger("click");
        cy.get('[data-cy="payment-modal"]').should("not.exist");
      });

      it("Should have a send button with the text 'Send'", () => {
        cy.get('[data-cy="send-payment-modal-button"]')
          .should("exist")
          .should("have.value", "Send");
      });

      it("Should have a source account input field with the 'Signer' label", () => {
        cy.get('[data-cy="signer-account-input"]').should("exist");
        cy.get('[data-cy="signer-account-label"]')
          .should("exist")
          .should("have.text", "Signer");
      });

      it("Should have a destination account input field with the 'Destination' label", () => {
        cy.get('[data-cy="destination-account-input"]').should("exist");
        cy.get('[data-cy="destination-account-label"]')
          .should("exist")
          .should("have.text", "Destination");
      });

      it("Should have an amount input field with the 'Amount' label", () => {
        cy.get('[data-cy="amount-input"]').should("exist");
        cy.get('[data-cy="amount-label"]')
          .should("exist")
          .should("have.text", "Amount");
      });

      it("Should have a memo input field with the 'Memo' label", () => {
        cy.get('[data-cy="memo-input"]').should("exist");
        cy.get('[data-cy="memo-label"]')
          .should("exist")
          .should("have.text", "Memo");
      });

      it("Should have a fee input field with the 'Fee' label", () => {
        cy.get('[data-cy="fee-input"]').should("exist");
        cy.get('[data-cy="fee-label"]')
          .should("exist")
          .should("have.text", "Fee");
      });

      it("Should have a time out input field with the 'Timeout' label", () => {
        cy.get('[data-cy="time-out-input"]').should("exist");
        cy.get('[data-cy="time-out-label"]')
          .should("exist")
          .should("have.text", "Timeout");
      });

      it("Should have a 'Send Lumens' title", () => {
        cy.get('[data-cy="send-payment-modal-title"]')
          .should("exist")
          .should("have.text", "Send Lumens");
      });
    });

    describe("Send assets funcionality", () => {
      const testingPaymentData = {
        validSignerKey: keys.loggedUserFundedSecretKey,
        unvalidSignerKey: "invalid",
        validDestinationPublicKey: Cypress.env(
          "UNFUNDED_DESTINATION_PUBLIC_KEY" || ""
        ),
        unvalidDestinationPublicKey: "invalid",
        validAmount: "110",
        unvalidAmount: "0",
        validTimeOut: 30,
        unvalidTimeOut: -1,
        validFee: 100,
        unvalidFee: 0,
      };

      it("Should display the error message '*Invalid destination id' when the user tries to send assets to an invalid destination account", () => {
        login(keys.loggedUserFundedSecretKey);
        cy.get('[data-cy="send-payment-button"]')
          .should("exist")
          .trigger("click");
        cy.get('[data-cy="destination-account-input"]').type(
          testingPaymentData.unvalidDestinationPublicKey
        );
        cy.get('[data-cy="amount-input"]').type(testingPaymentData.validAmount);
        cy.get('[data-cy="fee-input"]').type(testingPaymentData.validFee.toString());
        cy.get('[data-cy="time-out-input"]').type(
          testingPaymentData.validTimeOut.toString()
        );
        cy.get('[data-cy="signer-account-input"]').type(
          testingPaymentData.validSignerKey
        );
        cy.get('[data-cy="send-payment-modal-button"]').click();
        cy.get('[data-cy="destination-account-error-message"]')
          .should("exist")
          .should("have.text", "*Invalid destination id");
      });

      it("Should display the error message '*Invalid signer key' when the user tries to send assets with an invalid signer key", () => {
        login(keys.loggedUserFundedSecretKey);
        cy.get('[data-cy="send-payment-button"]')
          .should("exist")
          .trigger("click");
        cy.get('[data-cy="destination-account-input"]').type(
          testingPaymentData.validDestinationPublicKey
        );
        cy.get('[data-cy="amount-input"]').type(testingPaymentData.validAmount);
        cy.get('[data-cy="fee-input"]').type(testingPaymentData.validFee.toString());
        cy.get('[data-cy="time-out-input"]').type(
          testingPaymentData.validTimeOut.toString()
        );
        cy.get('[data-cy="signer-account-input"]').type(
          testingPaymentData.unvalidSignerKey
        );
        cy.get('[data-cy="send-payment-modal-button"]').click();
        cy.get('[data-cy="signer-account-error-message"]')
          .should("exist")
          .should("have.text", "*Invalid signer key");
      });

      it("Should display the error message '*Invalid amount' when the user tries to send assets with an invalid amount", () => {
        login(keys.loggedUserFundedSecretKey);
        cy.get('[data-cy="send-payment-button"]')
          .should("exist")
          .trigger("click");
        cy.get('[data-cy="destination-account-input"]').type(
          testingPaymentData.validDestinationPublicKey
        );
        cy.get('[data-cy="amount-input"]').type(testingPaymentData.unvalidAmount);
        cy.get('[data-cy="fee-input"]').type(testingPaymentData.validFee.toString());
        cy.get('[data-cy="time-out-input"]').type(
          testingPaymentData.validTimeOut.toString()
        );
        cy.get('[data-cy="signer-account-input"]').type(
          testingPaymentData.validSignerKey
        );
        cy.get('[data-cy="send-payment-modal-button"]').click();
        cy.get('[data-cy="amount-error-message"]')
          .should("exist")
          .should("have.text", "*Invalid amount");
      });

      it("Should display the error message '*Invalid fee' when the user tries to send assets with an invalid fee", () => {
        login(keys.loggedUserFundedSecretKey);
        cy.get('[data-cy="send-payment-button"]')
          .should("exist")
          .trigger("click");
        cy.get('[data-cy="destination-account-input"]').type(
          testingPaymentData.validDestinationPublicKey
        );
        cy.get('[data-cy="amount-input"]').type(testingPaymentData.validAmount);
        cy.get('[data-cy="fee-input"]').type(testingPaymentData.unvalidFee.toString());
        cy.get('[data-cy="time-out-input"]').type(
          testingPaymentData.validTimeOut.toString()
        );
        cy.get('[data-cy="signer-account-input"]').type(
          testingPaymentData.validSignerKey
        );
        cy.get('[data-cy="send-payment-modal-button"]').click();
        cy.get('[data-cy="fee-error-message"]')
          .should("exist")
          .should("have.text", "*Invalid fee");
      });

      it("Should display the error message '*Invalid time out' when the user tries to send assets with an invalid time out", () => {
        login(keys.loggedUserFundedSecretKey);
        cy.get('[data-cy="send-payment-button"]')
          .should("exist")
          .trigger("click");
        cy.get('[data-cy="destination-account-input"]').type(
          testingPaymentData.validDestinationPublicKey
        );
        cy.get('[data-cy="amount-input"]').type(testingPaymentData.validAmount);
        cy.get('[data-cy="fee-input"]').type(testingPaymentData.validFee.toString());
        cy.get('[data-cy="time-out-input"]').type(
          testingPaymentData.unvalidTimeOut.toString()
        );
        cy.get('[data-cy="signer-account-input"]').type(
          testingPaymentData.validSignerKey
        );
        cy.get('[data-cy="send-payment-modal-button"]').click();
        cy.get('[data-cy="time-out-error-message"]')
          .should("exist")
          .should("have.text", "*Invalid time out");
      });

      it("Should display the error message 'Payment Failed' when the transaction fails", () => {
        login(keys.loggedUserFundedSecretKey);
        cy.get('[data-cy="send-payment-button"]')
          .should("exist")
          .trigger("click");
        cy.get('[data-cy="destination-account-input"]').type(
          testingPaymentData.validDestinationPublicKey
        );
        cy.get('[data-cy="amount-input"]').type("1000000000000000");
        cy.get('[data-cy="fee-input"]').type(testingPaymentData.validFee.toString());
        cy.get('[data-cy="time-out-input"]').type(
          testingPaymentData.validTimeOut.toString()
        );
        cy.get('[data-cy="signer-account-input"]').type(
          testingPaymentData.validSignerKey
        );
        cy.get('[data-cy="send-payment-modal-button"]').click();
        cy.get('[data-cy="payment-response-alert"]')
          .should("exist")
          .should("have.text", "Payment Failed");
      });

      it("Should show the message 'Successful payment' when the transaction is successful", () => {
        login(testingPaymentData.validSignerKey);
        cy.get('[data-cy="send-payment-button"]')
          .should("exist")
          .trigger("click");
        cy.get('[data-cy="destination-account-input"]').type(
          testingPaymentData.validDestinationPublicKey
        );
        cy.get('[data-cy="amount-input"]').type(testingPaymentData.validAmount);
        cy.get('[data-cy="fee-input"]').type(testingPaymentData.validFee.toString());
        cy.get('[data-cy="time-out-input"]').type(
          testingPaymentData.validTimeOut.toString()
        );
        cy.get('[data-cy="signer-account-input"]').type(
          testingPaymentData.validSignerKey
        );
        cy.get('[data-cy="send-payment-modal-button"]').click();
        cy.get('[data-cy="send-payment-button"]')
          .should("exist")
          .trigger("click");
        cy.get('[data-cy="payment-response-alert"]')
          .should("exist")
          .should("have.text", "Successful payment");
      });
    });
  });
});
