// src/components/NavMenu.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function NavMenu() {
  const [items, setItems] = useState([]);
  const { pathname } = useLocation();

  // load all SCPs
  const load = async () => {
    const { data, error } = await supabase
      .from('SCPsupaCRUD')
      .select('id, Title')
      .order('id', { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    // guard against null/empty titles
    setItems((data ?? []).filter(r => r.Title && r.Title.trim().length));
  };

  useEffect(() => {
    load();

    // subscribe to changes so the menu stays in sync
    const channel = supabase
      .channel('scp-menu')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'SCPsupaCRUD' },
        () => load()
      )
      .subscribe();

    // cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>SCPs</h3>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          maxHeight: '70vh',
          overflow: 'auto',
          paddingRight: 4
        }}
      >
        {items.map(scp => (
          <li key={scp.id} style={{ marginBottom: 8 }}>
            <Link
              className="link"
              to={`/scp/${scp.id}`}
              aria-current={pathname === `/scp/${scp.id}` ? 'page' : undefined}
            >
              SCP-{scp.id}: {scp.Title}
            </Link>
          </li>
        ))}
        {items.length === 0 && <li className="label">No SCPs yet.</li>}
      </ul>
    </div>
  );
}