import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';

import { signIn, getProviders } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { useForm, SubmitHandler } from 'react-hook-form';

import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

import { authOptions } from '../api/auth/[...nextauth]';
import { AuthLayout } from '@/components/layout';
import { validations } from '@/utils';

type FromData = {
	email: string;
	password: string;
};

const LoginPage = () => {
	const [showError, setShowError] = useState(false);
	const [providers, setProviders] = useState<any>({});
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FromData>();
	const router = useRouter();

	const onLoginUser: SubmitHandler<FromData> = async ({ email, password }) => {
		setShowError(false);
		await signIn('credentials', { email, password });

		// const isValidLogin = await loginUser(email, password);

		// if (!isValidLogin) {
		// 	setShowError(true);

		// 	setTimeout(() => {
		// 		setShowError(false);
		// 	}, 4000);
		// }
		// const destination = router.query.p?.toString() || '/';
		// router.replace(destination);
	};

	useEffect(() => {
		getProviders().then((prov) => {
			setProviders(prov);
		});
	}, []);

	return (
		<AuthLayout title='Ingresar'>
			<form onSubmit={handleSubmit(onLoginUser)}>
				<Box sx={{ width: 350, padding: '10px 20px' }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant='h1' component='h1'>
								Iniciar sesion
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<TextField
								{...register('email', {
									required: 'Este campo es obligatorio',
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
									required: 'Este campo es requerido',
									minLength: {
										value: 6,
										message: 'Minimo 6 caracteres'
									}
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
								label='Credenciales incorrectas'
								color='error'
								icon={<ErrorOutline />}
								className='fadeIn'
								sx={{ display: showError ? 'flex' : 'none', mb: 1 }}
							/>
							<Button
								color='secondary'
								type='submit'
								className='circular-btn'
								size='large'
								fullWidth
							>
								Ingresar
							</Button>
						</Grid>
						<Grid item xs={12} display='flex' justifyContent='end'>
							<NextLink
								href={`/auth/register${router.query.p ? `?p=${router.query.p}` : ''}`}
								passHref
								legacyBehavior
							>
								<Link underline='always'>No tienes una cuenta?</Link>
							</NextLink>
						</Grid>
						<Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
							<Divider sx={{ width: '100%', mb: 2 }} />
							{Object.values(providers).map((provider: any) => {
								if (provider.id === 'credentials') return <></>;
								return (
									<Button
										key={provider.id}
										variant='outlined'
										fullWidth
										color='primary'
										sx={{ mb: 1 }}
										onClick={() => signIn(provider.id)}
									>
										{provider.name}
									</Button>
								);
							})}
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
	const session = await getServerSession(req, res, authOptions);
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
export default LoginPage;

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
