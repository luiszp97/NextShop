import { FC, useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import { CartContext } from '@/context';
import { currency } from '@/utils';

interface Props {
	values?: {
		tax: number;
		total: number;
		subtotal: number;
		numberOfItems: number;
	};
}
export const OrdenSumary: FC<Props> = ({ values }) => {
	const { numberOfItems, subtotal, total, tax } = useContext(CartContext);
	const sumaryValues = values ? values : { numberOfItems, subtotal, total, tax };

	return (
		<Grid container>
			<Grid item xs={6}>
				<Typography>No. Productos</Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent='end'>
				<Typography>
					{sumaryValues.numberOfItems} {sumaryValues.numberOfItems > 1 ? 'Items' : 'Item'}
				</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography>Subtotal</Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent='end'>
				<Typography>{currency.format(sumaryValues.subtotal)}</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography>Impuestos({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent='end'>
				<Typography>{currency.format(sumaryValues.tax)}</Typography>
			</Grid>
			<Grid item xs={6} sx={{ mt: 2 }}>
				<Typography variant='subtitle1'>Total</Typography>
			</Grid>
			<Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end'>
				<Typography variant='subtitle1'>{currency.format(sumaryValues.total)}</Typography>
			</Grid>
		</Grid>
	);
};
