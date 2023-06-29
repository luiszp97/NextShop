import { Box, CircularProgress, Typography } from '@mui/material';
import { ShopLayout } from '../layout';

export const FullScreenLoading = () => {
	return (
		<ShopLayout title='Cargando ....' pageDescription='no hay nada que mostrar aqui'>
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				flexDirection='column'
				height='calc(100vh - 200px)'
			>
				<Typography mb={2}>Cargando ....</Typography>
				<CircularProgress thickness={2} />
			</Box>
		</ShopLayout>
	);
};
