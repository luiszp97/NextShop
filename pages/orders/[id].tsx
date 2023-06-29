import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth/next';

import { Typography, Grid, Card, CardContent, Divider, Box, Chip } from '@mui/material';
import { CreditScoreOutlined } from '@mui/icons-material';

import { authOptions } from '../api/auth/[...nextauth]';
import { CartList, OrdenSumary } from '@/components/cart';
import { ShopLayout } from '@/components/layout';
import { dbOrder } from '@/database';
import { IOrder } from '../../interfaces/order';
import { useRouter } from 'next/router';

interface Props {
	order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
	const { firstName, lastName, address, city, zip, country, phone, address2 } =
		order.shippingAddress;
	const { query } = useRouter();

	return (
		<ShopLayout title='Resumen de la orden 8576654' pageDescription=' Resumen de la orden '>
			<Typography variant='h1' component='h1'>
				Orden {query.id}
			</Typography>

			{/* <Chip
				sx={{ my: 2 }}
				label='Pendiente de pago'
				variant='outlined'
				color='error'
				icon={<CreditCardOffOutlined />}
			/> */}
			<Chip
				sx={{ my: 2 }}
				label='Orden pagada'
				variant='outlined'
				color='success'
				icon={<CreditScoreOutlined />}
			/>

			<Grid container>
				<Grid item xs={12} sm={7}>
					<CartList />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Card className='sumary-card'>
						<CardContent>
							<Typography variant='h2'>Resumen (3 Productos)</Typography>
							<Divider />

							<Typography variant='subtitle1'>Direccion de entrega</Typography>
							<Typography>{`${firstName} ${lastName}`}</Typography>
							<Typography>
								{address} {address2}
							</Typography>
							<Typography>{city}</Typography>
							<Typography>{country}</Typography>
							<Typography>{zip}</Typography>
							<Typography>{phone}</Typography>

							<Divider sx={{ my: 1 }} />

							<OrdenSumary />

							<Box sx={{ mt: 3 }}>
								{/*Pagar */}
								<h1>Pagar</h1>

								<Chip
									sx={{ my: 2 }}
									label='Orden pagada'
									variant='outlined'
									color='success'
									icon={<CreditScoreOutlined />}
								/>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req, query, res }) => {
	const { id = '' } = query;
	const session = await getServerSession(req, res, authOptions);

	if (!session) {
		return {
			redirect: {
				destination: `/auth/login?p=/orders/${id}`,
				permanent: false
			}
		};
	}

	const order = await dbOrder.getOrderById(id.toString());

	if (!order) {
		return {
			redirect: {
				destination: '/orders/history',
				permanent: false
			}
		};
	}

	if (order.user !== session.user._id) {
		return {
			redirect: {
				destination: '/orders/history',
				permanent: false
			}
		};
	}

	return {
		props: {
			order
		}
	};
};

export default OrderPage;
