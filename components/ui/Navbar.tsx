import NextLink from 'next/link';
import {
	AppBar,
	Box,
	Button,
	IconButton,
	Link,
	Toolbar,
	Typography,
	Badge,
	Input,
	InputAdornment
} from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { CartContext, UiContext } from '@/context';

export const Navbar = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [isSearchVisible, setIsSearchVisible] = useState(false);
	const { asPath } = useRouter();
	const { toggleMenu } = useContext(UiContext);
	const { numberOfItems } = useContext(CartContext);
	const router = useRouter();

	const onSearchTerm = () => {
		if (searchTerm.trim().length === 0) return;
		router.push(`/search/${searchTerm}`);
	};

	return (
		<AppBar>
			<Toolbar>
				<NextLink href='/' passHref legacyBehavior>
					<Link display='flex' alignItems='center'>
						<Typography variant='h6'>Next |</Typography>
						<Typography sx={{ ml: 0.5 }}>Shop</Typography>
					</Link>
				</NextLink>
				<Box flex={1} />
				<Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}>
					<NextLink href='/category/men' passHref legacyBehavior>
						<Link>
							<Button color={asPath === '/category/men' ? 'primary' : 'info'}>Hombres</Button>
						</Link>
					</NextLink>
					<NextLink href='/category/women' passHref legacyBehavior>
						<Link>
							<Button color={asPath === '/category/women' ? 'primary' : 'info'}>Mujeres</Button>
						</Link>
					</NextLink>
					<NextLink href='/category/kid' passHref legacyBehavior>
						<Link>
							<Button color={asPath === '/category/kid' ? 'primary' : 'info'}>Niños</Button>
						</Link>
					</NextLink>
				</Box>
				<Box flex={1} />
				{/* Pantallas Pequenas  */}

				<IconButton onClick={toggleMenu} sx={{ display: { xs: 'flex', sm: 'none' } }}>
					<SearchOutlined />
				</IconButton>

				{/* Pantallas Grandes  */}

				{isSearchVisible ? (
					<Input
						className='fadeIn'
						sx={{ display: { xs: 'none', sm: 'flex' } }}
						autoFocus
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						onKeyUp={(e) => e.key === 'Enter' && onSearchTerm()}
						type='text'
						placeholder='Buscar...'
						endAdornment={
							<InputAdornment position='end'>
								<IconButton
									onClick={() => setIsSearchVisible(false)}
									aria-label='toggle password visibility'
								>
									<ClearOutlined />
								</IconButton>
							</InputAdornment>
						}
					/>
				) : (
					<IconButton
						sx={{ display: { xs: 'none', sm: 'flex' } }}
						className='fadeIn'
						onClick={() => setIsSearchVisible(true)}
					>
						<SearchOutlined />
					</IconButton>
				)}

				<NextLink href='/cart' passHref legacyBehavior>
					<Link>
						<IconButton>
							<Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color='secondary'>
								<ShoppingCartOutlined />
							</Badge>
						</IconButton>
					</Link>
				</NextLink>
				<Button onClick={toggleMenu}>Menu</Button>
			</Toolbar>
		</AppBar>
	);
};
