import {
  validationResult,
  ContextRunner,
  ValidationChain,
} from "express-validator";
import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundError } from "./errors";

export const validate = (validations: ContextRunner[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      await validation.run(req);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map((error) => error.msg);

      const contemCampoInvalido = errorsMessages.some((str) =>
        str.includes("campo inválido ou nulo")
      );

      const contemCampoRepetido = errorsMessages.some((str) =>
        str.includes("registro já cadastrado")
      );

      const contemRegistroInvalido = errorsMessages.some((str) =>
        str.includes("não encontrado")
      );

      if (contemCampoInvalido || contemCampoRepetido) {
        throw new BadRequestError(errorsMessages.toString());
      }

      if (contemRegistroInvalido) {
        throw new NotFoundError(errorsMessages.toString());
      }

      throw new Error(errorsMessages.toString());
    }

    next();
  };
};
