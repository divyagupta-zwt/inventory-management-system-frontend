import { ArrowRight, CheckCircle, Clock, Plus, RefreshCw, ShoppingBag, XCircle } from 'lucide-react';
import Button from '../components/common/Button';
import StatCard from '../components/dashboard/StatCard';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { useEffect, useMemo } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatCurrency, formatDate } from '../utils/formatters';
import Badge from '../components/common/Badge';

const Dashboard=()=>{
    const navigate= useNavigate();
    const {data: orders, loading, error, refetch}= useOrders();

    const stats= useMemo(()=>{
        if(!orders) return null;
        return {
            total: orders.length,
            pending: orders.filter(o=> o.status==='PLACED').length,
            cancelled: orders.filter(o=> o.status==='CANCELLED').length,
            completed: orders.filter(o=> o.status==='COMPLETED').length,
        };
    },[orders]);

    const recentOrders= useMemo(()=>{
        if(!orders) return null;
        return [...orders]
            .sort((a,b)=> new Date(b.order_date)- new Date(a.order_date))
            .slice(0,5);
    },[orders]);

    useEffect(()=>{
        const interval= setInterval(refetch, 30000);
        return ()=> clearInterval(interval);
    },[refetch]);
    

    if (loading && !orders.length) return <LoadingSpinner fullPage />
    if(error) return <ErrorMessage message={error} onRetry={refetch} />

    const thStyle= { padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.875rem' };

    return(
        <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
            <div style={{display: 'flex', justifyContent: "space-between", alignItems: 'center'}}>
                <div>
                    <h1 style={{fontSize: '1.875rem'}}>Warehouse Dashboard</h1>
                    <p style={{color: 'var(--text-muted)'}}>Welcome Back! Here's whats's happening today.</p>
                </div>
                <div style={{display: 'flex', gap: '0.75rem'}}>
                    <Button variant='secondary' onClick={refetch} loading={loading}>
                        <RefreshCw size={16} />
                        Refresh
                    </Button>
                    <Button onClick={()=>navigate('/place-order')}>
                        <Plus size={16} />
                        Place new order
                    </Button>
                </div>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem'}}>
                <StatCard title="Total Orders" value={stats?.total || 0} icon={<ShoppingBag size={24} />} color='#6366f1' />
                <StatCard title="Pending Orders" value={stats?.pending || 0} icon={<Clock size={24} />} color='#3b82f6' />
                <StatCard title="Completed Orders" value={stats?.completed || 0} icon={<CheckCircle size={24} />} color='#10b981' />
                <StatCard title="Cancelled Orders" value={stats?.cancelled || 0} icon={<XCircle size={24} />} color='#ef4444' />
            </div>
            <div className='card'>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                    <h2 style={{fontSize: '1.25rem'}}>Recent Orders</h2>
                    <Button variant='ghost' onClick={()=>navigate('/orders')}>
                        View All Orders
                        <ArrowRight size={16} style={{marginLeft: '0.5rem'}} />
                    </Button>
                </div>
                {recentOrders.length > 0 ? (
                    <div style={{overflowX: 'auto'}}>
                        <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Order Id</th>
                                    <th style={thStyle}>Customer Name</th>
                                    <th style={thStyle}>Order Date</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={thStyle}>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order)=>(
                                    <tr key={order.order_id} style={{borderBottom: '1px solid #f1f5f9'}}>
                                        <td style={{padding: '1rem', fontWeight: 500}}>#{order.order_id}</td>
                                        <td style={{padding: '1rem'}}>{order.customer_name}</td>
                                        <td style={{padding: '1rem', color: 'var(--text-muted)'}}>{formatDate(order.order_date)}</td>
                                        <td style={{padding: '1rem'}}>
                                            <Badge variant={order.status==='COMPLETED' ? 'success' : order.status==='CANCELLED' ? 'danger' : 'info'}>{order.status}</Badge>
                                        </td>
                                        <td style={{padding: '1rem', textAlign: 'right', fontWeight: 600}}>{formatCurrency(order.total_amount || 0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>
                        <ShoppingBag size={48} style={{opacity: 0.2, marginBottom: '1rem'}} />
                        <p>No orders found. Click "Place new order" to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;