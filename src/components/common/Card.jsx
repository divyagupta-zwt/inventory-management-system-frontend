const Card=({children, className='', title, footer})=>{
    return(
        <div className={`card ${className}`}>
            {title && (
                <div>
                    {title}
                </div>
            )}
            <div>
                {children}
            </div>
            {footer && (
                <div>
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;