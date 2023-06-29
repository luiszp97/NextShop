import { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Grid, Typography, TextField, Button, Link, Chip } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

import { AuthLayout } from '@/components/layout';
import { validations } from '@/utils';
import { AuthContext } from '@/context';

type FromData = {
	name: string;
	email: string;
	password: string;
};

const RegisterPage = () => {
	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FromData>();

	const router = useRouter();
	const { registerUser } = useContext(AuthContext);

	const onRegisterForm: SubmitHandler<FromData> = async ({ name, email, password }) => {
		setShowError(false);

		const { hasError, message } = await registerUser(name, email, password);
		console.log(hasError, message);

		if (hasError) {
			setShowError(true);
			setErrorMessage(message!);
			setTimeout(() => {
				setShowError(false);
			}, 4000);
			return;
		}

		// const destination = router.query.p?.toString() || '/';
		// router.replace(destination);
		await signIn('credentials', { email, password });
	};

	return (
		<AuthLayout title='Crear una cuenta'>
			<Box sx={{ width: 350, padding: '10px 20px' }}>
				<form onSubmit={handleSubmit(onRegisterForm)}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant='h1' component='h1'>
								Crear cuenta
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<TextField
								{...register('name', {
									required: 'El nombre es oblogatorio',
									minLength: { value: 3, message: 'Debe contener al menos 3 caracteres' }
								})}
								label='Nombre'
								fullWidth
								error={!!errors.name}
								helperText={errors.name?.message}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								{...register('email', {
									required: 'El email es obligatorio',
									validate: validations.isEmail
								})}
								type='email'
								label='Correo'
								fullWidth
								error={!!errors.email}
								helperText={errors.email?.message}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								{...register('password', {
									required: 'El password es obligatorio',
									minLength: { value: 7, message: 'Debe contener al menos 7 caracteres' }
								})}
								label='Contraseña'
								type='password'
								fullWidth
								error={!!errors.password}
								helperText={errors.password?.message}
							/>
						</Grid>
						<Grid item xs={12}>
							<Chip
								label={errorMessage}
								color='error'
								icon={<ErrorOutline />}
								className='fadeIn'
								sx={{ display: showError ? 'flex' : 'none', mb: 1 }}
							/>
							<Button
								type='submit'
								color='secondary'
								className='circular-btn'
								size='large'
								fullWidth
							>
								Registrar
							</Button>
						</Grid>
						<Grid item xs={12} display='flex' justifyContent='end'>
							<NextLink href='/auth/login' passHref legacyBehavior>
								<Link underline='always'>Ya tienes una cuenta?</Link>
							</NextLink>
						</Grid>
					</Grid>
				</form>
			</Box>
		</AuthLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	const session = await getSession({ req });
	const { p = '/' } = query;

	if (session) {
		return {
			redirect: {
				destination: p.toString(),
				permanent: false
			}
		};
	}
	return {
		props: {}
	};
};

export default RegisterPage;
