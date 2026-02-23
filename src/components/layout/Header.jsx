import { Package, Bell, Search } from 'lucide-react';

const Header = () => {
    return (
        <header style={{
            height: '64px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        backgroundColor: 'var(--primary)',
                        color: '#fff',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Package size={24} />
                    </div>
                    <h1 style={{ fontSize: '1.25rem', letterSpacing: '-0.025em' }}>LogiTrack</h1>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Search size={18} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            style={{
                                padding: '0.5rem 1rem 0.5rem 2.5rem',
                                borderRadius: '9999px',
                                border: '1px solid var(--border)',
                                backgroundColor: '#f8fafc',
                                fontSize: '0.875rem',
                                width: '240px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--text-muted)', position: 'relative' }}>
                        <Bell size={20} />
                        <span style={{
                            position: 'absolute',
                            top: '-2px',
                            right: '-2px',
                            width: '8px',
                            height: '8px',
                            backgroundColor: 'var(--danger)',
                            borderRadius: '50%',
                            border: '2px solid #fff'
                        }}></span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem' }}>
                        <div style={{ textAlign: 'right', display: 'none' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>Admin User</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Warehouse Manager</p>
                        </div>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '600',
                            color: 'var(--text-muted)'
                        }}>
                            AU
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
