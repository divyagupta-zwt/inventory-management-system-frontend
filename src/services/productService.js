import api from './api';

const productService= {
    getAllProducts: ()=>api.get('/products'),
    getProductById: (id)=>api.get(`/products/${id}`),
};

export default productService;