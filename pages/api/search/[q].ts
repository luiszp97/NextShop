import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import { Product } from '@/models';
import { IProduct } from '../../../interfaces/products';

type Data =
    | { message: string; }
    | IProduct[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':

            return searchProducts(req, res);

        default:
            res.status(400).json({ message: 'Bad request' });
    }
}

const searchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    let { q = '' } = req.query;

    if (q.length == 0) {
        res.status(400).json({ message: 'Debe indicar un query de busqueda' });
    }

    q = q.toString().toLocaleLowerCase();

    await db.connect();
    const products = await Product.find({
        $text: { $search: q }
    })
        .select('title price inStock slug images -_id ');
    await db.disconnect();

    res.status(200).json(products);
};