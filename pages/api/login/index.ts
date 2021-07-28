import { NextApiRequest, NextApiResponse } from 'next';
import { sign } from 'jsonwebtoken';
import { query } from '../../../db';
import { compare } from 'bcrypt';
import config from 'config';

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
        const user = await query('SELECT username, passhash FROM users WHERE username = $1', [username]);

        // Check whether user exists
        if (user.rows.length == 0)
            return res.status(404).json({'error': 'User doesn\'t exist.'} as LoginResponse);

        // Check whether password is correct
        const passwordCorrect = await compare(password, user.rows[0].passhash);
        if (!passwordCorrect)
            return res.status(404).json({'error': 'Password is incorrect.'} as LoginResponse);

        // Signs jwt token to give to user
        const token = sign({username}, config.get('secretKey'));

        // Sets auth header to the jwt token
        res.setHeader('Set-Cookie', `auth:${token}`);
        res.status(200).json({token});
    } catch {
        res.status(404).json({'error': 'An unknown error has occurred'})
    }
};

export default LoginHandler;