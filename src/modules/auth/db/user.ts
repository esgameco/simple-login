import type { QueryResult } from 'pg';
import { hash } from 'bcrypt';
import config from 'config';

import { query } from "../../../db";

import type { User } from '../types/user';

interface UserResponse {
    exists: boolean;
    user: User;
}

interface AddUserResponse {
    worked: boolean;
    error?: string;
}

export const addUser = async (email: string, username: string, password: string, accessLevel: number = 0, queriesLeft: number = 1000): Promise<AddUserResponse> => {
    try {
        const { exists } = await getUser(username);

        // Check whether user exists
        if (exists)
            return { worked: false, error: 'User already exists.' };

        // Hash the password
        const passwordHash = await hash(password, config.get('saltRounds'));

        // Add user to the database
        await query(`INSERT INTO users VALUES ($1, $2, $3, $4, $5)`, [email, username, passwordHash, accessLevel, queriesLeft]);

        return { worked: true };
    } catch {}
    return { worked: false, error: 'Unknown error.' };;
};

export const getUser = async (username: string): Promise<UserResponse> => {
    const userRes = await query(`SELECT * FROM users WHERE username = $1`, [username]) as QueryResult;
    return { 
        exists: userRes.rowCount > 0,
        user: userRes.rows[0]
    };
}