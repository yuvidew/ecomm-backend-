import { pool } from "@/config/db";
import { UserRow, RefreshTokenRow } from "@/types/auth.types";
import { ResultSetHeader } from "mysql2";

// query for the find user by email 
export const findUserByEmail = async (email: string) : Promise<UserRow | null> => {
    const [rows] = await pool.query<UserRow[]>(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0] ?? null;
};

// query for to find user from by id
export const findUserById = async (id : number) : Promise<UserRow | null> => {
    const [rows] = await pool.query<UserRow[]>(
        "SELECT * FROM user WHERE id = ?",
        [id]
    );

    return rows[0] ?? null
};

// create new user 
export const createUser = async (
    name : string,
    email : string,
    hashedPassword : string,
    role: string
) : Promise<number> => {
    const [rows] = await pool.query<ResultSetHeader>(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role]
    );

    return rows.insertId;
};

// store a hashed refresh token for a user
export const saveRefreshToken = async (
    user_id: number,
    tokenHash: string,
    expiresAt: Date,
): Promise<void> => {
    const [rows] = await pool.query(
        "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
        [user_id, tokenHash, expiresAt]
    );
}

// find a valid (non-revoked, non-expired) refresh token by its hash
export const findRefreshToken = async (tokenHash: string) : Promise<RefreshTokenRow | null> => {
    const [rows] = await pool.query<RefreshTokenRow[]>(
        "SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()",
        [tokenHash]
    );

    return rows[0] ?? null;
};

// revoke a single refresh token (used on rotation / logout)
export const revokeRefreshToken = async (tokenHash: string) : Promise<void> => {
    await pool.query(
        "UPDATE refresh_tokens SET revoke_at = NOW() WHERE token_hash = ?",
        [tokenHash]
    );
};

//  revoke every refresh token belonging to user (reuse-of-revoked-token detection)
export const revokeAllUserRefreshToken = async (userId: number) : Promise<void> => {
    await pool.query(
        "UPDATE refresh_tokens SET revoke_at = NOW() WHERE user_id = ? AND revoked_at is NULL",
        [userId]
    )
}