import { NextApiRequest, NextApiResponse } from 'next';
import { sign } from 'jsonwebtoken';
import config from 'config';

interface LoginResponse {
    error?: string,
    token?: string
};

const LoginHandler = (req: NextApiRequest, res: NextApiResponse) => {
    const { username, password } = req.query;

    if (!username || !password)
        return res.json({'error': 'Cannot find Username or Password.'});

    const token = sign(`${username}${password}`, 'test');

    res.json({token});
};

export default LoginHandler;