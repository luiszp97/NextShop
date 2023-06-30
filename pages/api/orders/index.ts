import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';

import { db } from '@/database';
import { Product, Order } from '@/models';
import { IOrder } from '@/interfaces';


type Data =
    | { message: string; }
    | IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return createOrder(req, res);


        default:
            return res.status(400).json({ message: 'Bad request' });;
    }


}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { orderItems, total } = req.body as IOrder;

    /* CHECK IF HAVE A AUTHENTICATED USER */


    const session: any = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ message: 'Debe estar autenticado' });
    }

    /* GET PRODUCTS[] FROM DB  */

    const productsIds = orderItems.map(product => product._id);
    await db.connect();
    const dbProducts = await Product.find({ _id: { $in: productsIds } });

    /* VALIDATE THE INFO, THE INFO IS MATCH WITH THE DB INFO */

    try {
        const subtotal = orderItems.reduce(
            (prev, current) => {
                const currentPrice = dbProducts.find(prod => prod.id === current._id).price;

                if (!currentPrice) throw new Error('Verifique el carrito, producto no existe');
                return currentPrice * current.quantity + prev;
            },
            0
        );

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = (subtotal * taxRate) + subtotal;


        if (total !== backendTotal) throw new Error('El total no coincide con el monto enviado');

        /* THE INFO IS MATCH */

        const userId = session.user._id;
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
        await newOrder.save();
        await db.disconnect();

        return res.status(201).json(newOrder);

    } catch (error: any) {
        await db.disconnect();
        console.log(error);
        res.status(400).json({ message: error.message || 'Revise logs del server' });
    }





};