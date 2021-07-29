import { verify } from 'jsonwebtoken';
import config from 'config';

interface AuthResponse {
    verified: boolean;
    data?: any;
}

const checkAuth = (token: string): AuthResponse => {
    try {
        const userData = verify(token, config.get('secretKey'), {algorithms: ['HS512']});
        return { verified: true, data: userData } as AuthResponse;
    } catch {}
    return { verified: false } as AuthResponse;
};

// Returns whether the token can be verified correctly
export default checkAuth;