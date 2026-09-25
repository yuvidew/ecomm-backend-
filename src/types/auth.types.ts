import { RowDataPacket } from "mysql2";
import z from "zod"

// user data type
export interface UserRow extends RowDataPacket{
    id: number,
    name : string,
    email : string,
    password : string,
    role : string
};

// schema for the sign up req
export const signupSchema = z.object({
    name : z.string().min(2, "Name must be two charachter"),
    email: z.string().email("Invalid email address"),
    password : z.string().min(8, "Name must be 8 charachter"),
    role : z.string().min(2, "Name must be two charachter"),
});

// sign up schema type
export type SignUpType = z.infer<typeof signupSchema>;

// schema for the sign in req
export const signinSchema = z.object({
    email: z.string().email("Invalid email address"),
    password : z.string().min(8, "Name must be 8 charachter"),
});

// sign in schema type
export type SignInType = z.infer<typeof signinSchema>;

// auth payload
export interface AuthPayload {
    id: number;
    email: string;
    role: string
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

// Refrence token type
export interface RefreshTokenRow extends RowDataPacket{
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  revoked_at: Date | null;
}

