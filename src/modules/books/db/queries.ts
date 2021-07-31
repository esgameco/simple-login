import type { QueryResult } from 'pg';
import config from 'config';

import { query } from "../../../db";
import { getUser } from '../../auth/db/user';

import type { User } from '../../auth/types/user';

interface QueryResponse {
    worked: boolean;
    error?: string;
}

export const changeQueriesLeft = async (username: string, numQueries: number): Promise<QueryResponse> => {
    const { exists, data: user } = await getUser(username);

    if (!exists || !user)
        return {worked: false, error: ''};

    let newQueries = user.queriesleft - numQueries;

    if (newQueries < 0)
        newQueries = 0;
    
    const updateResult = await query('UPDATE users SET queriesleft = $1 WHERE username = $2', [newQueries, username]) as QueryResult;
    
    return {worked: true};
}