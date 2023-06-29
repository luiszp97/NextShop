import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import {
	Box,
	Divider,
	Drawer,
	IconButton,
	Input,
	InputAdornment,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListSubheader
} from '@mui/material';
import {
	AccountCircleOutlined,
	AdminPanelSettings,
	CategoryOutlined,
	ConfirmationNumberOutlined,
	EscalatorWarningOutlined,
	FemaleOutlined,
	LoginOutlined,
	MaleOutlined,
	SearchOutlined,
	VpnKeyOutlined
} from '@mui/icons-material';
import { AuthContext, UiContext } from '@/context';

export const SideMenu = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const { isMenuOpen, toggleMenu } = useContext(UiContext);
	const { user, isLoggedIn, logoutUser } = useContext(AuthContext);
	const router = useRouter();

	const role = user?.role;

	const navigateTo = (url: string) => {
		toggleMenu();
		router.push(url);
	};

	const onSearchTerm = () => {
		if (searchTerm.trim().length === 0) return;
		navigateTo(`/search/${searchTerm}`);
	};

	const onLogout = () => {
		toggleMenu();
		logoutUser();
	};

	return (
		<Drawer
			open={isMenuOpen}
			onClose={toggleMenu}
			anchor='right'
			sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
		>
			<Box sx={{ width: 250, paddingTop: 5 }}>
				<List>
					<ListItem>
						<Input
							autoFocus
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyUp={(e) => e.key === 'Enter' && onSearchTerm()}
							type='text'
							placeholder='Buscar...'
							endAdornment={
								<InputAdornment position='end'>
									<IconButton onClick={onSearchTerm} aria-label='toggle password visibility'>
										<SearchOutlined />
									</IconButton>
								</InputAdornment>
							}
						/>
					</ListItem>

					{isLoggedIn && (
						<>
							<ListItemButton>
								<ListItemIcon>
									<AccountCircleOutlined />
								</ListItemIcon>
								<ListItemText primary={'Perfil'} />
							</ListItemButton>

							<ListItemButton onClick={() => navigateTo('/orders/history')}>
								<ListItemIcon>
									<ConfirmationNumberOutlined />
								</ListItemIcon>
								<ListItemText primary={'Mis Ordenes'} />
							</ListItemButton>
						</>
					)}

					<ListItemButton
						onClick={() => navigateTo('/category/men')}
						sx={{ display: { xs: '', sm: 'none' } }}
					>
						<ListItemIcon>
							<MaleOutlined />
						</ListItemIcon>
						<ListItemText primary={'Hombres'} />
					</ListItemButton>

					<ListItemButton
						onClick={() => navigateTo('/category/women')}
						sx={{ display: { xs: '', sm: 'none' } }}
					>
						<ListItemIcon>
							<FemaleOutlined />
						</ListItemIcon>
						<ListItemText primary={'Mujeres'} />
					</ListItemButton>

					<ListItemButton
						onClick={() => navigateTo('/category/kid')}
						sx={{ display: { xs: '', sm: 'none' } }}
					>
						<ListItemIcon>
							<EscalatorWarningOutlined />
						</ListItemIcon>
						<ListItemText primary={'Niños'} />
					</ListItemButton>

					{isLoggedIn ? (
						<ListItemButton onClick={onLogout}>
							<ListItemIcon>
								<LoginOutlined />
							</ListItemIcon>
							<ListItemText primary={'Salir'} />
						</ListItemButton>
					) : (
						<>
							<ListItemButton onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}>
								<ListItemIcon>
									<VpnKeyOutlined />
								</ListItemIcon>
								<ListItemText primary={'Ingresar'} />
							</ListItemButton>
						</>
					)}

					{/* Admin */}

					{role === 'admin' && (
						<>
							<Divider />
							<ListSubheader>Admin Panel</ListSubheader>

							<ListItemButton>
								<ListItemIcon>
									<CategoryOutlined />
								</ListItemIcon>
								<ListItemText primary={'Productos'} />
							</ListItemButton>
							<ListItemButton>
								<ListItemIcon>
									<ConfirmationNumberOutlined />
								</ListItemIcon>
								<ListItemText primary={'Ordenes'} />
							</ListItemButton>

							<ListItemButton>
								<ListItemIcon>
									<AdminPanelSettings />
								</ListItemIcon>
								<ListItemText primary={'Usuarios'} />
							</ListItemButton>
						</>
					)}
				</List>
			</Box>
		</Drawer>
	);
};
