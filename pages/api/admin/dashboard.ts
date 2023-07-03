import { Order, Product, User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    numberOfOrders: number;
    paidOrders: number;
    notPaidOrders: number;
    numberOfClients: number;
    numberOfProducts: number;
    productsWithNoInventory: number;
    lowInventory: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    ] = await Promise.all([
        Order.countDocuments(),
        Order.find({ isPaid: true }).countDocuments(),
        User.find({ role: 'client' }).countDocuments(),
        Product.countDocuments(),
        Product.find({ inStock: 0 }).countDocuments(),
        Product.find({ inStock: { $lte: 10 } }).countDocuments()

    ]);

    // const numberOfOrders = await Order.countDocuments();
    // const paidOrders = await Order.find({ isPaid: true }).countDocuments();
    // const numberOfClients = await User.find({ role: 'client' }).countDocuments();
    // const numberOfProducts = await Product.countDocuments();
    // const productsWithNoInventory = await Product.find({ inStock: 0 }).countDocuments();
    // const lowInventory = await Product.find({ inStock: { $lte: 10 } }).countDocuments();

    res.status(200).json({
        numberOfOrders,
        paidOrders,
        notPaidOrders: numberOfOrders - paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    });
}