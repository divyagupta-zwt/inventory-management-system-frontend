import api from './api';

const warehouseService= {
    getAllWarehouses: ()=>api.get('/warehouse'),
    getWarehouseById: (id)=>api.get(`/warehouse/${id}`),
    getWarehouseStock: (warehouseId)=>api.get(`/warehouse/${warehouseId}/stock`),
};

export default warehouseService;