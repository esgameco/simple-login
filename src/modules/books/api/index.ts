import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import config from 'config';

import { checkToken } from '../../auth/utils/token';

interface Book {
    title?: string;
    description?: string;
}

interface BookResponse extends Book {
    error?: string;
}

interface BookSearchQuery {
    auth?: string;
    bookISBN?: string;
}

const BooksHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { auth, bookISBN } = req.query as BookSearchQuery;

    if (!auth)
        return res.status(404).json({'error': 'Auth token is not provided.'} as BookResponse);

    try {
        const { verified } = checkToken(auth);

        if (verified) {
            const bookApiRes: AxiosResponse = await axios.get(`https://openlibrary.org/isbn/${bookISBN}`);

            const {title, description} = bookApiRes.data as Book;
            res.status(200).json({title, description} as BookResponse);
        } else
            return res.status(404).json({'error': 'User is not logged in.'} as BookResponse);
    }
    catch {
        res.status(404).json({'error': 'User is not authorized'} as BookResponse);
    }
};

export default BooksHandler;