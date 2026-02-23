const Footer=()=>{
    return(
        <footer style={{padding: '1.5rem 0', borderTop: '1px solid var(--border)', backgroundColor: '#ffffff', marginTop: 'auto'}}>
            <div className="container" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
                <p style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>
                    &copy; {new Date().getFullYear()} LogiTrack. All rights reserved.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>Privacy Policy</a>
                    <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>Terms of Service</a>
                    <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>Help Center</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;