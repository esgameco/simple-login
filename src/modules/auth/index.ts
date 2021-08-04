import { GetResponse } from '../../db/types/response';

import { checkToken } from './utils/token';
import { getUser } from './db/user';

import type { User } from '../auth/types/user';

interface UserToken {
    username: string;
}

// Checks whether the user is authenticated, and gives user data if they are
export const checkAuth = async (token: string): Promise<GetResponse<User>> => {
    const { exists: tokenExists, data: tokenData } = checkToken(token);

    if (!tokenExists || !tokenData)
        return { exists: false };

    const { username } = tokenData as UserToken;

    if (!username)
        return { exists: false };
    
    const { exists: userExists, data: userData } = await getUser(username);

    if (!userExists || !userData)
        return { exists: false };
    
    return { exists: true, data: userData } as GetResponse<User>;
}