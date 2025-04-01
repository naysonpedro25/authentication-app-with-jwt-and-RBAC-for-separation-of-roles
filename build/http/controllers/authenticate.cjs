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

// src/http/controllers/authenticate.ts
var authenticate_exports = {};
__export(authenticate_exports, {
  authenticate: () => authenticate
});
module.exports = __toCommonJS(authenticate_exports);

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

// src/use-cases/authenticate.ts
var import_bcryptjs = require("bcryptjs");

// src/use-cases/errors/invalid-credentials-error.ts
var InvalidCredentials = class extends Error {
  constructor() {
    super("Invalid credentials");
  }
};

// src/use-cases/errors/user-not-validated-error.ts
var UserNotValidatedError = class extends Error {
  constructor() {
    super("User not validated");
  }
};

// src/use-cases/authenticate.ts
var AuthenticateUseCase = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  execute(_0) {
    return __async(this, arguments, function* ({
      email,
      password
    }) {
      const userAlreadyExist = yield this.userRepository.findByEmail(email);
      if (!userAlreadyExist) {
        throw new InvalidCredentials();
      }
      if (!userAlreadyExist.validated_at) {
        throw new UserNotValidatedError();
      }
      const passwordsIsEquals = yield (0, import_bcryptjs.compare)(
        password,
        userAlreadyExist.password_hash
      );
      if (!passwordsIsEquals) {
        throw new InvalidCredentials();
      }
      return {
        user: userAlreadyExist
      };
    });
  }
};

// src/use-cases/factory/make-authenticate-use-case.ts
function makeAuthenticateUseCase() {
  const userRepository = new PrismaUserRepositoryImp();
  return new AuthenticateUseCase(userRepository);
}

// src/http/controllers/authenticate.ts
var import_zod2 = require("zod");
function authenticate(request, reply) {
  return __async(this, null, function* () {
    try {
      const regiserBodySchema = import_zod2.z.object({
        email: import_zod2.z.string().email(),
        password: import_zod2.z.string().min(6)
      });
      const { email, password } = regiserBodySchema.parse(request.body);
      const authenticateUseCase = makeAuthenticateUseCase();
      const { user } = yield authenticateUseCase.execute({ email, password });
      const token = yield reply.jwtSign(
        {},
        {
          sign: {
            sub: user.id
          }
        }
      );
      const refreshToken = yield reply.jwtSign(
        {},
        {
          sign: {
            sub: user.id,
            expiresIn: "7d"
          }
        }
      );
      return reply.setCookie("refreshToken", refreshToken, {
        path: "/",
        // quais rotas da aplicação tem acesso ao cookie (todas com o /)
        secure: true,
        // se o cookie vai ser encriptado com o https (se o front estiver usando https, se for local fudeu), impossibilitando o front de pegar o cookie direto como string
        sameSite: true,
        // cookie só pode ser acessado dentro do mesmo domínio
        httpOnly: true
        // cookie só pode ser acessado pelo back, sem ser armazenado pelo front nos cookies no browser.
      }).status(200).send({
        token
      });
    } catch (error) {
      if (error instanceof InvalidCredentials) {
        return reply.status(409).send({ message: error.message });
      }
      if (error instanceof UserNotValidatedError) {
        return reply.status(409).send({ message: error.message });
      }
      throw error;
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authenticate
});
