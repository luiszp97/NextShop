import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

import {
	Typography,
	Grid,
	Card,
	CardContent,
	Divider,
	Box,
	Button,
	Link,
	Chip
} from '@mui/material';

import { ShopLayout } from '@/components/layout';
import { CartList, OrdenSumary } from '@/components/cart';
import { CartContext } from '@/context';

const SumaryPage = () => {
	const [isPosting, setIsPosting] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const { shippingAddress, createOrder } = useContext(CartContext);

	const router = useRouter();

	const onCreateOrder = async () => {
		setIsPosting(true);

		const { hasError, message } = await createOrder();

		if (hasError) {
			setIsPosting(false);
			setErrorMessage(message);
			return;
		}

		router.replace(`/orders/${message}`);
	};

	useEffect(() => {
		if (!Cookies.get('firstName')) {
			router.push('/checkout/adress');
		}
	}, [router]);

	if (!shippingAddress) return <></>;
	const { firstName, lastName, address, city, country, phone, zip, address2 } = shippingAddress;

	return (
		<ShopLayout title='Resumen de la orden' pageDescription=' Resumen de la orden '>
			<Typography variant='h1' component='h1'>
				Resumen de la orden
			</Typography>
			<Grid container>
				<Grid item xs={12} sm={7}>
					<CartList />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Card className='sumary-card'>
						<CardContent>
							<Typography variant='h2'>Resumen (3 Productos)</Typography>
							<Divider />

							<Box display='flex' justifyContent='space-between'>
								<Typography variant='subtitle1'>Direccion de entrega</Typography>
								<NextLink href='/checkout/adress' passHref legacyBehavior>
									<Link underline='always'>Editar</Link>
								</NextLink>
							</Box>

							<Typography>
								{firstName}
								{lastName}
							</Typography>
							<Typography>{address}</Typography>
							<Typography>{city}</Typography>
							<Typography>{country}</Typography>
							<Typography>{zip}</Typography>
							<Typography>{phone}</Typography>

							<Divider sx={{ my: 1 }} />

							<Box display='flex' justifyContent='end'>
								<NextLink href='/cart' passHref legacyBehavior>
									<Link underline='always'>Editar</Link>
								</NextLink>
							</Box>

							<OrdenSumary />
							<Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
								<Button
									onClick={onCreateOrder}
									color='secondary'
									className='circular-btn'
									fullWidth
									disabled={isPosting}
								>
									Confirmar Orden
								</Button>

								<Chip
									color='error'
									label={errorMessage}
									sx={{ display: errorMessage ? 'flex' : 'none', mt: 1 }}
								/>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export default SumaryPage;
