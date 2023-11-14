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
    cy.get('[data-cy="secret-key-input"]').type(secretKey);
    cy.get('[data-cy="secretKey-login-button"]').click();
  };

  xdescribe("Dashboard body", () => {
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
        "18295.9998700 Lumens (XLM)"
      );
    });

    it("Should show the correct balance for an unfunded account", () => {
      login(keys.loggedUserUnfundedSecretKey);
      cy.get('[data-cy="balance-value"]').should("have.text", "0 Lumens (XLM)");
    });
  });

  xdescribe("Dashboard header", () => {
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

    xdescribe("Copy button", () => {
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

    xdescribe("Log out button", () => {
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

  xdescribe("Footer", () => {
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

    xdescribe("Footer links", () => {
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

  xdescribe("Send assets", () => {
    xdescribe("Send assets button", () => {
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

    xdescribe("Payment modal", () => {
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

      it("Should have a 'Send Lumens' title", () => {
        cy.get('[data-cy="send-payment-modal-title"]')
          .should("exist")
          .should("have.text", "Send Lumens");
      });
    });

    xdescribe("Send assets funcionality", () => {
      const {
        validSignerKey,
        unvalidSignerKey,
        validDestinationPublicKey,
        unvalidDestinationPublicKey,
        validAmount,
        unvalidAmount,
      } = {
        validSignerKey: keys.loggedUserFundedSecretKey,
        unvalidSignerKey: "invalid",
        validDestinationPublicKey: Cypress.env(
          "UNFUNDED_DESTINATION_PUBLIC_KEY" || ""
        ),
        unvalidDestinationPublicKey: "invalid",
        validAmount: "110",
        unvalidAmount: "0",
      };

      it("Should display the error message '*Invalid destination id' when the user tries to send assets to an invalid destination account", () => {
        login(keys.loggedUserFundedSecretKey);
        cy.get('[data-cy="send-payment-button"]')
          .should("exist")
          .trigger("click");
        cy.get('[data-cy="destination-account-input"]').type(
          unvalidDestinationPublicKey
        );
        cy.get('[data-cy="amount-input"]').type(validAmount);
        cy.get('[data-cy="signer-account-input"]').type(validSignerKey);
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
          validDestinationPublicKey
        );
        cy.get('[data-cy="amount-input"]').type(validAmount);
        cy.get('[data-cy="signer-account-input"]').type(unvalidSignerKey);
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
          validDestinationPublicKey
        );
        cy.get('[data-cy="amount-input"]').type(unvalidAmount);
        cy.get('[data-cy="signer-account-input"]').type(validSignerKey);
        cy.get('[data-cy="send-payment-modal-button"]').click();
        cy.get('[data-cy="amount-error-message"]')
          .should("exist")
          .should("have.text", "*Invalid amount");
      });

      it("Should display the error message 'Payment Failed' when the transaction fails", () => {
        login(keys.loggedUserFundedSecretKey);
        cy.get('[data-cy="send-payment-button"]')
          .should("exist")
          .trigger("click");
        cy.get('[data-cy="destination-account-input"]').type(
          validDestinationPublicKey
        );
        cy.get('[data-cy="amount-input"]').type("1000000000000000");
        cy.get('[data-cy="signer-account-input"]').type(validSignerKey);
        cy.get('[data-cy="send-payment-modal-button"]').click();
        cy.get('[data-cy="payment-response-alert"]')
          .should("exist")
          .should("have.text", "Payment Failed");
      });

      it("Should show the message 'Successful payment' when the transaction is successful", () => {
        login(validSignerKey);
        cy.get('[data-cy="send-payment-button"]')
          .should("exist")
          .trigger("click");
        cy.get('[data-cy="destination-account-input"]').type(
          validDestinationPublicKey
        );
        cy.get('[data-cy="amount-input"]').type(validAmount);
        cy.get('[data-cy="signer-account-input"]').type(validSignerKey);
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

  xdescribe("Payments history", () => {
    const {
      sourceAccountPublicKey = Cypress.env("SOURCE_ACCOUNT_PUBLIC_KEY") || "",
      destinationAccountPublicKey = Cypress.env(
        "DESTINATION_ACCOUNT_PUBLIC_KEY"
      ) || "",
      successfulPaymentHash = Cypress.env("SUCCESSFUL_PAYMENT_HASH") || "",
    } = {
      sourceAccountPublicKey: Cypress.env("SOURCE_ACCOUNT_PUBLIC_KEY") || "",
      destinationAccountPublicKey:
        Cypress.env("DESTINATION_ACCOUNT_PUBLIC_KEY") || "",
      successfulPaymentHash: Cypress.env("SUCCESSFUL_PAYMENT_HASH") || "",
    };

    it("Should have a 'Payments history' title", () => {
      login(keys.loggedUserFundedSecretKey);
      cy.get('[data-cy="payments-history-title"]')
        .should("exist")
        .should("have.text", "Payments History");
    });

    it("Should show the payments history container when the user logs in with a funded account", () => {
      login(keys.loggedUserFundedSecretKey);
      cy.get('[data-cy="payments-history-container"]').should("exist");
    });

    it("Should not show the payments history container when the user logs in with an unfunded account", () => {
      login(keys.loggedUserUnfundedSecretKey);
      cy.get('[data-cy="payments-history-container"]').should("not.exist");
    });

    it("Should show a text with the message 'No payments yet' when the account and has no payments history", () => {
      login(keys.loggedUserFundedSecretKey);
      cy.get('[data-cy="no-payments-message"]')
        .should("exist")
        .should("have.text", "There are no payments to show");
    });

    it("Should show payments with the correct title", () => {
      login(keys.loggedUserFundedSecretKey);
      cy.get('[data-cy="payment-title-1"]')
        .should("exist")
        .should("have.text", "PAYMENT");
    });

    it("Should show payments with the correct source account", () => {
      login(keys.loggedUserFundedSecretKey);
      cy.get('[data-cy="page-number-12"]').should("exist").click();
      cy.get('[data-cy="source-account-payment-0"]')
        .should("exist")
        .should("have.text", `From: ${sourceAccountPublicKey}`);
    });

    it("Should show payments with the correct destination account", () => {
      login(keys.loggedUserFundedSecretKey);
      cy.get('[data-cy="destination-account-payment-1"]')
        .should("exist")
        .should("have.text", `To: ${destinationAccountPublicKey}`);
    });

    it("Should show payments with the correct amount", () => {
      login(keys.loggedUserFundedSecretKey);
      cy.get('[data-cy="amount-payment-1"]')
        .should("exist")
        .should("have.text", "Amount: 500.0000000 XML");
    });

    it("Should show payments with the correct date", () => {
      login(keys.loggedUserFundedSecretKey);
      cy.get('[data-cy="payment-date-1"]')
        .should("exist")
        .should("have.text", "Date: 2023-11-07");
    });

    it("Should show payments with the correct time", () => {
      login(keys.loggedUserFundedSecretKey);
      cy.get('[data-cy="payment-time-1"]')
        .should("exist")
        .should("have.text", "Time: 14:21");
    });

    it("Should show payments with the correct Hash", () => {
      login(keys.loggedUserFundedSecretKey);
      cy.get('[data-cy="payment-hash-1"]')
        .should("exist")
        .should("have.text", `Hash: ${successfulPaymentHash}`);
    });

    it("Should show the correct status", () => {
      login(keys.loggedUserFundedSecretKey);
      cy.get('[data-cy="payment-status-1"]')
        .should("exist")
        .should("have.text", "Status: Success");
    });

    it("Should show the correct number of payments per page", () => {
      login(keys.loggedUserFundedSecretKey);
      cy.get('[data-cy="payment-title-4"]').should("exist");
    });

    xdescribe("Pagination", () => {
      it("Should exist", () => {
        login(keys.loggedUserFundedSecretKey);
        cy.get('[data-cy="pagination"]').should("exist");
      });

      it("Should have the correct number of pages", () => {
        login(keys.loggedUserFundedSecretKey);
        cy.get('[data-cy="page-number-12"]')
          .should("exist")
          .should("have.text", "12");
      });

      it("Should display the correct page when the user clicks on a page number", () => {
        login(keys.loggedUserFundedSecretKey);
        cy.get('[data-cy="page-number-12"]').should("exist").click();
        cy.get('[data-cy="payment-title-1"]')
          .should("exist")
          .should("have.text", "CREATE_ACCOUNT");
      });
    });
  });

  xdescribe("Receive assets", () => {
    it("Should have a receive assets button with the text 'Receive'", () => {
      login(keys.loggedUserFundedSecretKey);
      cy.get('[data-cy="receive-payment-button"]')
        .should("exist")
        .should("have.text", "Receive");
    });

    it("Should display the receive assets modal when the user clicks on the receive assets button", () => {
      login(keys.loggedUserFundedSecretKey);
      cy.get('[data-cy="receive-payment-button"]')
        .should("exist")
        .trigger("click");
      cy.get('[data-cy="receive-payment-modal"]').should("exist");
    });

    xdescribe("Receive payment modal", () => {
      beforeEach(() => {
        login(keys.loggedUserFundedSecretKey);
        cy.get('[data-cy="receive-payment-button"]')
          .should("exist")
          .trigger("click");
      });

      it("Should have a close button with the text 'Close'", () => {
        cy.get('[data-cy="close-receive-payment-button"]')
          .should("exist")
          .should("have.text", "Close");
      });

      it("Should be unmounted when the user clicks on the close button", () => {
        cy.get('[data-cy="close-receive-payment-button"]').click();
        cy.wait(500);
        cy.get('[data-cy="qr-code"]').should("not.exist");
      });

      it("Should have a QR code", () => {
        cy.get('[data-cy="qr-code"]').should("exist");
      });

      it("Should have a title with the text 'Your account QR code'", () => {
        cy.get('[data-cy="receive-modal-title"]')
          .should("exist")
          .should("have.text", "Your account QR code");
      });

      it("Should have a description with the proper text", () => {
        cy.get('[data-cy="receive-modal-description"]')
          .should("exist")
          .should(
            "have.text",
            "Scan this QR code using a Stellar wallet app to make a payment to your account."
          );
      });

      xdescribe("Copy button", () => {
        it("Should have a copy button with the text 'Copy'", () => {
          cy.get('[data-cy="copy-text-modal-button"]')
            .should("exist")
            .should("have.text", "Copy public key");
        });

        it("Should change the text of the copy button to 'Copied! when the user clicks on it", () => {
          cy.get('[data-cy="copy-text-modal-button"]').trigger("click");
          cy.get('[data-cy="copy-text-modal-button"]').should(
            "have.text",
            "Copied!"
          );
        });

        it("Should copy the public key to the clipboard when the user clicks on the copy button", () => {
          cy.window().then((win) => {
            win.navigator.clipboard.readText().then((text) => {
              expect(text).to.eq(keys.loggedUserFundedPublicKey);
            });
          });
        });

        it("Should change the text of the copy button back to 'Copy public key' after 1 second", () => {
          const DELAY_TIME: number = 1001;
          cy.get('[data-cy="copy-text-modal-button"]').trigger("click");
          cy.wait(DELAY_TIME);
          cy.get('[data-cy="copy-text-modal-button"]').should(
            "have.text",
            "Copy public key"
          );
        });
      });
    });
  });

  describe("Sign transactions with externals wallets", () => {
    beforeEach(() => {
      login(keys.loggedUserFundedSecretKey);
      cy.get('[data-cy="send-payment-button"]').trigger("click");
    });

    it("Should have a message to offer the user to sign transactions with an external wallet", () => {
      cy.get('[data-cy="sign-transaction-message"]')
        .should("exist")
        .should("have.text", "Or sign with:");
    });

    it("Should have a button to sign transactions with Albedo", () => {
      cy.get('[data-cy="sign-with-albedo"]')
        .should("exist")
        .should("have.text", "Albedo");
    });

    it("Should have a button that opens a window to sign with Albedo", () => {
      const { validDestinationPublicKey, validAmount } = {
        validDestinationPublicKey: Cypress.env(
          "UNFUNDED_DESTINATION_PUBLIC_KEY" || ""
        ),
        validAmount: "110",
      };
      cy.get('[data-cy="amount-input"]').type(validAmount);
      cy.window().then((win) => {
        cy.stub(win, "open").as("open");
      });
      cy.get('[data-cy="destination-account-input"]').type(
        validDestinationPublicKey
      );
      cy.get('[data-cy="memo-input"]').type("test");
      cy.get('[data-cy="sign-with-albedo"]').trigger("click");
      cy.get("@open").should(
        "have.been.calledOnceWith",
        "https://albedo.link/confirm"
      );
    });
  });
});
