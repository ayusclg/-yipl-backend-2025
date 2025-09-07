
import Jwt from "jsonwebtoken";
import { Author } from "./Interfaces";
 

export function generateRefreshToken(USER:Author): string {
    const secret = process.env.REFRESH_TOKEN_SECRET!;
    const expiry = process.env.REFRESH_TOKEN_EXPIRY;
    const expiresIn = Number(expiry);

    if (!secret) {
      throw new Error("Token Not Found");
    }
    if (!expiry) {
      throw new Error("Token Expiry Not Found");
    }
  return Jwt.sign(
    {
      id: USER.id,
    },
    secret,
    {
      expiresIn:expiresIn || "30d",
    }
  );
}

export function generateAccessToken(USER:Author): string {
    const secret = process.env.ACCESS_TOKEN_SECRET
    const expiry = process.env.ACCESS_TOKEN_EXPIRY
    const expiresIn = Number(expiry)

    if (!secret) {
        throw new Error("Token Not Found")
    }
    if (!expiry) {
        throw new Error("Token Expiry Not Set")
    }

    return Jwt.sign({
        id: USER.id,
        email: USER.email,
        name:USER.name
    },
        secret, {
        expiresIn:expiresIn || "1d",
    })
}
