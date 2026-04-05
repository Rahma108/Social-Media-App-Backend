import { UserRepository } from './../../../DB/repository/user.repository';
import jwt from 'jsonwebtoken';
import { randomUUID } from "node:crypto"
import { ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN, System_REFRESH_TOKEN_SECURITY_KEY, System_TOKEN_SECURITY_KEY, User_REFRESH_TOKEN_SECURITY_KEY, User_TOKEN_SECURITY_KEY } from "../../../config/config"
import { RoleEnum } from "../../enums"
import { AudienceEnum, TokenTypeEnum } from "../../enums/security.enum"
import { BadRequestException, UnauthorizedException } from "../../exception"
import { get, revokeTokenKey } from "../../service"
import { IUser } from '../../interfaces';
import { JwtPayload } from "jsonwebtoken";
import { UserModel } from '../../../DB/models';



export const generateToken = async ({
    payload = {},
    secretKey = User_TOKEN_SECURITY_KEY,
    options = {},
    }: {
    payload?: object;
    secretKey?: string;
    options?: jwt.SignOptions;
    }): Promise<string> => {
    if (!secretKey) 
        throw new Error("Secret key is required");

    return jwt.sign(payload, secretKey, options);
};


export const verifyToken = async ({
    token,
    secretKey = User_TOKEN_SECURITY_KEY,
    }: {
    token: string;
    secretKey?: string;
    }): Promise<jwt.JwtPayload> => {
    if (!secretKey) throw new Error("Secret key is required");

    return jwt.verify(token, secretKey) as jwt.JwtPayload;
};
export type TokenSignature = {
  accessSignature: string;
  refreshSignature: string;
  audience: AudienceEnum;
};
export const getTokenSignature = async (
  role: RoleEnum
): Promise<TokenSignature> => {
  if (!System_TOKEN_SECURITY_KEY || !System_REFRESH_TOKEN_SECURITY_KEY ||
      !User_TOKEN_SECURITY_KEY || !User_REFRESH_TOKEN_SECURITY_KEY) {
    throw new Error("Missing security keys in env");
  }

  let accessSignature: string;
  let refreshSignature: string;
  let audience: AudienceEnum = AudienceEnum.User;

  switch (role) {
    case RoleEnum.ADMIN:
      accessSignature = System_TOKEN_SECURITY_KEY;
      refreshSignature = System_REFRESH_TOKEN_SECURITY_KEY;
      audience = AudienceEnum.System;
      break;

    default:
      accessSignature = User_TOKEN_SECURITY_KEY;
      refreshSignature = User_REFRESH_TOKEN_SECURITY_KEY;
      audience = AudienceEnum.User;
      break;
  }

  return { accessSignature, refreshSignature, audience };
};




export const getTokenSignatureLevel = async (
    audienceType: AudienceEnum
    ): Promise<RoleEnum> => {
    let signatureLevel: RoleEnum = RoleEnum.USER;

    switch (audienceType) {
        case AudienceEnum.System:
        signatureLevel = RoleEnum.ADMIN;
        break;

        default:
        signatureLevel = RoleEnum.USER;
        break;
    }

    return signatureLevel;
};

export const createLoginCredentials = async (
    user: IUser,
    issuer: string
    ): Promise<{ access_token: string; refresh_token: string }> => {

    if (!user.role) {
        throw new Error("User role is required");
    }

    if (typeof issuer !== "string") {
        throw new Error(`Issuer must be string, got: ${typeof issuer}`);
    }

    const { accessSignature, refreshSignature, audience } =
        await getTokenSignature(user.role);

    const jwtId = randomUUID();

    const access_token = await generateToken({
        payload: { sub: user._id.toString() },
        secretKey: accessSignature,
        options: {
        issuer,
        audience: [TokenTypeEnum.access, audience] as unknown  as string[],
        expiresIn: ACCESS_EXPIRES_IN  ,
        jwtid: jwtId,
        },
    });

    const refresh_token = await generateToken({
        payload: { sub: user._id.toString() },
        secretKey: refreshSignature,
        options: {
        issuer,
        audience: [TokenTypeEnum.refresh, audience] as unknown as string[],
        expiresIn: REFRESH_EXPIRES_IN ,
        jwtid: jwtId,
        },
    });

    return { access_token, refresh_token };
};


interface CustomJwtPayload extends JwtPayload {
    sub: string;
    aud: [string, string];
    jti?: string;
    iat?: number;
}
export const decodeToken = async (
    {
        token,
        tokenType = TokenTypeEnum.access,
    }: {
        token: string;
        tokenType?: TokenTypeEnum;
    }
    ) => {
    const decoded = jwt.decode(token) as CustomJwtPayload | null;

    if (!decoded || !decoded.aud) {
        throw new BadRequestException("Fail to decode this token aud is required");
    }

    if (
        decoded.jti &&
        (await get(
        revokeTokenKey({ userId: decoded.sub, jti: decoded.jti })
        ))
    ) {
        throw new UnauthorizedException("Invalid Login Session ❌");
    }

    const aud = decoded.aud as unknown as [TokenTypeEnum, AudienceEnum];

    const [decodeTokenType, audienceType] = aud;

    if (decodeTokenType !== tokenType) {
        throw new BadRequestException(
        `Invalid Token Type ${decodeTokenType}`
        );
    }

    const signatureLevel = await getTokenSignatureLevel(audienceType);

    const { accessSignature, refreshSignature } =
        await getTokenSignature(signatureLevel);

    const verifiedData = (await verifyToken({
        token,
        secretKey:
        tokenType == TokenTypeEnum.refresh
            ? refreshSignature
            : accessSignature,
    })) as CustomJwtPayload;

    const userRepo = new UserRepository(UserModel);
    const user = await userRepo.findOne({
    filter: { _id: verifiedData.sub },
    });
    if (!user) {
        throw new UnauthorizedException("Not Register Account!");
    }

    if (
        user.changeCredentialTime &&
        verifiedData.iat &&
        user.changeCredentialTime.getTime() > verifiedData.iat * 1000
    ) {
        throw new UnauthorizedException("Invalid Login Session ❌");
    }

    return { user, decoded };
    };