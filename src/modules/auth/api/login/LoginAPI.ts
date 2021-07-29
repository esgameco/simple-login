import { NextApiRequest, NextApiResponse } from 'next';
import { compare } from 'bcrypt';

import { getUser } from '../../db/user';
import { createToken } from '../../utils/token';

interface LoginQuery {
    username?: string;
    password?: string;
}

interface LoginResponse {
    error?: string,
    token?: string
};

const LoginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { username, password } = req.query as LoginQuery;

    if (!username || !password)
        return res.status(404).json({'error': 'Cannot find Username or Password.'});

    try {
        // Query database for user
        const { exists, user } = await getUser(username);

        console.log(user)

        // Check whether user exists
        if (!exists)
            return res.status(404).json({'error': 'User doesn\'t exist.'} as LoginResponse);

        // Check whether password is correct
        const passwordCorrect = await compare(password, user.passhash);
        if (!passwordCorrect)
            return res.status(404).json({'error': 'Password is incorrect.'} as LoginResponse);

        // Signs jwt token to give to user
        const token = createToken({username});

        // Sets auth header to the jwt token
        res.setHeader('Set-Cookie', `auth:${token}`);
        res.status(200).json({token});
    } catch {
        res.status(404).json({'error': 'An unknown error has occurred'})
    }
};

export default LoginHandler;