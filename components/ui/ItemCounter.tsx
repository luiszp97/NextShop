import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { FC } from 'react';

interface Props {
	quantity: number;
	onChangeQuantity: (quantity: number) => void;
	maxValue: number;
}

export const ItemCounter: FC<Props> = ({ quantity, onChangeQuantity, maxValue }) => {
	const changeQuantity = (value: number) => {
		let newQuantity: number;
		if (quantity === 1 && value === -1) return onChangeQuantity(1);
		newQuantity = Math.min(maxValue, quantity + value);
		onChangeQuantity(newQuantity);
	};

	return (
		<Box display='flex' alignItems='center'>
			<IconButton onClick={() => changeQuantity(-1)}>
				<RemoveCircleOutline />
			</IconButton>
			<Typography sx={{ width: 40, textAlign: 'center' }}>{quantity}</Typography>
			<IconButton onClick={() => changeQuantity(1)}>
				<AddCircleOutline />
			</IconButton>
		</Box>
	);
};
