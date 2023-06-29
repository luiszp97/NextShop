import { useContext, useState } from 'react';
import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';

import { ShopLayout } from '@/components/layout';
import { ProductSlideshow } from '@/components/products';
import { ProductSizeSelector } from '@/components/products/ProductSizeSelector';
import { ItemCounter } from '@/components/ui';

import { ICartProduct, IProduct, ISize } from '@/interfaces';
import { dbProducts } from '@/database';
import { CartContext } from '@/context';

// const product = initialData.products[0];

interface Props {
	product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
	const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
		_id: product._id,
		image: product.images[0],
		price: product.price,
		inStock: product.inStock,
		size: undefined,
		slug: product.slug,
		title: product.title,
		gender: product.gender,
		quantity: 1
	});

	const { addProductToCart } = useContext(CartContext);
	const router = useRouter();

	const selectedSize = (size: ISize) => {
		setTempCartProduct((prev) => ({
			...prev,
			size
		}));
	};

	// const changeQuantity = (quantity: number) => {
	// 	console.log(quantity);
	// 	let newQuantity: number;

	// 	if (tempCartProduct.quantity === 1 && quantity === -1) return;

	// 	newQuantity = Math.min(tempCartProduct.inStock, tempCartProduct.quantity + quantity);

	// 	setTempCartProduct((prev) => ({
	// 		...prev,
	// 		quantity: newQuantity
	// 	}));
	// };

	const onUpdateQuantity = (quantity: number) => {
		setTempCartProduct((currentProduct) => ({
			...currentProduct,
			quantity
		}));
	};

	const onAddCartProduct = () => {
		if (!tempCartProduct.size) return;

		addProductToCart(tempCartProduct);
		router.push('/cart');
	};

	return (
		<ShopLayout title={product.title} pageDescription={product.description}>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={7}>
					<ProductSlideshow images={product.images} />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Box display='flex' flexDirection='column'>
						<Typography variant='h1' component='h1'>
							{product.title}
						</Typography>
						<Typography variant='subtitle1' component='h2'>
							{`$${product.price}`}
						</Typography>
						<Box sx={{ my: 2 }}>
							<Typography variant='subtitle2' component='h2'>
								Cantidad
							</Typography>
							<ItemCounter
								maxValue={tempCartProduct.inStock}
								quantity={tempCartProduct.quantity}
								onChangeQuantity={onUpdateQuantity}
							/>
							<ProductSizeSelector
								onSelectedSize={selectedSize}
								selectedSize={tempCartProduct.size}
								sizes={product.sizes}
							/>
						</Box>
						{product.inStock > 0 ? (
							<Button onClick={onAddCartProduct} color='secondary' className='circular-btn'>
								{tempCartProduct.size ? 'Agregar al carrito' : 'Seleccione una talla '}
							</Button>
						) : (
							<Chip label='No hay disponibles' color='error' variant='outlined' />
						)}
						<Box sx={{ mt: 3 }}>
							<Typography variant='subtitle2' component='h2'>
								Description
							</Typography>
							<Typography variant='body2' component='h2'>
								{product.description}
							</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	const slugs = await dbProducts.getAllProductsSlug();

	return {
		paths: slugs.map((slug) => ({
			params: slug
		})),
		fallback: 'blocking'
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug } = params as { slug: string };
	const product = await dbProducts.getProductsBySlug(slug);

	if (!product) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		};
	}

	return {
		props: { product },
		revalidate: 86400
	};
};

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
// 	const { slug } = params as { slug: string };
// 	const product = await dbProducts.getProductsBySlug(slug);

// 	if (!product) {
// 		return {
// 			redirect: {
// 				destination: '/',
// 				permanent: false
// 			}
// 		};
// 	}

// 	return {
// 		props: {
// 			product
// 		}
// 	};
// };

export default ProductPage;
