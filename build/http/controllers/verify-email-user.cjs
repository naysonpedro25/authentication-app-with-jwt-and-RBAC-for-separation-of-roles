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

// src/http/controllers/verify-email-user.ts
var verify_email_user_exports = {};
__export(verify_email_user_exports, {
  verifyEmailUser: () => verifyEmailUser
});
module.exports = __toCommonJS(verify_email_user_exports);

// src/use-cases/errors/user-already-exist-error.ts
var UserAlreadyExistError = class extends Error {
  constructor() {
    super("User already exist");
  }
};

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

// src/use-cases/verify-user-by-email.ts
var import_node_crypto = require("crypto");

// src/use-cases/util/sendVerificationEmail.ts
var import_nodemailer = require("nodemailer");
function sendVerificationEmail(email, token) {
  return __async(this, null, function* () {
    let trasnporter;
    if (env.NODE_ENV === "production") {
      trasnporter = (0, import_nodemailer.createTransport)({
        secure: true,
        service: "gmail",
        auth: { user: env.EMAIL_ADDRESS, pass: env.EMAIL_PASS }
      });
    } else {
      trasnporter = (0, import_nodemailer.createTransport)({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "katelin.graham41@ethereal.email",
          pass: "ss8tYh9mfS8986uxDR"
        }
      });
    }
    const link = `http://localhost:3333/session/verify-email?token=${token}&email=${email}`;
    yield trasnporter.sendMail({
      from: "Gerenciador de user kk",
      to: email,
      subject: "Verifique seu email",
      html: `<p>
            <a href=${link} >Click no aqui</a> para verificar seu endere\xE7o de e-mail        
        </p>`
    });
  });
}

// src/use-cases/errors/unable-send-email-error.ts
var UnableSendEmailError = class extends Error {
  constructor() {
    super("Unable to send email");
  }
};

// src/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found");
  }
};

// src/use-cases/errors/user-already-velidated-error.ts
var UserAlreadyValidatedError = class extends Error {
  constructor() {
    super("User already validated");
  }
};

// src/use-cases/verify-user-by-email.ts
var VerifyUserByEmailUseCase = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  execute(_0) {
    return __async(this, arguments, function* ({
      email
    }) {
      const user = yield this.userRepository.findByEmail(email);
      if (!user) {
        throw new ResourceNotFoundError();
      }
      if (user.validated_at) {
        throw new UserAlreadyValidatedError();
      }
      const token = (0, import_node_crypto.randomUUID)();
      try {
        yield sendVerificationEmail(email, token);
      } catch (error) {
        console.error(error);
        throw new UnableSendEmailError();
      }
      return {
        token
      };
    });
  }
};

// src/use-cases/factory/make-verify-user-by-email.ts
function makeVerifyUserByEmailUseCase() {
  const userRepository = new PrismaUserRepositoryImp();
  return new VerifyUserByEmailUseCase(userRepository);
}

// src/http/controllers/verify-email-user.ts
var import_zod2 = require("zod");

// src/use-cases/register.ts
var import_bcryptjs = require("bcryptjs");
var RegisterUseCase = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  execute(_0) {
    return __async(this, arguments, function* ({
      name,
      email,
      password
    }) {
      const userAlreadyExist = yield this.userRepository.findByEmail(email);
      if (userAlreadyExist) {
        throw new UserAlreadyExistError();
      }
      const password_hash = yield (0, import_bcryptjs.hash)(password, 6);
      const user = yield this.userRepository.create({
        name,
        email,
        password_hash
      });
      return {
        user
      };
    });
  }
};

// src/use-cases/factory/make-register-use-case.ts
function makeRegisterUseCase() {
  const userRepository = new PrismaUserRepositoryImp();
  return new RegisterUseCase(userRepository);
}

// src/http/controllers/verify-email-user.ts
function verifyEmailUser(request, reply) {
  return __async(this, null, function* () {
    try {
      const regiserBodySchema = import_zod2.z.object({
        name: import_zod2.z.string().max(20),
        email: import_zod2.z.string().email(),
        password: import_zod2.z.string().min(6)
      });
      const { name, email, password } = regiserBodySchema.parse(request.body);
      const veriryEmailUseCase = makeVerifyUserByEmailUseCase();
      const regiserUserUseCase = makeRegisterUseCase();
      yield regiserUserUseCase.execute({
        email,
        password,
        name
      });
      const { token } = yield veriryEmailUseCase.execute({
        email
      });
      return reply.setCookie("verifyEmailToken", token, {
        secure: true,
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1e3 * 60 * 1
        // expira em 2 minutos
      }).status(200).send({ message: "verify your email" });
    } catch (error) {
      if (error instanceof UserAlreadyExistError) {
        return reply.status(409).send({ message: error.message });
      }
      throw error;
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  verifyEmailUser
});
