import { AssertionError } from "assert";
import uuid from "uuid/v4";

import { PaymentRequest } from "../src/types";
import { expect } from "./chai";

import {
  validateGlobalConfig,
  validateProductConfig,
  validateRequestToPay,
  validateSubscriptionConfig,
  validateUserConfig
} from "../src/validate";

describe("Validate", function() {
  describe("validateGlobalConfig", function() {
    context("when callbackHost is not specified", function() {
      it("throws an error", function() {
        expect(validateGlobalConfig.bind(null, {})).to.throw(
          AssertionError,
          "callbackHost is required"
        );
      });
    });

    context("when callbackHost is specified", function() {
      it("doesn't throw", function() {
        expect(
          validateGlobalConfig.bind(null, { callbackHost: "example.com" })
        ).to.not.throw();
      });
    });

    context("when environment is specified", function() {
      context("and is not sandbox", function() {
        context("and baseUrl is not specified", function() {
          it("throws", function() {
            expect(
              validateGlobalConfig.bind(null, {
                callbackHost: "example.com",
                environment: "production"
              })
            ).to.throw(
              AssertionError,
              "baseUrl is required if environment is not sandbox"
            );
          });
        });

        context("and baseUrl is specified", function() {
          it("doesn't throw", function() {
            expect(
              validateGlobalConfig.bind(null, {
                callbackHost: "example.com",
                environment: "production",
                baseUrl: "mtn production base url"
              })
            ).to.not.throw();
          });
        });
      });
    });
  });

  describe("validateProductConfig", function() {
    context("when primaryKey is not specified", function() {
      it("throws an error", function() {
        expect(validateProductConfig.bind(null, {})).to.throw(
          AssertionError,
          "primaryKey is required"
        );
      });
    });

    context("when userId is not specified", function() {
      it("throws an error", function() {
        expect(
          validateProductConfig.bind(null, { primaryKey: "test primary key" })
        ).to.throw(AssertionError, "userId is required");
      });
    });

    context("when userSecret is not specified", function() {
      it("throws an error", function() {
        expect(
          validateProductConfig.bind(null, {
            primaryKey: "test primary key",
            userId: "test user id"
          })
        ).to.throw(AssertionError, "userSecret is required");
      });
    });

    context("when userId is not a valid uuid", function() {
      it("throws an error", function() {
        expect(
          validateProductConfig.bind(null, {
            primaryKey: "test primary key",
            userId: "test user id",
            userSecret: "test user secret"
          })
        ).to.throw(AssertionError, "userId must be a valid uuid v4");
      });
    });

    context("when the config is valid", function() {
      it("throws an error", function() {
        expect(
          validateProductConfig.bind(null, {
            primaryKey: "test primary key",
            userId: uuid(),
            userSecret: "test user secret"
          })
        ).to.not.throw();
      });
    });
  });

  describe("validateSubscriptionConfig", function() {
    context("when primaryKey is not specified", function() {
      it("throws an error", function() {
        expect(validateSubscriptionConfig.bind(null, {})).to.throw(
          AssertionError,
          "primaryKey is required"
        );
      });
    });

    context("when primaryKey is specified", function() {
      it("throws an error", function() {
        expect(
          validateSubscriptionConfig.bind(null, {
            primaryKey: "test primary key"
          })
        ).to.not.throw();
      });
    });
  });

  describe("validateUserConfig", function() {
    context("when userId is not specified", function() {
      it("throws an error", function() {
        expect(validateUserConfig.bind(null, {})).to.throw(
          AssertionError,
          "userId is required"
        );
      });
    });

    context("when userSecret is not specified", function() {
      it("throws an error", function() {
        expect(
          validateUserConfig.bind(null, {
            userId: "test user id"
          })
        ).to.throw(AssertionError, "userSecret is required");
      });
    });

    context("when userId is not a valid uuid", function() {
      it("throws an error", function() {
        expect(
          validateUserConfig.bind(null, {
            userId: "test user id",
            userSecret: "test user secret"
          })
        ).to.throw(AssertionError, "userId must be a valid uuid v4");
      });
    });

    context("when the config is valid", function() {
      it("throws an error", function() {
        expect(
          validateUserConfig.bind(null, {
            userId: uuid(),
            userSecret: "test user secret"
          })
        ).to.not.throw();
      });
    });
  });

  describe("validateRequestToPay", function() {
    context("when the amount is missing", function() {
      it("throws an error", function() {
        const request = {} as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.rejectedWith(
          "amount is required"
        );
      });
    });

    context("when the amount is not numeric", function() {
      it("throws an error", function() {
        const request = { amount: "alphabetic" } as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.rejectedWith(
          "amount must be a number"
        );
      });
    });

    context("when the currency is missing", function() {
      it("throws an error", function() {
        const request = {
          amount: "1000"
        } as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.rejectedWith(
          "currency is required"
        );
      });
    });

    context("when the payer is missing", function() {
      it("throws an error", function() {
        const request = {
          amount: "1000",
          currency: "UGX"
        } as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.rejectedWith(
          "payer is required"
        );
      });
    });

    context("when the party id is missing", function() {
      it("throws an error", function() {
        const request = {
          amount: "1000",
          currency: "UGX",
          payer: {}
        } as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.rejectedWith(
          "payer.partyId is required"
        );
      });
    });

    context("when the party id type is missing", function() {
      it("throws an error", function() {
        const request = {
          amount: "1000",
          currency: "UGX",
          payer: {
            partyId: "xxx"
          }
        } as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.rejectedWith(
          "payer.partyIdType is required"
        );
      });
    });
  });
});
