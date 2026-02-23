const Button=({children, onClick, variant='primary', type='button', disabled=false, loading=false, className=''})=>{
    const baseStyles= {
        padding: '0.625rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        fontWeight: '600',
        fontSize: '0.875rem',
        border: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.7 : 1,
        transition: 'all 0.2s ease',
    };

    const variants= {
        primary: {
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
        },
        secondary: {
            backgroundColor: '#f1f5f9',
            color: 'var(--text-main)',
            border: '1px solid var(--border)',
        },
        danger: {
            backgroundColor: 'var(--danger)',
            color: '#ffffff',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
        },
    }
    return(
        <button type={type} onClick={onClick} disabled={disabled || loading} style={{...baseStyles, ...variants[variant]}} className={`btn-${variant} ${className}`}>
            {loading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{animation: 'spin 1s linear infinite'}}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
            )}
            {children}
            <style>{`
                @keyframes spin{
                    from {transform: rotate(0deg);}
                    to {transform: rotate(360deg);}
                }
                button:hover:not(:disabled){
                    filter: brightness(0.9);
                    transform: translateY(-1px);
                }
                button:active:not(:disabled){
                    transform: translateY(0);
                }
            `}</style>
        </button>
    );
};

export default Button;