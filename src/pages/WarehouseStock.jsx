/* eslint-disable react-hooks/exhaustive-deps */
import { AlertTriangle, Package, RefreshCw, Search, WarehouseIcon, XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {useWarehouses} from "../hooks/useWarehouses";
import { useEffect, useMemo, useState } from "react";
import warehouseService from "../services/warehouseService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatCurrency } from "../utils/formatters";
import Badge from "../components/common/Badge";

const WarehouseStock = () => {
  const { id: warehouseId } = useParams();
  const navigate = useNavigate();
  const { data: warehouses, loading: loadingWarehouses } = useWarehouses();

  const [stock, setStock] = useState([]);
  const [loadingStock, setLoadingStock] = useState(true);
  const [stockError, setStockError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const currentWarehouse = useMemo(
    () => warehouses.find((w) => w.warehouse_id === parseInt(warehouseId)),
    [warehouses, warehouseId]
  );

  const fetchStock=async()=>{
    try{
        setLoadingStock(true);
        setStockError(null);
        const data= await warehouseService.getWarehouseStock(warehouseId);
        setStock(data);
        setLastUpdated(new Date());
    }catch(error){
        setStockError(error.message || 'Failed to fetch warehouse stock');
    }finally{
        setLoadingStock(false);
    }
  };

  useEffect(()=>{
    if(warehouseId){
        fetchStock();
    }
  },[warehouseId]);

  const filteredStock=useMemo(()=>{
    return stock.filter(item=>item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku.toLowerCase().includes(searchTerm.toLowerCase()));
  },[stock, searchTerm]);

  const stats= useMemo(()=>{
    return {
        totalProducts: stock.length,
        totalUnits: stock.reduce((sum, item)=> sum + item.available_quantity, 0),
        lowStock: stock.filter(item=> item.available_quantity >0 && item.available_quantity <= 20).length,
        outOfStock: stock.filter(item=> item.available_quantity===0).length
    }
  },[stock]);

  const getStockStatus=(quantity)=>{
    if(quantity===0) return {label: 'Out of Stock', variant: 'danger'};
    if(quantity<=20) return {label: 'Low Stock', variant: 'warning'};
    return {label: 'In Stock', variant: 'success'};
  };

  if(loadingWarehouses) return <LoadingSpinner fullPage />

  const thStyle= { padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.875rem' };
  const statCardStyle= { padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
              <WarehouseIcon size={24} />
            </div>
            <h1 style={{ fontSize: '1.875rem' }}>Stock Inventory</h1>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            <strong>{currentWarehouse?.warehouse_name}</strong> &bull; {currentWarehouse?.location}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}><strong>Last Updated: </strong>{lastUpdated.toLocaleString()}</p>
            </div>
            <select value={warehouseId} onChange={(e)=>navigate(`/warehouse/${e.target.value}/stock`)} style={{
                            padding: '0.625rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            backgroundColor: '#fff',
                            outline: 'none',
                            fontWeight: '500'
                        }}>
                {warehouses.map((w)=>(
                    <option key={w.warehouse_id} value={w.warehouse_id}>{w.warehouse_name}</option>
                ))}
            </select>
            <button onClick={fetchStock} disabled={loadingStock} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.625rem 1.25rem',
                            backgroundColor: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}>
                <RefreshCw size={16} className={loadingStock ? 'animate-spin' : ''} />
                {loadingStock ? 'Refreshing...' : 'Refresh'}
            </button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card" style={statCardStyle}>
            <div style={{ padding: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: 'var(--radius-md)' }}>
                <Package size={20} color="var(--primary)" />
            </div>
            <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL PRODUCTS</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>{stats.totalProducts}</p>
            </div>
        </div>
        <div className="card" style={statCardStyle}>
            <div style={{ padding: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: 'var(--radius-md)' }}>
                <Package size={20} color="var(--info)" />
            </div>
            <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL UNITS</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>{stats.totalUnits}</p>
            </div>
        </div>
        <div className="card" style={statCardStyle}>
            <div style={{ padding: '0.75rem', backgroundColor: '#fffbeb', borderRadius: 'var(--radius-md)' }}>
                <AlertTriangle size={20} color="var(--warning)" />
            </div>
            <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>LOW STOCK</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--warning)' }}>{stats.lowStock}</p>
            </div>
        </div>
        <div className="card" style={statCardStyle}>
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: 'var(--radius-md)' }}>
                <XCircle size={20} color="var(--danger)" />
            </div>
            <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>OUT OF STOCK</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--danger)' }}>{stats.outOfStock}</p>
            </div>
        </div>
      </div>
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search by product name or SKU..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} style={{
                            width: '100%',
                            padding: '0.625rem 1rem 0.625rem 2.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            outline: 'none'
                        }} />
        </div>
        {loadingStock ? <LoadingSpinner /> : stockError ? <ErrorMessage message={stockError} onRetry={fetchStock} /> : (
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={thStyle}>Product Name</th>
                            <th style={thStyle}>SKU</th>
                            <th style={thStyle}>Quantity</th>
                            <th style={thStyle}>Price</th>
                            <th style={thStyle}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStock.length > 0 ? filteredStock.map((item)=>{
                            const status= getStockStatus(item.available_quantity);
                            return(
                                <tr key={item.product_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '1rem', fontWeight: '600' }}>{item.product_name}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{item.sku}</td>
                                    <td style={{padding: '1rem', textAlign: 'center'}}>
                                        <span style={{
                                                    fontWeight: '700',
                                                    fontSize: '1rem',
                                                    color: item.available_quantity === 0 ? 'var(--danger)' : 'inherit'
                                                }}>
                                                    {item.available_quantity}
                                                </span>
                                    </td>
                                    <td style={{padding: '1rem'}}>{formatCurrency(item.price)}</td>
                                    <td style={{padding: '1rem'}}>
                                        <Badge variant={status.variant}>{status.label}</Badge>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="5" style={{padding: '3rem', color: 'var(--text-muted)', textAlign: 'center'}}>No matching products found in this warehouse</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </div>
      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default WarehouseStock;
