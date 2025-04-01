"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/use-cases/change-user-password.ts
var change_user_password_exports = {};
__export(change_user_password_exports, {
  ChangeUserPasswordUseCase: () => ChangeUserPasswordUseCase
});
module.exports = __toCommonJS(change_user_password_exports);
var import_bcryptjs = require("bcryptjs");

// src/use-cases/errors/invalid-credentials-error.ts
var InvalidCredentials = class extends Error {
  constructor() {
    super("Invalid credentials");
  }
};

// src/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found");
  }
};

// src/use-cases/change-user-password.ts
var ChangeUserPasswordUseCase = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  execute(_0) {
    return __async(this, arguments, function* ({
      userId,
      newPassword,
      password
    }) {
      const user = yield this.userRepository.findById(userId);
      if (!user) {
        throw new ResourceNotFoundError();
      }
      const isEqualsPassword = yield (0, import_bcryptjs.compare)(password, user.password_hash);
      if (!isEqualsPassword) {
        throw new InvalidCredentials();
      }
      const newPasswordHash = yield (0, import_bcryptjs.hash)(newPassword, 6);
      const userWithNewPassword = yield this.userRepository.changePassword(
        userId,
        newPasswordHash
      );
      return {
        user: userWithNewPassword
      };
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChangeUserPasswordUseCase
});
