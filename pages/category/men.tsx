import { ShopLayout } from '@/components/layout';
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui';
import { Typography } from '@mui/material';
import { useProducts } from '@/hooks';

const MenPage = () => {
	const { products, isLoading } = useProducts('/products?gender=men');
	return (
		<ShopLayout title={'Hombre'} pageDescription={'Encuentra los mejores productos de hombres'}>
			<Typography variant='h1' component='h1'>
				Tienda
			</Typography>
			<Typography variant='h2' sx={{ mb: 1 }}>
				Todos los productos para hombres
			</Typography>

			{isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
		</ShopLayout>
	);
};

export default MenPage;
