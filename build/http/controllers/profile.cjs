"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
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

// src/http/controllers/profile.ts
var profile_exports = {};
__export(profile_exports, {
  profile: () => profile
});
module.exports = __toCommonJS(profile_exports);

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

// src/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found");
  }
};

// src/use-cases/get-user-profile.ts
var GetUserProfileUseCase = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  execute(_0) {
    return __async(this, arguments, function* ({
      userId
    }) {
      const user = yield this.userRepository.findById(userId);
      if (!user) {
        throw new ResourceNotFoundError();
      }
      return {
        user
      };
    });
  }
};

// src/use-cases/factory/make-get-user-profile-use-case.ts
function makeGetUserProfileUseCase() {
  const userRepository = new PrismaUserRepositoryImp();
  return new GetUserProfileUseCase(userRepository);
}

// src/use-cases/errors/invalid-credentials-error.ts
var InvalidCredentials = class extends Error {
  constructor() {
    super("Invalid credentials");
  }
};

// src/http/controllers/profile.ts
function profile(request, reply) {
  return __async(this, null, function* () {
    try {
      const getProfileUseCase = makeGetUserProfileUseCase();
      const { user } = yield getProfileUseCase.execute({
        userId: request.user.sub
      });
      const _a = user, { password_hash } = _a, userWithoutPassword = __objRest(_a, ["password_hash"]);
      return reply.status(200).send({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof InvalidCredentials) {
        return reply.status(409).send({ message: error.message });
      }
      throw error;
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  profile
});
