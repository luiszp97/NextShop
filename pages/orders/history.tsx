import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth';
import NextLink from 'next/link';

import { Typography, Grid, Chip, Link } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { ShopLayout } from '@/components/layout';
import { authOptions } from '../api/auth/[...nextauth]';
import { dbOrder } from '@/database';
import { IOrder } from '@/interfaces';

const colums: GridColDef[] = [
	{ field: 'id', headerName: 'ID', width: 100 },
	{ field: 'fullName', headerName: 'Nombre completo', width: 300 },
	{
		field: 'paid',
		headerName: 'Pagada',
		description: 'Muestra informacion si esta pagada o no ',
		width: 300,
		renderCell: (params) => {
			return params.row.paid ? (
				<Chip color='success' label='Pagada' variant='outlined' />
			) : (
				<Chip color='error' label='No Pagada' variant='outlined' />
			);
		}
	},
	{ field: 'orderId', headerName: 'Order ID', width: 300 },
	{
		field: 'order',
		headerName: 'Ver orden',
		description: 'Muestra el nro de orden',
		width: 200,
		sortable: false,
		renderCell: (params) => (
			<NextLink href={`/orders/${params.row.orderId}`} passHref legacyBehavior>
				<Link underline='always'>Ver order</Link>
			</NextLink>
		)
	}
];

interface Props {
	orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
	const rows = orders.map((order, index) => {
		return {
			id: index + 1,
			paid: order.isPaid,
			fullName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
			orderId: order._id
		};
	});

	return (
		<ShopLayout title='Historial de ordenes' pageDescription='historial de ordenes del cliente'>
			<Typography variant='h1' component='h1'>
				Historial de ordenes
			</Typography>

			<Grid container>
				<Grid item xs={12} sx={{ height: 650, width: '100%' }}>
					<DataGrid
						rows={rows}
						columns={colums}
						initialState={{
							pagination: {
								paginationModel: { pageSize: 5 }
							}
						}}
						pageSizeOptions={[5, 10, 25]}
					/>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const session = await getServerSession(req, res, authOptions);

	if (!session) {
		return {
			redirect: {
				destination: '/auth/login?p=/orders/history',
				permanent: false
			}
		};
	}

	const orders = await dbOrder.getOrdersByUser(session.user._id!.toString());

	return {
		props: {
			orders
		}
	};
};

export default HistoryPage;
