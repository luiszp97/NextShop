import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { isValidObjectId } from 'mongoose';
import axios from 'axios';

import { db } from '@/database';
import { IPaypal } from '@/interfaces';
import { Order } from '@/models';
import { authOptions } from '../auth/[...nextauth]';

type Data = {
    message: string;
    isFail?: boolean;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':

            return payOrders(req, res);

        default:
            res.status(200).json({ message: 'Example' });
    }

}

const geyPaypalBearerToken = async (): Promise<string | null> => {
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_CLIENT_SECRET;

    const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64');

    const body = new URLSearchParams('grant_type=client_credentials');

    try {
        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${base64Token}`,
                'Content-Type': 'aplication/x-www-from-urlencoded'
            }
        });
        return data.access_token;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data);
        } else {
            console.log(error);
        }
        return null;
    }
};

const payOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const paypalBearerToken = await geyPaypalBearerToken();

    const session = await getServerSession(req, res, authOptions);

    if (!session) return res.status(400).json({ message: 'Debe estar autenticado ' });


    /* GENERATE PAYPAL BEARER TOKEN  */

    if (!paypalBearerToken) {
        return res.status(400).json({ message: 'No se pudo generar el token ' });
    }

    const { transactionId = '', orderId = '' } = req.body;

    try {

        /* GET PAYPAL ORDER  */

        const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`, {
            headers: {
                'Authorization': `Bearer ${paypalBearerToken}`
            }
        });

        /* VERIFY IF THE ORDER IS COMPLEATE */

        if (data.status !== 'COMPLETED') return res.status(401).json({ message: 'Orden no reconocida' });

        /* VERIFY MONGO ID */

        if (!isValidObjectId(orderId)) return res.status(401).json({ message: 'Order id no es valido' });

        /* GET ORDER TO DB */

        await db.connect();
        const dbOrder = await Order.findById(orderId);

        /* VERIFY IF THE ORDER ID EXIST IN DB */

        if (!dbOrder) {
            await db.disconnect();
            return res.status(401).json({ message: 'Orden no existe en DB' });
        }

        if (session.user._id !== JSON.parse(JSON.stringify(dbOrder.user))) {

            await db.disconnect();
            return res.status(400).json({ message: 'Usuario de la orden es diferente al usuario loggeado' });
        }

        /* VERIFY IF THE PRICE OF THE PAYPAL ORDER AND DB ORDER IS SAME  */

        if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
            await db.disconnect();
            return res.status(401).json({ message: 'Los montos de Paypal y Shop no coinciden' });
        }

        /* IF ALL MATCH : UPDATE THE ORDER TO COMPLETED AND SAVE EN DB */

        dbOrder.transactionId = transactionId;
        dbOrder.isPaid = true;
        dbOrder.save();
        await db.disconnect();

        return res.status(200).json({ message: 'Orden pagada' });
    } catch (error) {
        return res.status(401).json({ message: 'Pago fallido', isFail: true });

    }






};