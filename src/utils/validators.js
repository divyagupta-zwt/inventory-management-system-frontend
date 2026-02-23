export const validateCustomerName=(name)=>{
    if(!name) return "Customer name is required";
    if(name.length < 3) return "Must be at least 3 characters";
    if(name.length > 100) return "Must be less than 100 characters";
    if(!/^[a-zA-Z\s]+$/.test(name)) return "Only letters and spaces allowed";
    return null;
};

export const validateQuantity=(quantity, maxStock)=>{
    const qty= parseInt(quantity);
    if(isNaN(qty) || qty <= 0) return "Quantity must be at least 1";
    if(qty > maxStock) return "Quantity exceeds maximum stock";
    return null;
};

export const validateEmail=(email)=>{
    const regex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email) return "Email is required";
    if(!regex.test(email)) return "Invalid email format";
    return null;
};

export const isFormValid=(errors)=>{
    return Object.values(errors).every(error=>error===null);
};