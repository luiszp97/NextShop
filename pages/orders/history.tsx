import NextLink from 'next/link';
import { ShopLayout } from '@/components/layout';
import { Typography, Grid, Chip, Link } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

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
	{
		field: 'order',
		headerName: 'Ver orden',
		description: 'Muestra el nro de orden',
		width: 200,
		sortable: false,
		renderCell: (params) => (
			<NextLink href={`/orders/${params.row.id}`} passHref legacyBehavior>
				<Link underline='always'>Ver order</Link>
			</NextLink>
		)
	}
];

const rows = [
	{ id: 1, paid: false, fullName: 'Luis Parra' },
	{ id: 2, paid: true, fullName: 'Luis Parra' },
	{ id: 3, paid: true, fullName: 'Luis Parra' },
	{ id: 4, paid: false, fullName: 'Luis Parra' }
];
function history() {
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
}

export default history;
