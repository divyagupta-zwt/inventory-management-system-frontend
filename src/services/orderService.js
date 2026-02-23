import api from './api';

const orderService= {
    getAllOrders: ()=>api.get('/orders'),
    getOrderById: (id)=>api.get(`/orders/${id}`),
    placeOrder: (orderData)=>api.post('/orders', orderData),
    cancelOrder: (orderId)=>api.put(`/orders/${orderId}/cancel`),
};

export default orderService;