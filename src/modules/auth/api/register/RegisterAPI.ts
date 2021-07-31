import { NextApiRequest, NextApiResponse } from 'next';

import { createUser } from '../../db/user';

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
        const { worked, error } = await createUser(email, username, password);

        if (worked)
            return res.status(200).json({completed: true} as RegisterResponse);
        else
            return res.status(404).json({error} as RegisterResponse)
    } catch {}
    res.status(404).json({'error': 'An unknown error has occurred'} as RegisterResponse)
};

export default RegisterHandler;