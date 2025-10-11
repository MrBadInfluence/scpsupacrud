import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

/**
 * Home page: simple grid list of SCPs (id + title + object class).
 * Users can click through to see the full record.
 */
export default function PublicList() {
  const [rows, setRows] = useState([]);

  // Helper function to get badge color based on Object Class
  const getBadgeStyle = (objectClass) => {
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '0.85em',
      fontWeight: '600',
      display: 'inline-block'
    };

    switch(objectClass?.toLowerCase()) {
      case 'safe':
        return { ...baseStyle, 
          backgroundColor: 'rgba(34, 197, 94, 0.15 )',
          color: '#22c55e',
          borderColor: '#22c55e'
        };
      case 'euclid':
        return { ...baseStyle, 
          backgroundColor: 'rgba(251, 191, 36, 0.15 )',
          color: '#fbbf24',
          borderColor: '#fbbf24'
        };
      case 'keter':
        return { ...baseStyle, 
          backgroundColor: 'rgba(239, 68, 68, 0.15)', 
          color: '#ef4444',
          borderColor: '#ef4444'
        };
      default:
        return { ...baseStyle, backgroundColor: '#6b7280', color: 'white' };
    }
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('SCPsupaCRUD')
        .select('id, Title, Object_Class, Image')
        .order('id', { ascending: true });
      if (!error) setRows(data ?? []);
    })();
  }, []);

  return (
    <div>
      <h2 style={{marginTop:0}}>Browse SCPs</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {rows.map(r => (
          <Link 
            key={r.id} 
            className="card link" 
            to={`/scp/${r.id}`} 
            style={{ display: 'block', textDecoration: 'none' }}
          >
            {r.Image && (
              <img 
                src={r.Image} 
                alt={r.Title} 
                style={{ width:'100%', borderRadius:12, marginBottom:10 }} 
              />
            )}
            <div style={{ fontWeight:700, fontSize: '1.1em', marginBottom: 4 }}>SCP-{r.id}</div>
            <div style={{ fontSize: '0.95em', marginBottom: 6, color: '#666' }}>{r.Title}</div>
            <span style={getBadgeStyle(r.Object_Class)}>{r.Object_Class || '—'}</span>
          </Link>
        ))}
        {rows.length === 0 && (
          <p className="label">No SCPs yet.</p>
        )}
      </div>
    </div>
  );
}