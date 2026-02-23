import { useCallback, useEffect, useState } from 'react';
import productService from '../services/productService';

export const useProducts=()=>{
    const [data, setData]= useState([]);
    const [loading, setLoading]= useState(true);
    const [error, setError]= useState(null);

    const fetchProducts=useCallback(async()=>{
        try {
            setLoading(true);
            setError(null);
            const products= await productService.getAllProducts();
            setData(products);
        } catch (error) {
            setError(error.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    },[]);

    useEffect(()=>{
        fetchProducts();
    },[fetchProducts]);

    return {data, error, loading, refetch: fetchProducts};
};