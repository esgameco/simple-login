import { verify, sign } from 'jsonwebtoken';
import config from 'config';

interface AuthResponse {
    verified: boolean;
    data?: any;
}

// Checks whether token is valid, and if it is, returns the data on the token
export const checkToken = (token: string): AuthResponse => {
    try {
        const userData = verify(token, config.get('secretKey'), {algorithms: ['HS512']});
        return { verified: true, data: userData } as AuthResponse;
    } catch {}
    return { verified: false } as AuthResponse;
};

// Returns a new token based on the data provided
export const createToken = (data: object): string | null=> {
    try {
        return sign(data, config.get('secretKey'), {algorithm: 'HS512'});
    } catch {}
    return null;
}