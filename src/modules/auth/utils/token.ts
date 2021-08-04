import { verify, sign } from 'jsonwebtoken';
import config from 'config';

import { GetResponse } from '../../../db/types/response';

// Checks whether token is valid, and if it is, returns the data on the token
export const checkToken = (token: string): GetResponse<object> => {
    try {
        const userData = verify(token, config.get('secretKey'), {algorithms: ['HS512']});
        return { exists: true, data: userData } as GetResponse<object>;
    } catch {}
    return { exists: false } as GetResponse<object>;
};

// Returns a new token based on the data provided
export const createToken = (data: object): string | null => {
    try {
        return sign(data, config.get('secretKey'), {algorithm: 'HS512'});
    } catch {
        return null;
    }
}