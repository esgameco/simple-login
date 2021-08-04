import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import cookie from 'cookie';

// import { getUser } from '../../auth/db/user';
// import { checkToken } from '../../auth/utils/token';
import { checkAuth } from '../../auth';
import { getBook, createBook } from '../db/book';

import type { GetResponse } from '../../../db/types/response';
import type { Book } from '../types/book';

interface BookSearchQuery {
    auth?: string;
    bookISBN?: string;
}

const BooksHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const ACCESS_REQUIRED = 0;

    const { bookISBN } = req.query as BookSearchQuery;

    if (!req.headers.cookie)
        return res.status(404).json({'error': 'Auth cookie has not been passed.'} as GetResponse<Book>);

    const { auth } = cookie.parse(req.headers.cookie);

    if (!auth)
        return res.status(404).json({'error': 'Auth token is not in the cookie.'} as GetResponse<Book>);

    if (!bookISBN)
        return res.status(404).json({'error': 'Book ISBN is not provided.'} as GetResponse<Book>);

    try {
        // Checks user authentication and gets user from db
        const { exists: userExists, data: userData } = await checkAuth(auth);

        if (!userExists || !userData)
            return res.status(404).json({'error': 'User no longer exists.'} as GetResponse<Book>);

        if (userData.queriesleft == 0)
            return res.status(404).json({'error': 'User has no more queries left.'} as GetResponse<Book>);

        if (userData.accesslevel < ACCESS_REQUIRED)
            return res.status(404).json({'error': 'User doesn\'t have access to this page.'});

        // Query for book in db
        const { exists: bookExists, data: bookData } = await getBook(bookISBN);

        // If book exists, return it to response
        if (bookExists) {
            const {title, description} = bookData as Book;

            res.status(200).json({title, description} as Book);
        } else {
            // If book doesn't exist, get it and add it to the db
            try {
                const bookApiRes: AxiosResponse = await axios.get(`https://openlibrary.org/isbn/${bookISBN}`);
                const {title, description} = bookApiRes.data as Book;
                
                const createBookRes = await createBook(bookISBN, title, description);
                if (createBookRes.error)
                    return res.status(404).json({'error': `Couldn't add book to db, error: ${createBookRes.error}`} as GetResponse<Book>);
                
                res.status(200).json({title, description} as Book);
            } catch {
                return res.status(404).json({'error': 'The Book API has made an error.'} as GetResponse<Book>);
            } 
        }
    } catch {
        res.status(404).json({'error': 'An unknown error has occurred.'} as GetResponse<Book>);
    }
};

export default BooksHandler;