import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ShoppingCart, User, ClipboardCheck, ArrowRight, ArrowLeft, Package, Trash2, AlertTriangle, CheckCircle2, Warehouse } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useWarehouses } from '../hooks/useWarehouses';
import productService from '../services/productService';
import warehouseService from '../services/warehouseService';
import orderService from '../services/orderService';
import { validateCustomerName, validateQuantity } from '../utils/validators';
import { formatCurrency, calculateTotal } from '../utils/formatters';

const PlaceOrder = () => {
    const navigate = useNavigate();
    const { data: warehouses, loading: loadingWarehouses } = useWarehouses();

    // Step 1 State
    const [currentStep, setCurrentStep] = useState(1);
    const [customerName, setCustomerName] = useState('');
    const [warehouseId, setWarehouseId] = useState('');
    const [touched, setTouched] = useState({});

    // Step 2 State
    const [products, setProducts] = useState([]);
    const [stockData, setStockData] = useState({});
    const [cartItems, setCartItems] = useState([]); // { product_id, name, price, quantity, sku }
    const [loadingStep2, setLoadingStep2] = useState(false);
    const [productQuantities, setProductQuantities] = useState({});

    // Step 3 & UI State
    const [submitting, setSubmitting] = useState(false);
    const [orderError, setOrderError] = useState(null);
    const [successOrder, setSuccessOrder] = useState(null);

    // Derived
    const selectedWarehouse = useMemo(() =>
        warehouses.find(w => w.warehouse_id === parseInt(warehouseId)),
        [warehouses, warehouseId]);

    const cartTotal = useMemo(() => calculateTotal(cartItems), [cartItems]);

    const validationErrors = {
        customerName: validateCustomerName(customerName),
        warehouseId: !warehouseId ? 'Please select a warehouse' : null,
        cart: cartItems.length === 0 ? 'Please add at least one product' : null
    };

    // Fetch products and stock for Step 2
    useEffect(() => {
        if (currentStep === 2 && warehouseId) {
            const loadStep2Data = async () => {
                try {
                    setLoadingStep2(true);
                    const [productsList, stockList] = await Promise.all([
                        productService.getAllProducts(),
                        warehouseService.getWarehouseStock(warehouseId)
                    ]);
                    console.log("Products:", productsList);
console.log("Stock list:", stockList);
                    setProducts(productsList);

                    // Convert stock list to map for easy lookup
                    const stockMap = {};
                    (stockList || []).forEach(item => {
  stockMap[item.product_id] = Number(item.available_quantity) || 0;
});
                    setStockData(stockMap);
                } catch (err) {
                    setOrderError('Failed to load products and stock information.', err);
                } finally {
                    setLoadingStep2(false);
                }
            };
            loadStep2Data();
        }
    }, [currentStep, warehouseId]);

    const handleNextStep = () => {
        if (currentStep === 1) {
            setTouched({ customerName: true, warehouseId: true });
            if (!validationErrors.customerName && !validationErrors.warehouseId) {
                setCurrentStep(2);
            }
        } else if (currentStep === 2) {
            if (cartItems.length > 0) {
                setCurrentStep(3);
            }
        }
    };

    const addToCart = (product, quantity) => {
        const qty = parseInt(quantity);
        const existing = cartItems.find(item => item.product_id === product.product_id);

        if (existing) {
            setCartItems(cartItems.map(item =>
                item.product_id === product.product_id
                    ? { ...item, quantity: qty }
                    : item
            ));
        } else {
            setCartItems([...cartItems, {
                product_id: product.product_id,
                name: product.product_name,
                sku: product.sku,
                price: product.price,
                quantity: qty
            }]);
        }
    };

    const removeFromCart = (productId) => {
        setCartItems(cartItems.filter(item => item.product_id !== productId));
    };

    const handlePlaceOrder = async () => {
        try {
            setSubmitting(true);
            setOrderError(null);

            const orderData = {
                customer_name: customerName,
                warehouse_id: parseInt(warehouseId),
                items: cartItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity
                }))
            };

            const result = await orderService.placeOrder(orderData);
            setSuccessOrder(result); // Assuming result has order_id
            setCurrentStep(4); // Success step
        } catch (err) {
            const msg = err.message || 'Failed to place order';
            setOrderError(msg);

            // Handle specific backend validation errors
            if (msg.toLowerCase().includes('stock')) {
                setCurrentStep(2); // Go back to fix stock
            } else if (msg.toLowerCase().includes('warehouse')) {
                setCurrentStep(1);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const renderStepIndicator = () => {
        const steps = [
            { id: 1, label: 'Customer Info', icon: <User size={16} /> },
            { id: 2, label: 'Select Products', icon: <ShoppingCart size={16} /> },
            { id: 3, label: 'Review & Confirm', icon: <ClipboardCheck size={16} /> }
        ];

        if (currentStep === 4) return null;

        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: currentStep === step.id ? 'var(--primary)' :
                                    currentStep > step.id ? 'var(--success)' : '#e2e8f0',
                                color: currentStep >= step.id ? '#fff' : 'var(--text-muted)',
                                boxShadow: currentStep === step.id ? '0 0 0 4px #eef2ff' : 'none',
                                transition: 'all 0.3s ease',
                                zIndex: 2
                            }}>
                                {currentStep > step.id ? <Check size={20} /> : step.icon}
                            </div>
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: currentStep === step.id ? '700' : '500',
                                color: currentStep === step.id ? 'var(--text-main)' : 'var(--text-muted)',
                                position: 'absolute',
                                top: '48px',
                                whiteSpace: 'nowrap'
                            }}>
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div style={{
                                width: '100px',
                                height: '2px',
                                backgroundColor: currentStep > step.id ? 'var(--success)' : '#e2e8f0',
                                transition: 'all 0.3s ease',
                                margin: '0 -0.5rem'
                            }} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const renderStep1 = () => (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Card title="Customer & Warehouse Selection">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            Customer Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter customer name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            onBlur={() => setTouched({ ...touched, customerName: true })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: `1px solid ${touched.customerName && validationErrors.customerName ? 'var(--danger)' : 'var(--border)'}`,
                                outline: 'none'
                            }}
                        />
                        {touched.customerName && validationErrors.customerName && (
                            <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{validationErrors.customerName}</p>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            Select Warehouse
                        </label>
                        <select
                            value={warehouseId}
                            onChange={(e) => setWarehouseId(e.target.value)}
                            onBlur={() => setTouched({ ...touched, warehouseId: true })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: `1px solid ${touched.warehouseId && validationErrors.warehouseId ? 'var(--danger)' : 'var(--border)'}`,
                                outline: 'none',
                                backgroundColor: '#fff'
                            }}
                        >
                            <option value="">-- Choose a warehouse --</option>
                            {warehouses.map(w => (
                                <option key={w.warehouse_id} value={w.warehouse_id}>
                                    {w.warehouse_name} - {w.location}
                                </option>
                            ))}
                        </select>
                        {touched.warehouseId && validationErrors.warehouseId && (
                            <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{validationErrors.warehouseId}</p>
                        )}
                        {loadingWarehouses && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Loading warehouses...</p>}
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleNextStep} disabled={!!validationErrors.customerName || !!validationErrors.warehouseId}>
                            Next: Select Products
                            <ArrowRight size={16} />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderStep2 = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <Warehouse size={16} />
                    <span>Ordering from: <strong>{selectedWarehouse?.warehouse_name}</strong></span>
                </div>

                {loadingStep2 ? <LoadingSpinner /> : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {products.map(product => {
                            const stock = stockData[product.product_id] || 0;
                            const cartItem = cartItems.find(item => item.product_id === product.product_id);
                            const qty = productQuantities[product.product_id] ?? cartItem?.quantity ?? 1;

                            const error = validateQuantity(qty, stock);

                            return (
                                <Card key={product.product_id} className="product-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1rem' }}>{product.product_name}</h4>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {product.sku}</p>
                                        </div>
                                        <p style={{ fontWeight: '700', color: 'var(--primary)' }}>{formatCurrency(product.price)}</p>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>Available Stock:</span>
                                            <span style={{ fontWeight: '600', color: stock > 0 ? 'var(--success)' : 'var(--danger)' }}>{stock} units</span>
                                        </div>
                                    </div>

                                    {stock > 0 ? (
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Quantity</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={stock}
                                                    value={qty}
                                                    onChange={(e) => setProductQuantities({ ...productQuantities, [product.product_id]: Number(e.target.value) })}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem',
                                                        borderRadius: 'var(--radius-sm)',
                                                        border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
                                                        outline: 'none'
                                                    }}
                                                />
                                            </div>
                                            <Button
                                                variant={cartItem ? 'secondary' : 'primary'}
                                                style={{ padding: '0.5rem 1rem' }}
                                                disabled={!!error}
                                                onClick={() => addToCart(product, qty)}
                                            >
                                                {cartItem ? 'Update' : 'Add'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button disabled style={{ width: '100%', backgroundColor: '#f1f5f9', color: '#94a3b8' }}>Out of Stock</Button>
                                    )}
                                    {error && qty !== '' && <p style={{ color: 'var(--danger)', fontSize: '0.7rem', marginTop: '0.25rem' }}>{error}</p>}
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Cart Summary Sidebar */}
            <div style={{ position: 'sticky', top: '150px', height: 'fit-content' }}>
                <Card title={`Order Summary (${cartItems.length} items)`}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                            {cartItems.length > 0 ? (
                                cartItems.map(item => (
                                    <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9', gap: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '0.925rem', fontWeight: '600' }}>{item.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.quantity} x {formatCurrency(item.price)}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{formatCurrency(item.quantity * item.price)}</p>
                                            <button
                                                onClick={() => removeFromCart(item.product_id)}
                                                style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                                    <Package size={32} style={{ opacity: 0.2, margin: '0 auto 0.5rem' }} />
                                    <p style={{ fontSize: '0.875rem' }}>Your cart is empty</p>
                                </div>
                            )}
                        </div>

                        <div style={{ borderTop: '2px dashed var(--border)', paddingTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ fontWeight: '600' }}>Total Amount</span>
                                <span style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary)' }}>{formatCurrency(cartTotal)}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <Button
                                    style={{ width: '100%' }}
                                    onClick={handleNextStep}
                                    disabled={cartItems.length === 0}
                                >
                                    Next: Review Order
                                    <ArrowRight size={16} />
                                </Button>
                                <Button variant="ghost" style={{ width: '100%' }} onClick={() => setCurrentStep(1)}>
                                    <ArrowLeft size={16} />
                                    Back to Customer
                                </Button>
                            </div>
                            {validationErrors.cart && cartItems.length === 0 && (
                                <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center' }}>
                                    {validationErrors.cart}
                                </p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orderError && <ErrorMessage message={orderError} title="Order Submission Failed" />}

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem' }}>
                <Card title="Order Review">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Customer</p>
                                <p style={{ fontWeight: '600' }}>{customerName}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Warehouse</p>
                                <p style={{ fontWeight: '600' }}>{selectedWarehouse?.warehouse_name}</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{selectedWarehouse?.location}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Order Date</p>
                                <p style={{ fontWeight: '600' }}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Order Items</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {cartItems.map((item, index) => (
                                    <div key={item.product_id} style={{
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: '#f8fafc',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginRight: '0.5rem' }}>{index + 1}.</span>
                                            <span style={{ fontWeight: '600' }}>{item.name}</span>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                                Qty: {item.quantity} × {formatCurrency(item.price)}
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: '700' }}>{formatCurrency(item.quantity * item.price)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card>
                        <div style={{ textAlign: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{formatCurrency(cartTotal)}</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Grand Total</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Button
                                style={{ width: '100%', height: '50px', fontSize: '1rem' }}
                                onClick={handlePlaceOrder}
                                loading={submitting}
                            >
                                Confirm & Place Order
                            </Button>
                            <Button variant="ghost" style={{ width: '100%' }} onClick={() => setCurrentStep(2)} disabled={submitting}>
                                <ArrowLeft size={16} />
                                Back to Products
                            </Button>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#fff7ed', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.75rem' }}>
                            <AlertTriangle size={20} color="#ea580c" style={{ flexShrink: 0 }} />
                            <p style={{ fontSize: '0.75rem', color: '#9a3412', lineHeight: '1.4' }}>
                                Please review all items and customer information. Once placed, the order will be processed immediately.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );

    const renderSuccess = () => (
        <div style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center' }}>
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
            }}>
                <CheckCircle2 size={48} />
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Order Placed!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Successfully created <strong>Order #{successOrder?.order_id || 'N/A'}</strong> for {customerName}.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Button onClick={() => navigate('/orders')}>
                    View All Orders
                </Button>
                <Button variant="secondary" onClick={() => {
                    setCustomerName('');
                    setWarehouseId('');
                    setCartItems([]);
                    setCurrentStep(1);
                    setSuccessOrder(null);
                    setTouched({});
                }}>
                    Place Another Order
                </Button>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '4rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Place New Order</h1>
                <p style={{ color: 'var(--text-muted)' }}>Follow the steps below to fulfill a customer request.</p>
            </div>

            {renderStepIndicator()}

            <div style={{ marginTop: '1.5rem' }}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderSuccess()}
            </div>
        </div>
    );
};

export default PlaceOrder;