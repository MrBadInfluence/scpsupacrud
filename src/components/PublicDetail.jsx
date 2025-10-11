import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

/**
 * Full SCP record view. Mobile-friendly, image on top, text below.
 */
export default function PublicDetail() {
  const { id } = useParams();
  const [row, setRow] = useState(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('SCPsupaCRUD')
        .select('*')
        .eq('id', id)
        .single();
      if (!error) setRow(data);
    })();
  }, [id]);

  if (!row) return <p>Loading…</p>;

  return (
    <article>
      {row.Image && (
        <img 
          src={row.Image} 
          alt={row.Title} 
          style={{ width: '100%', borderRadius: 14, marginBottom: 12 }} 
        />
      )}
      <h2 style={{marginTop:0}}>SCP-{row.id}</h2>
      <h3>{row.Title}</h3>
      {row.Object_Class && <p className="badge">Object Class: {row.Object_Class}</p>}
      
      {row.Special_Containment && (
        <div style={{ marginBottom: 16 }}>
          <h4>Special Containment Procedures:</h4>
          <p style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{row.Special_Containment}</p>
        </div>
      )}
      
      {row.Description && (
        <div style={{ marginBottom: 16 }}>
          <h4>Description:</h4>
          <p style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{row.Description}</p>
        </div>
      )}
      
      {row.Additional_Info && (
        <div style={{ marginBottom: 16 }}>
          <h4>Additional Information:</h4>
          <p style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{row.Additional_Info}</p>
        </div>
      )}
    </article>
  );
}