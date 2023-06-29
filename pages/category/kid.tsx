import { ShopLayout } from '@/components/layout';
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui';
import { Typography } from '@mui/material';
import { useProducts } from '@/hooks';

const KidPage = () => {
	const { products, isLoading } = useProducts('/products?gender=kid');
	return (
		<ShopLayout title={'Niños'} pageDescription={'Encuentra los mejores productos de Niños'}>
			<Typography variant='h1' component='h1'>
				Tienda
			</Typography>
			<Typography variant='h2' sx={{ mb: 1 }}>
				Todos los productos para Niños
			</Typography>

			{isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
		</ShopLayout>
	);
};

export default KidPage;
