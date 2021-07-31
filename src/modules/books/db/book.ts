import type { QueryResult } from 'pg';
import config from 'config';

import { query } from "../../../db";

import { Book } from '../types/book'

import { CreateResponse, GetResponse } from '../../../db/types/response';

export const createBook = async (isbn: string, title: string, description: string): Promise<CreateResponse> => {
    try {
        await query('INSERT INTO books VALUES ($1, $2, $3)', [isbn, title, description]);

        return {} as CreateResponse;
    } catch {
        return {error: 'Unknown error.'} as CreateResponse;
    }
};

export const getBook = async (isbn: string): Promise<GetResponse<Book>> => {
    try {
        const bookRes = await query('SELECT * FROM books WHERE isbn = $1', [isbn]) as QueryResult;

        if (bookRes.rowCount == 0)
            return {exists: false} as GetResponse<Book>;

        return {
            exists: true,
            data: bookRes.rows[0]
        } as GetResponse<Book>;
    } catch {
        return {exists: false, error: 'Unknown error.'} as GetResponse<Book>;
    }
};