import type { QueryResult } from 'pg';
import { hash } from 'bcrypt';
import config from 'config';

import { query } from "../../../db";

import type { CreateResponse, GetResponse } from '../../../db/types/response';
import type { User } from '../types/user';

export const createUser = async (email: string, username: string, password: string, accessLevel: number = 0, queriesLeft: number = 1000): Promise<CreateResponse> => {
    try {
        const { exists } = await getUser(username);

        // Check whether user exists
        if (exists)
            return { error: 'User already exists.' } as CreateResponse;

        // Hash the password
        const passwordHash = await hash(password, config.get('saltRounds'));

        // Add user to the database
        await query(`INSERT INTO users VALUES ($1, $2, $3, $4, $5)`, [email, username, passwordHash, accessLevel, queriesLeft]);

        return {} as CreateResponse;
    } catch {
        return { error: 'Unknown error.' } as CreateResponse;
    }
};

export const getUser = async (username: string): Promise<GetResponse<User>> => {
    const userRes = await query(`SELECT * FROM users WHERE username = $1`, [username]) as QueryResult;
    return { 
        exists: userRes.rowCount > 0,
        data: userRes.rows[0]
    } as GetResponse<User>;
}