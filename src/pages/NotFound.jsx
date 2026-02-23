import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '8rem', fontWeight: '900', color: 'var(--primary)',opacity: 0.6, lineHeight: '1' }}>404</h1>
            </div>

            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', marginBottom: '2rem', fontSize: '1.125rem' }}>
                The page you're looking for doesn't exist or has been moved.
                Don't worry, even the best trackers lose their way sometimes!
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <Button onClick={() => navigate('/')}>
                    <Home size={18} />
                    Go to Dashboard
                </Button>
                <Button variant="secondary" onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
