import { SubmitHandler, useForm } from 'react-hook-form';
import {
	Box,
	Button,
	FormControl,
	Grid,
	MenuItem,
	Select,
	TextField,
	Typography
} from '@mui/material';
import { ShopLayout } from '@/components/layout';
import { countries } from '@/utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { CartContext } from '@/context';

interface FromData {
	firstName: string;
	lastName: string;
	address: string;
	address2?: string;
	zip: string;
	city: string;
	country: string;
	phone: string;
}

const getAdressFromCookies = (): FromData => {
	return {
		firstName: Cookies.get('firstName') || '',
		lastName: Cookies.get('lastName') || '',
		address: Cookies.get('address') || '',
		address2: Cookies.get('address2') || '',
		zip: Cookies.get('zip') || '',
		city: Cookies.get('city') || '',
		country: Cookies.get('country') || '',
		phone: Cookies.get('phone') || ''
	};
};

const AdressPage = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors }
	} = useForm<FromData>({
		defaultValues: getAdressFromCookies()
	});
	const router = useRouter();
	const { updateAddress } = useContext(CartContext);
	const selectValue = watch('country');

	const onCheckout: SubmitHandler<FromData> = (data) => {
		updateAddress(data);

		router.push('/checkout/sumary');
	};

	return (
		<ShopLayout title='Direccion' pageDescription='Confirmar direccion de destino'>
			<Typography variant='h1' component='h1'>
				Direccion
			</Typography>
			<form onSubmit={handleSubmit(onCheckout)}>
				<Grid container spacing={2} mt={2}>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Nombre'
							variant='filled'
							fullWidth
							{...register('firstName', {
								required: 'El nombre el obligatorio',
								minLength: { value: 2, message: 'El nombre debe tener al menos 2 digitos' }
							})}
							error={!!errors.firstName}
							helperText={errors.firstName?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Apellido'
							variant='filled'
							fullWidth
							{...register('lastName', {
								required: 'El apellido el obligatorio',
								minLength: { value: 2, message: 'El apellido debe tener al menos 2 digitos' }
							})}
							error={!!errors.lastName}
							helperText={errors.lastName?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Direccion'
							variant='filled'
							fullWidth
							{...register('address', {
								required: 'La direccion es obligatoria'
							})}
							error={!!errors.address}
							helperText={errors.address?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Direccion2 (opcional)'
							variant='filled'
							fullWidth
							{...register('address2')}
							error={!!errors.address2}
							helperText={errors.address2?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Codigo Postal'
							variant='filled'
							fullWidth
							{...register('zip', {
								required: 'El codigo postal el obligatorio'
							})}
							error={!!errors.zip}
							helperText={errors.zip?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Ciudad'
							variant='filled'
							fullWidth
							{...register('city', {
								required: 'La ciudad es obligatoria'
							})}
							error={!!errors.city}
							helperText={errors.city?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth>
							<Select
								variant='filled'
								label='Pais'
								value={selectValue}
								{...register('country', {
									required: 'El pais es obligatorio'
								})}
								error={!!errors.country}
							>
								{countries.map((country) => (
									<MenuItem key={country.code} value={country.name}>
										{country.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Telefono'
							variant='filled'
							fullWidth
							{...register('phone', {
								required: 'El telefono es obligatorio'
							})}
							error={!!errors.phone}
							helperText={errors.phone?.message}
						/>
					</Grid>
				</Grid>

				<Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
					<Button color='secondary' type='submit' className='circular-btn' size='large'>
						Revisar pedido
					</Button>
				</Box>
			</form>
		</ShopLayout>
	);
};

export default AdressPage;
