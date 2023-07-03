import { useContext } from 'react';
import NextLink from 'next/link';
import { AppBar, Box, Button, Link, Toolbar, Typography } from '@mui/material';

import { UiContext } from '@/context';

export const AdminNavbar = () => {
	const { toggleMenu } = useContext(UiContext);

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
				<Button onClick={toggleMenu}>Menu</Button>
			</Toolbar>
		</AppBar>
	);
};
