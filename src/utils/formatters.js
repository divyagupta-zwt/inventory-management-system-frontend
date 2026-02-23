import { format } from "date-fns";

export const formatCurrency=(amount)=>{
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const formatDate=(dateString)=>{
    if(!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
};

export const formatDateTime=(dateString)=>{
    if(!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy p');
};

export const calculateTotal=(items)=>{
    return items.reduce((total, item)=>total + (item.price * item.quantity), 0);
};