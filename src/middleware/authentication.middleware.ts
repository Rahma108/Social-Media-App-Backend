import type { NextFunction, Request, Response } from "express"
import { BadRequestException } from "../common/exception"
import { decodeToken } from "../common/utils/security"
import { TokenTypeEnum } from "../common/enums/security.enum"



export const authentication = (tokenType = TokenTypeEnum.access) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new BadRequestException("Missing authorization key");
    }

    const [flag, credentials] = authHeader.split(" ");

    if (!flag || !credentials) {
      throw new BadRequestException("Invalid authorization format");
    }

    switch (flag) {
      case "Basic": {
        const data = Buffer.from(credentials, "base64").toString();
        const [username, password] = data.split(":");
        console.log({ username, password });
        break;
      }

      case "Bearer": {
        const { user, decoded } = await decodeToken({
          token: credentials,
          tokenType,
        });

        req.user = user;
        req.decoded = decoded;
        break;
      }

      default:
        throw new BadRequestException("Unsupported authorization type");
    }

    next();
  };
};

