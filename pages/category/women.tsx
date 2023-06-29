import { ShopLayout } from '@/components/layout';
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui';
import { Typography } from '@mui/material';
import { useProducts } from '@/hooks';

const WomenPage = () => {
	const { products, isLoading } = useProducts('/products?gender=women');
	return (
		<ShopLayout title={'Mujeres'} pageDescription={'Encuentra los mejores productos de mujeres'}>
			<Typography variant='h1' component='h1'>
				Tienda
			</Typography>
			<Typography variant='h2' sx={{ mb: 1 }}>
				Todos los productos para mujeres
			</Typography>

			{isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
		</ShopLayout>
	);
};

export default WomenPage;
