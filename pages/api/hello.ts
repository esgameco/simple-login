// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    name: string
}

const handler = (req: NextApiRequest, res: NextApiResponse<Data>) => {
    console.log(req.cookies);
    res.setHeader('Set-Cookie', 'test=true');
    res.status(200).json({ name: 'John Doe' })
}

export default handler;
