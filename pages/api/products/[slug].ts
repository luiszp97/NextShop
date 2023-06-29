import { db } from "@/database";
import { IProduct } from "@/interfaces";
import { Product } from "@/models";
import { NextApiRequest, NextApiResponse } from "next";


type Data =
    | { message: string; }
    | IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProductBySlug(req, res);


        default:
            return res.status(400).json({ message: 'Not Found' });
    }
};

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { slug = '' } = req.query;

    await db.connect();
    const product = await Product.findOne({ slug })
        .select(' -slug -tags -type -gender -createdAt -updatedAt -__v ');
    await db.disconnect();

    if (!product) {

        return res.status(400).json({ message: 'no se encontro ningun producto' });

    }

    res.status(200).json(product);


};