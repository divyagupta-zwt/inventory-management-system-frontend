import Card from '../common/Card';

const StatCard=({title, value, icon, color= 'var(--primary)', trend})=>{
    return(
       <Card>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div>
                    <p style={{color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem'}}>
                        {title}
                    </p>
                    <h3 style={{fontSize: '1.75rem', marginBottom: '0.25rem'}}>{value}</h3>
                    {trend && (
                        <p style={{fontSize: '0.75rem',
                            color: trend.startsWith('+') ? 'var(--success)' : 'var(--danger)',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'}}>
                            {trend} <span style={{color: 'var(--text-muted)', fontWeight: 400}}>vs last month</span>
                        </p>
                    )}
                </div>
                <div style={{backgroundColor: `${color}15`, color: color, padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {icon}
                </div>
            </div>
       </Card>
    );
};

export default StatCard;