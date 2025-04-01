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

// src/http/controllers/refresh.ts
var refresh_exports = {};
__export(refresh_exports, {
  refresh: () => refresh
});
module.exports = __toCommonJS(refresh_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  refresh
});
