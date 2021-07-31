import { query } from "../../../db";

export const createBookTable = async () => {
    await query(`CREATE TABLE [IF NOT EXISTS] books (
        isbn varchar(24),
        title varchar(512),
        description varchar(512)
    );`, []);
};