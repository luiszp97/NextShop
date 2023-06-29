import { Product } from "@/models";
import { db } from ".";
import { IProduct } from "@/interfaces";

export const getProductsBySlug = async (slug: string): Promise<IProduct | null> => {
    await db.connect();

    const product = await Product.findOne({ slug });

    await db.disconnect();

    if (!product) return null;

    return JSON.parse(JSON.stringify(product));
};



export const getAllProductsSlug = async () => {
    await db.connect();
    const slugs = await Product.find().select('slug -_id').lean();
    await db.disconnect();

    return slugs;
};

export const getProductsByTerm = async (term: string): Promise<IProduct[]> => {

    term = term.toString().toLowerCase();

    await db.connect();
    const products: IProduct[] = await Product.find({
        $text: { $search: term }
    })
        .select(' title images price inStock slug -_id ')
        .lean();
    await db.disconnect();

    return products;

};

export const getAllProducts = async () => {
    await db.connect();
    const products: IProduct[] = await Product.find().lean();

    await db.disconnect();

    return JSON.parse(JSON.stringify(products));
};