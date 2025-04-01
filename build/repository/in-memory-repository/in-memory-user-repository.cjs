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

// src/repository/in-memory-repository/in-memory-user-repository.ts
var in_memory_user_repository_exports = {};
__export(in_memory_user_repository_exports, {
  InMemoryUserRepository: () => InMemoryUserRepository
});
module.exports = __toCommonJS(in_memory_user_repository_exports);

// src/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found");
  }
};

// src/repository/in-memory-repository/in-memory-user-repository.ts
var InMemoryUserRepository = class {
  constructor() {
    this.data = [];
  }
  create(_0) {
    return __async(this, arguments, function* ({
      name,
      email,
      password_hash,
      id,
      role,
      validated_at
    }) {
      const user = {
        id: id != null ? id : "user-id",
        name,
        email,
        password_hash,
        validated_at: validated_at ? /* @__PURE__ */ new Date() : null,
        role: role != null ? role : "USER",
        created_at: /* @__PURE__ */ new Date()
      };
      this.data.push(user);
      return user;
    });
  }
  findByEmail(email) {
    return __async(this, null, function* () {
      const user = this.data.find((value) => value.email === email);
      return user != null ? user : null;
    });
  }
  fetchMany(page) {
    return __async(this, null, function* () {
      return this.data.slice((page - 1) * 15, page * 15);
    });
  }
  delete(userId) {
    return __async(this, null, function* () {
      const userDeleted = this.data.find((value) => value.id === userId);
      if (!userDeleted) {
        return null;
      }
      this.data = this.data.filter((value) => value.id !== userId);
      return userDeleted;
    });
  }
  findById(userId) {
    return __async(this, null, function* () {
      const user = this.data.find((value) => value.id === userId);
      return user != null ? user : null;
    });
  }
  changePassword(userId, passwordHash) {
    return __async(this, null, function* () {
      const userIndex = this.data.findIndex((value) => value.id === userId);
      if (userIndex <= -1) {
        throw new ResourceNotFoundError();
      }
      this.data[userIndex].password_hash = passwordHash;
      return this.data[userIndex];
    });
  }
  validate(email, date) {
    return __async(this, null, function* () {
      const index = this.data.findIndex((value) => value.email === email);
      this.data[index].validated_at = date;
      return this.data[index];
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryUserRepository
});
