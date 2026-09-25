import bcrypt from "bcrypt";
import { SignInType, SignUpType } from "@/types/auth.types";
import * as authRepository from "../repositories/auth.repository";
import { hashToken, issueTokens, verifyRefreshToken } from "@/utils/jwt-token";

// creatinga user accont / sign up
export const signup = async (input: SignUpType) => {
    const {name, email, password, role} = input;

    const isExisting = await authRepository.findUserByEmail(email);

    if (isExisting) {
        throw {
            status : 409,
            message : "Email already registered"
        }
    }

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    await authRepository.createUser(
        name,
        email,
        hashedPassword,
        role
    );


    return {
        message : "Account is creted successfully"
    };
};

// verify the user and login
export const signin = async (input: SignInType) =>{
    const {email, password} = input;

    const user = await authRepository.findUserByEmail(email);

    if(!user) {
        throw {
            status: 401,
            messsge: "Invalid email or password"
        };
    };

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw {
            status: 401,
            messsge: "Invalid email or password"
        };
    };

    // generate token
    const {accessToken, refreshToken} = await issueTokens(user.id, email, user.role);

    return {
        message : "Welcome to e-comm",
        role : user.role,
        accessToken,
        refreshToken,
    };
};

// exchnage a valid refresh token for a new access/refresh token pair
export const refreshAccessToken = async (token : string) => {
    let payload;

    try {
        payload = verifyRefreshToken(token);
    } catch (error) {
        throw {
            status : 401,
            message: "Invalid or expired refresh token"
        }
    }

    const tokenHash = hashToken(token);
    const stored = await authRepository.findRefreshToken(tokenHash);

    if(!stored){
        // token unkown / already rotated / revoke -> treat as possible theft
        await authRepository.revokeAllUserRefreshToken(payload.id);
        throw {
            status : 401,
            message : "Invalid or expired refresh token"
        }
    }

    const user = await authRepository.findUserById(payload.id);

    if (!user) {
        throw {
            status : 401,
            message : "User no longer exists"
        }
    }

    // rotate: revoke the user token, issue a brahd new pair
    await authRepository.revokeRefreshToken(tokenHash);

    const {accessToken, refreshToken} = await issueTokens(payload.id, payload.email, payload.role);

    return {accessToken, refreshToken}
}

// revoke a refresh token on logout
export const logout = async (token : string) => {
    await authRepository.revokeRefreshToken(hashToken(token));

    return {
        message : "Logged out successfully"
    };
};