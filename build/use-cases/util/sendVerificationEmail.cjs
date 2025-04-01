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

// src/use-cases/util/sendVerificationEmail.ts
var sendVerificationEmail_exports = {};
__export(sendVerificationEmail_exports, {
  sendVerificationEmail: () => sendVerificationEmail
});
module.exports = __toCommonJS(sendVerificationEmail_exports);
var import_nodemailer = require("nodemailer");

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

// src/use-cases/util/sendVerificationEmail.ts
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sendVerificationEmail
});
