import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import config from 'config';

import { getUser } from '../../db/user';
import type { User } from '../../types/user';

interface UserQuery {
    username?: string;
}

interface UserResponse {
    error?: string;
    data?: object;
}

const UserHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { username } = req.query as UserQuery;

    if (!username)
        return res.status(404).json({'error': 'Username is not provided.'} as UserResponse);

    try {
        const { exists, user } = await getUser(username);

        if (!exists)
            return res.status(404).json({'error': 'User doesn\'t exist.'} as UserResponse);

        console.log(user)

        res.status(200).json({data: {
            email: user.email,
            access: user.accesslevel,
            queries: user.queriesleft
        }} as UserResponse);
    }
    catch {
        res.status(404).json({'error': 'Unknwon error.'} as UserResponse);
    }
};

export default UserHandler;