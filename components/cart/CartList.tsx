import { FC, useContext } from 'react';
import NextLink from 'next/link';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';

import { ItemCounter } from '../ui';
import { CartContext } from '@/context';
import { ICartProduct } from '@/interfaces';

// const productsInCart = [initialData.products[0], initialData.products[5], initialData.products[3]];

interface Props {
	editable?: boolean;
}
export const CartList: FC<Props> = ({ editable = false }) => {
	const { cart, updateCartQuantity, removeProductToCart } = useContext(CartContext);

	const onNewQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
		product.quantity = newQuantityValue;
		updateCartQuantity(product);
	};

	return (
		<>
			{cart.map((product) => (
				<Grid container key={product.slug + product.size} spacing={2} sx={{ mb: 1 }}>
					<Grid item xs={3}>
						{/*Llevar a la pagina del producto */}
						<NextLink href={`/product/${product.slug}`} passHref legacyBehavior>
							<Link>
								<CardActionArea>
									<CardMedia
										image={`/products/${product.image}`}
										component='img'
										sx={{ borderRadius: '5px' }}
									/>
								</CardActionArea>
							</Link>
						</NextLink>
					</Grid>
					<Grid item xs={7}>
						<Box display='flex' flexDirection='column'>
							<Typography variant='body1' component='p'>
								{product.title}
							</Typography>
							<Typography variant='body1'>
								Talla: <strong>{product.size}</strong>
							</Typography>
							{editable ? (
								<ItemCounter
									maxValue={product.inStock}
									quantity={product.quantity}
									onChangeQuantity={(newValue) => onNewQuantityValue(product, newValue)}
								/>
							) : (
								<Typography variant='h4' component='p'>
									{product.quantity}
									{product.quantity > 1 ? 'Productos' : 'Producto'}
								</Typography>
							)}
						</Box>
					</Grid>
					<Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
						<Typography variant='subtitle1' component='p'>{`$${product.price}`}</Typography>
						{/*Editable */}

						{editable && (
							<Button onClick={() => removeProductToCart(product)} variant='text' color='secondary'>
								Remover
							</Button>
						)}
					</Grid>
				</Grid>
			))}
		</>
	);
};
