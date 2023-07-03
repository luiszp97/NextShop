import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth/next';
import { useRouter } from 'next/router';
import { PayPalButtons } from '@paypal/react-paypal-js';
import type { OrderResponseBody } from '@paypal/paypal-js/types/apis/orders';

import {
	Typography,
	Grid,
	Card,
	CardContent,
	Divider,
	Box,
	Chip,
	CircularProgress
} from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { authOptions } from '../api/auth/[...nextauth]';
import { CartList, OrdenSumary } from '@/components/cart';
import { ShopLayout } from '@/components/layout';
import { dbOrder } from '@/database';
import { IOrder } from '@/interfaces/order';
import { shopApi } from '@/api';
import { useState } from 'react';

interface Props {
	order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
	const [isPaying, setIsPaying] = useState(false);

	const router = useRouter();
	const { firstName, lastName, address, city, zip, country, phone, address2 } =
		order.shippingAddress;

	const orderSumaryValues = {
		tax: order.tax,
		subtotal: order.subtotal,
		total: order.total,
		numberOfItems: order.numberOfItems
	};

	const onOrderCompleted = async (details: OrderResponseBody) => {
		if (details.status !== 'COMPLETED') return alert('No hay pago en paypal');

		setIsPaying(true);

		try {
			await shopApi.post(`/orders/pay`, {
				transactionId: details.id,
				orderId: order._id
			});

			router.reload();
		} catch (error) {
			setIsPaying(false);
		}
	};

	return (
		<ShopLayout title='Resumen de la orden' pageDescription=' Resumen de la orden '>
			<Typography variant='h1' component='h1'>
				Orden {order._id}
			</Typography>

			{order.isPaid ? (
				<Chip
					sx={{ my: 2 }}
					label='Orden pagada'
					variant='outlined'
					color='success'
					icon={<CreditScoreOutlined />}
				/>
			) : (
				<Chip
					sx={{ my: 2 }}
					label='Pendiente de pago'
					variant='outlined'
					color='error'
					icon={<CreditCardOffOutlined />}
				/>
			)}

			<Grid container>
				<Grid item xs={12} sm={7}>
					<CartList products={order.orderItems} />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Card className='sumary-card'>
						<CardContent>
							<Typography variant='h2'>
								Resumen ({order.numberOfItems} Producto{order.numberOfItems !== 1 && 's'})
							</Typography>
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

							<OrdenSumary values={orderSumaryValues} />

							<Box sx={{ mt: 3 }}>
								{isPaying ? (
									<Box display='flex' justifyContent='center' className='fadeIn'>
										<CircularProgress />
									</Box>
								) : (
									<Box display='flex' flexDirection='column'>
										{order.isPaid ? (
											<Chip
												sx={{ my: 2, width: '100%' }}
												label='Orden pagada'
												variant='outlined'
												color='success'
												icon={<CreditScoreOutlined />}
											/>
										) : (
											<PayPalButtons
												createOrder={(data, actions) => {
													return actions.order.create({
														purchase_units: [
															{
																amount: {
																	value: `${order.total}`
																}
															}
														]
													});
												}}
												onApprove={(data, actions) => {
													return actions.order!.capture().then((details) => {
														onOrderCompleted(details);
														// const name = details.payer.name!.given_name;
														// alert(`Transaction completed by ${name}`);
													});
												}}
											/>
										)}
									</Box>
								)}
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
