import { useEffect, useState } from 'react';
import useSWR from 'swr';
import {
	AccessTimeOutlined,
	AttachMoneyOutlined,
	CancelPresentationOutlined,
	CategoryOutlined,
	CreditCardOffOutlined,
	DashboardOutlined,
	GroupOutlined,
	ProductionQuantityLimitsOutlined
} from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';

import { SumaryTitle } from '@/components/admin';
import { AdminLayout } from '@/components/layout';
import { DashboardSumaryResponse } from '@/interfaces';

const AdminPage = () => {
	const { data, error, isLoading } = useSWR<DashboardSumaryResponse>('/api/admin/dashboard', {
		refreshInterval: 3000
	});

	const [refreshInterval, setRefreshInterval] = useState(30);

	useEffect(() => {
		const interval = setInterval(() => {
			setRefreshInterval((refreshIn) => (refreshIn > 0 ? refreshIn - 1 : 30));
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	if (isLoading) return <Typography>Cargando...</Typography>;
	if (!error && !data) return <></>;
	if (error) return <Typography>{error}</Typography>;

	const {
		numberOfOrders,
		paidOrders,
		notPaidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		lowInventory
	} = data!;

	return (
		<AdminLayout title='Dashboard' subtitle='Estadisticas generales' icon={<DashboardOutlined />}>
			<Grid container spacing={2}>
				<SumaryTitle
					title={numberOfOrders}
					subtitle='Ordenes totales'
					icon={<CreditCardOffOutlined color='secondary' sx={{ fontSize: 40 }} />}
				/>
				<SumaryTitle
					title={paidOrders}
					subtitle='Ordenes pagadas'
					icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
				/>
				<SumaryTitle
					title={notPaidOrders}
					subtitle='Ordenes pendentes'
					icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
				/>
				<SumaryTitle
					title={numberOfClients}
					subtitle='Clientes'
					icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
				/>
				<SumaryTitle
					title={numberOfProducts}
					subtitle='Productos'
					icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
				/>
				<SumaryTitle
					title={productsWithNoInventory}
					subtitle='Sin existencias'
					icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />}
				/>
				<SumaryTitle
					title={lowInventory}
					subtitle='Bajo invenario'
					icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />}
				/>
				<SumaryTitle
					title={refreshInterval}
					subtitle='Actualizacion en:'
					icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
				/>
			</Grid>
		</AdminLayout>
	);
};

export default AdminPage;
