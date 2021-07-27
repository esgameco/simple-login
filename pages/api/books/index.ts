import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import config from 'config';
import axios, { AxiosResponse } from 'axios';

interface Book {
    title?: string;
}

const BooksHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { auth, bookISBN } = req.query;

    if (!auth)
        return res.json({'error': 'Auth token is not provided.'});

    try {
        const isLoggedIn = verify(auth, config.get('secretKey'));

        if (isLoggedIn) {
            const bookApiRes: AxiosResponse = await axios.get(`https://openlibrary.org/isbn/${bookISBN}`);
            const {title} = bookApiRes.data as Book;
            res.json({title});
        } else
            return res.json({'error': 'User is not logged in.'});
    }
    catch {
        res.json({'error': 'User is not authorized'});
    }
};

export default BooksHandler;