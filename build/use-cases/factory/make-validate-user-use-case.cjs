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

// src/use-cases/factory/make-validate-user-use-case.ts
var make_validate_user_use_case_exports = {};
__export(make_validate_user_use_case_exports, {
  makeValidateUserUseCase: () => makeValidateUserUseCase
});
module.exports = __toCommonJS(make_validate_user_use_case_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["dev", "production", "test"]),
  PORT: import_zod.z.coerce.number().default(3e3),
  EMAIL_ADDRESS: import_zod.z.string(),
  EMAIL_PASS: import_zod.z.string(),
  REDIS_PASSWORD: import_zod.z.string(),
  JWT_SECRET: import_zod.z.string()
});
var _env = envSchema.safeParse(process.env);
if (_env.error) {
  console.error("Environment variables invalid", _env.error.format());
  throw new Error("Environment variables invalid");
}
var env = _env.data;

// src/lib/prisma.ts
var prisma = new import_client.PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : []
});

// src/repository/prisma-user-repository-imp.ts
var PrismaUserRepositoryImp = class {
  create(_0) {
    return __async(this, arguments, function* ({
      email,
      name,
      password_hash
    }) {
      const user = yield prisma.user.create({
        data: {
          name,
          email,
          password_hash
        }
      });
      return user;
    });
  }
  findByEmail(email) {
    return __async(this, null, function* () {
      const user = yield prisma.user.findUnique({
        where: {
          email
        }
      });
      return user;
    });
  }
  findById(userId) {
    return __async(this, null, function* () {
      const user = yield prisma.user.findUnique({
        where: {
          id: userId
        }
      });
      return user;
    });
  }
  fetchMany(page) {
    return __async(this, null, function* () {
      const users = yield prisma.user.findMany({
        take: 15,
        skip: page - 1 * 15
      });
      return users;
    });
  }
  delete(userId) {
    return __async(this, null, function* () {
      const user = yield prisma.user.delete({
        where: {
          id: userId
        }
      });
      return user;
    });
  }
  changePassword(userId, passwordHash) {
    return __async(this, null, function* () {
      const user = yield prisma.user.update({
        where: {
          id: userId
        },
        data: {
          password_hash: passwordHash
        }
      });
      return user;
    });
  }
  validate(email, date) {
    return __async(this, null, function* () {
      const user = prisma.user.update({
        where: {
          email
        },
        data: {
          validated_at: date
        }
      });
      return user;
    });
  }
};

// src/use-cases/errors/invalid-credentials-error.ts
var InvalidCredentials = class extends Error {
  constructor() {
    super("Invalid credentials");
  }
};

// src/use-cases/errors/user-already-velidated-error.ts
var UserAlreadyValidatedError = class extends Error {
  constructor() {
    super("User already validated");
  }
};

// src/use-cases/validate-user.ts
var ValidateUserUseCase = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  execute(_0) {
    return __async(this, arguments, function* ({
      email
    }) {
      const userNotValidated = yield this.userRepository.findByEmail(email);
      if (!userNotValidated) {
        throw new InvalidCredentials();
      }
      if (userNotValidated.validated_at) {
        throw new UserAlreadyValidatedError();
      }
      const user = yield this.userRepository.validate(email, /* @__PURE__ */ new Date());
      return {
        user
      };
    });
  }
};

// src/use-cases/factory/make-validate-user-use-case.ts
function makeValidateUserUseCase() {
  const userRepository = new PrismaUserRepositoryImp();
  return new ValidateUserUseCase(userRepository);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeValidateUserUseCase
});
