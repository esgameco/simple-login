import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../db';
import { hash } from 'bcrypt';
import config from 'config';

interface RegisterQuery {
    email?: string;
    username?: string;
    password?: string;
}

interface RegisterResponse {
    error?: string,
    completed?: boolean
};

const RegisterHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, username, password } = req.query as RegisterQuery;

    if (!email || !username || !password)
        return res.status(404).json({'error': 'Cannot find Email, Username or Password.'} as RegisterResponse);

    try {
        // Check whether user exists
        const user = await query(`SELECT username FROM users WHERE username = $1`, [username]);

        if (user.rows.length > 0)
            return res.status(404).json({'error': 'User already exists.'} as RegisterResponse);

        // Hash the password
        const passwordHash = await hash(password, config.get('saltRounds'));

        // Add user to the database
        await query(`INSERT INTO users VALUES ($1, $2, $3)`, [email, username, passwordHash]);

        res.status(200).json({completed: true} as RegisterResponse);
    } catch {
        res.status(404).json({'error': 'An unknown error has occurred'} as RegisterResponse)
    }
};

export default RegisterHandler;