import { Pool } from 'pg';
import config from 'config';

const { host, user, password, database } = config.get('db');
const pool = new Pool({ host, user, password, database });

export const query = (text: string, params: any) => {
    return pool.query(text, params);
};