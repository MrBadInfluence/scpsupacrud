import React from 'react';
import { Link, Outlet } from 'react-router-dom';

/**
 * Admin shell. In a real app you'd gate this behind auth.
 * For now, rely on RLS to block writes unless the user is authenticated.
 */
export default function AdminLayout() {
  return (
    <div>
      <h2 style={{marginTop:0}}>Admin</h2>
      <nav className="nav" style={{marginBottom:12}}>
        <Link className="btn" to="/admin">All Files</Link>
        <Link className="btn" to="/admin/new">Add New</Link>
      </nav>
      <Outlet />
    </div>
  );
}