import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../common/Badge';
import Modal from '../common/Modal';

const OrderDetailsModal=({isOpen, onClose, order})=>{
    if(!order) return null;

    return(
        <Modal isOpen={isOpen} onClose={onClose} title={`Order Details #${order.order_id}`} maxWidth='700px'>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Customer Info</h4>
                    <p style={{ fontWeight: '600', fontSize: '1.125rem' }}>{order.customer_name}</p>
                </div>
                <div>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Warehouse</h4>
                    <p style={{ fontWeight: '600' }}>{order.warehouse_name || `Warehouse ${order.warehouse_id}`}</p>
                </div>
                <div>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Order Date</h4>
                    <p>{formatDate(order.order_date)}</p>
                </div>
                <div>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Status</h4>
                    <Badge variant={order.status==='COMPLETED' ? 'success' : order.status==='CANCELLED' ? 'danger' : 'info'}>
                        {order.status}
                    </Badge>
                </div>
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>Product</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', textAlign: 'center' }}>Qty</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', textAlign: 'right' }}>Price</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', textAlign: 'right' }}>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(order.items || []).map((item, index)=>(
                            <tr key={index} style={{ borderBottom: index === (order.items?.length - 1) ? 'none' : '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.75rem 1rem' }}>{item.product_name}</td>
                                <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{item.quantity}</td>
                                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>{formatCurrency(item.unit_price)}</td>
                                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 500 }}>{formatCurrency(item.total_price)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr style={{ backgroundColor: '#f8fafc', borderTop: '2px solid var(--border)' }}>
                            <td colSpan="3" style={{ padding: '1rem', textAlign: 'right', fontWeight: '700' }}>Grand Total</td>
                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700', fontSize: '1.125rem', color: 'var(--primary)' }}>{formatCurrency(order.total_amount)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </Modal>
    );
};

export default OrderDetailsModal;