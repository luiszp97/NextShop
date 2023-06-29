import { FC, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { IProduct } from '@/interfaces';
import { Card, CardActionArea, CardMedia, Grid, Box, Typography, Link, Chip } from '@mui/material';

interface Props {
	product: IProduct;
}
export const ProductCard: FC<Props> = ({ product }) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isImageLoaded, setIsImageLoaded] = useState(false);

	const productImage = useMemo(() => {
		return isHovered ? `/products/${product.images[1]}` : `/products/${product.images[0]}`;
	}, [isHovered, product.images]);

	return (
		<Grid
			item
			xs={6}
			sm={4}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Card>
				<NextLink href={`/product/${product.slug}`} passHref prefetch={false} legacyBehavior>
					<Link>
						<CardActionArea>
							{product.inStock === 0 && (
								<Chip
									color='primary'
									label='No hay disponibles'
									sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px' }}
								/>
							)}
							<CardMedia
								component='img'
								alt={product.title}
								image={productImage}
								className='fadeIn'
								onLoad={() => setIsImageLoaded(true)}
							/>
						</CardActionArea>
					</Link>
				</NextLink>
			</Card>
			<Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className='fadeIn'>
				<Typography fontWeight={700}>{product.title}</Typography>
				<Typography fontWeight={500}>{`$${product.price}`}</Typography>
			</Box>
		</Grid>
	);
};