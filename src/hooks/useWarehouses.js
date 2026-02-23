import { useCallback, useEffect, useState } from 'react';
import warehouseService from '../services/warehouseService';

export const useWarehouses=()=>{
    const [data, setData]= useState([]);
    const [loading, setLoading]= useState(true);
    const [error, setError]= useState(null);

    const fetchWarehouses= useCallback(async()=>{
        try{
            setLoading(true);
            setError(null);
            const warehouses= await warehouseService.getAllWarehouses();
            setData(warehouses);
        } catch(error){
            setError(error.message || 'Failed to fetch warehouses');
        } finally{
            setLoading(false);
        }
    },[]);

    useEffect(()=>{
        fetchWarehouses();
    },[fetchWarehouses]);

    return {data, error, loading, refetch: fetchWarehouses};
};