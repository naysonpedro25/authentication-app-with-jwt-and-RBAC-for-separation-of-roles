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

// src/http/routes.ts
var routes_exports = {};
__export(routes_exports, {
  routes: () => routes
});
module.exports = __toCommonJS(routes_exports);

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

// src/http/controllers/register-user.ts
var import_zod2 = require("zod");
function register(request, reply) {
  return __async(this, null, function* () {
    try {
      const regiserBodySchema = import_zod2.z.object({
        token: import_zod2.z.string(),
        email: import_zod2.z.string().email()
      });
      const verifyUserEmailCookieSchema = import_zod2.z.object({
        verifyEmailToken: import_zod2.z.string()
      });
      const { token, email } = regiserBodySchema.parse(request.body);
      const { verifyEmailToken } = verifyUserEmailCookieSchema.parse(
        request.cookies
      );
      const validateUserUseCase = makeValidateUserUseCase();
      if (!verifyEmailToken) {
        return reply.status(409).send({ message: "Verify token expired" });
      }
      if (!token || token !== verifyEmailToken) {
        return reply.status(409).send({ message: "Invalid verify token" });
      }
      yield validateUserUseCase.execute({ email });
      return reply.clearCookie("verifyEmailToken").status(201).send();
    } catch (error) {
      if (error instanceof UserAlreadyExistError) {
        return reply.status(409).send({ message: error.message });
      }
      if (error instanceof UserAlreadyValidatedError) {
        return reply.status(409).send({ message: error.message });
      }
      throw error;
    }
  });
}

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
var import_zod3 = require("zod");

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
      const regiserBodySchema = import_zod3.z.object({
        name: import_zod3.z.string().max(20),
        email: import_zod3.z.string().email(),
        password: import_zod3.z.string().min(6)
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

// src/use-cases/authenticate.ts
var import_bcryptjs2 = require("bcryptjs");

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
      const passwordsIsEquals = yield (0, import_bcryptjs2.compare)(
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
var import_zod4 = require("zod");
function authenticate(request, reply) {
  return __async(this, null, function* () {
    try {
      const regiserBodySchema = import_zod4.z.object({
        email: import_zod4.z.string().email(),
        password: import_zod4.z.string().min(6)
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

// src/http/middleware/verify-jwt.ts
function verifyJwt(request, reply) {
  return __async(this, null, function* () {
    try {
      yield request.jwtVerify();
    } catch (error) {
      return reply.status(401).send({
        message: "Unauthorized"
      });
    }
  });
}

// src/http/controllers/refresh.ts
function refresh(request, reply) {
  return __async(this, null, function* () {
    try {
      yield request.jwtVerify({ onlyCookie: true });
      const token = yield reply.jwtSign(
        // é criado um novo token
        {},
        {
          sign: {
            sub: request.user.sub
            // esse sub é da validação do refresh token anterior
          }
        }
      );
      const refreshToken = yield reply.jwtSign(
        // é criado tb um novo refresh token
        {},
        {
          sign: {
            sub: request.user.sub,
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
      throw error;
    }
  });
}

// src/http/routes.ts
function routes(app) {
  return __async(this, null, function* () {
    app.post("/register/session", verifyEmailUser);
    app.post("/register/validate-email", register);
    app.post("/auth", authenticate);
    app.patch("/token/refresh", refresh);
    app.get(
      "/me",
      {
        onRequest: [verifyJwt]
      },
      profile
    );
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  routes
});
