import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

/**
 * AdminList Component
 * Displays a list of records from the 'SCPsupaCRUD' table, allowing for read and delete operations.
 * Delete functionality is protected by Row-Level Security (RLS) and requires authentication.
 */
export default function AdminList() {
  // State to hold the fetched SCP data (list of rows)
  const [rows, setRows] = useState([]);

  /**
   * Fetches data from the 'SCPsupaCRUD' table in Supabase.
   */
  const load = async () => {
    // Select all columns from the 'SCPsupaCRUD' table, ordered by ID
    const { data } = await supabase
      .from('SCPsupaCRUD')
      .select('id, Object_Class, Title, Special_Containment, Description, Additional_Info, Image')
      .order('id', { ascending: true });
    
    // Update the component state with the fetched data (or an empty array if data is null)
    setRows(data ?? []);
  };

  // useEffect hook to load data when the component mounts.
  // The empty dependency array `[]` ensures this runs only once after the initial render.
  useEffect(() => { load(); }, []);

  /**
   * Handles the deletion of a specific row by its ID.
   * @param {string} id The ID of the record to delete.
   */
  const onDelete = async (id) => {
    // Show a confirmation dialog before proceeding with deletion
    if (!confirm('Delete this record?')) return;
    
    // Perform the delete operation on the 'SCPsupaCRUD' table.
    const { error } = await supabase.from('SCPsupaCRUD').delete().eq('id', id);
    
    // If an error occurs during deletion, alert the user
    if (error) alert(error.message);
    
    // Reload the list to reflect the changes (successful delete or not)
    await load();
  };

  // Render the component UI
  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Object Class</th>
            <th>Title</th>
            <th>Special Containment</th>
            <th>Description</th>
            <th>Additional Info</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Map over the rows state to render a table row for each SCP record */}
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.Object_Class || '—'}</td>
              <td>{r.Title || '—'}</td>
              <td>{r.Special_Containment ? r.Special_Containment.substring(0, 50) + '...' : '—'}</td>
              <td>{r.Description ? r.Description.substring(0, 50) + '...' : '—'}</td>
              <td>{r.Additional_Info ? r.Additional_Info.substring(0, 50) + '...' : '—'}</td>
              {/* Display 'yes' badge if 'Image' is present, otherwise display an em-dash */}
              <td>{r.Image ? <span className="badge">yes</span> : '—'}</td>
              <td>
                {/* Link to the edit page for the specific record */}
                <Link className="link" to={`/admin/edit/${r.id}`}>Edit</Link>
                {' '}
                {/* Button to trigger the onDelete function with the record's ID */}
                <button className="btn" onClick={() => onDelete(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {/* Conditional row display: if no rows are present, show a 'No rows yet' message */}
          {rows.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                No rows yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}