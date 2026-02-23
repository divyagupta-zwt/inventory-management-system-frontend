import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "./Button";

const ErrorMessage=({message, onRetry, title= 'Something went wrong'})=>{
    return(
        <div style={{
            padding: '2rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fee2e2',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            margin: '1rem 0', 
        }}>
            <AlertCircle size={48} color="#ef4444" style={{marginBottom: '1rem'}} />
            <h3 style={{color: '#991b1b', marginBottom: '0.5rem'}}>{title}</h3>
            <p style={{color: '#b91c1c', marginBottom: '1.5rem', opacity: 0.8}}>{message}</p>
            {onRetry && (
                <Button onClick={onRetry} variant="danger" style={{backgroundColor: '#ef4444'}}>
                    <RefreshCw size={16} style={{marginRight: '0.5rem'}}/>
                    Try Again
                </Button>
            )}
        </div>
    );
};

export default ErrorMessage;