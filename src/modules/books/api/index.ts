import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import config from 'config';

import { getUser } from '../../auth/db/user';
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
        // Checks the token and gets username from it
        const { verified, data } = checkToken(auth);

        if (!verified)
            return res.status(404).json({'error': 'User is not logged in.'} as BookResponse);

        // Get user from the database with the username in the token
        const { exists, user } = await getUser(data.username);

        if (!exists)
            return res.status(404).json({'error': 'User no longer exists.'} as BookResponse);

        if (user.queriesleft == 0)
            return res.status(404).json({'error': 'User has no more queries left.'} as BookResponse);

        if (user.accesslevel < 0)
            return res.status(404).json({'error': 'User doesn\'t have access to this page.'} as BookResponse);

        try {
            const bookApiRes: AxiosResponse = await axios.get(`https://openlibrary.org/isbn/${bookISBN}`);

            

            const {title, description} = bookApiRes.data as Book;
            res.status(200).json({title, description} as BookResponse);
        } catch {
            return res.status(404).json({'error': 'The Book API has made an error.'} as BookResponse);
        } 
    } catch {
        res.status(404).json({'error': 'An unknown error has occurred.'} as BookResponse);
    }
};

export default BooksHandler;