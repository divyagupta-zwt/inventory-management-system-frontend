import { useCallback, useEffect, useState } from "react";
import orderService from '../services/orderService';

export const useOrders=()=>{
    const [data, setData]= useState([]);
    const [loading, setLoading]= useState(true);
    const [error, setError]= useState(null);

    const fetchOrders= useCallback(async()=>{
        try{
            setLoading(true);
            setError(null);
            const orders= await orderService.getAllOrders();
            setData(orders);
        }catch(error){
            setError(error.message || 'Failed to fetch orders');
        }finally{
            setLoading(false);
        }
    },[]);

    useEffect(()=>{
        fetchOrders();
    },[fetchOrders]);

    return {data, error, loading, refetch: fetchOrders};
};