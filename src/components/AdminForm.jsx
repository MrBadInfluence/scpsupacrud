import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Create/Update form with image upload to Storage.
 * - If editing, we load the row.
 * - For uploads we create a unique path and then set the `image` column to the public URL.
 * - You must be AUTHENTICATED for writes because of RLS write policies.
 *   In Supabase Dashboard → Auth, create a test user and sign in programmatically if needed.
 */
export default function AdminForm() {
  const { id } = useParams();              // if undefined → create
  const nav = useNavigate();

  // Form state
  const [scpId, setScpId] = useState('');
  const [objectClass, setObjectClass] = useState('');
  const [title, setTitle] = useState('');
  const [specialContainment, setSpecialContainment] = useState('');
  const [description, setDescription] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [imageUrl, setImageUrl] = useState('');   // stored public URL
  const [file, setFile] = useState(null);         // selected File object
  const [saving, setSaving] = useState(false);

  // Load record on edit
  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase.from('SCPsupaCRUD').select('*').eq('id', id).single();
      if (!error && data) {
        setScpId(data.id ?? '');
        setObjectClass(data.Object_Class ?? '');
        setTitle(data.Title ?? '');
        setSpecialContainment(data.Special_Containment ?? '');
        setDescription(data.Description ?? '');
        setAdditionalInfo(data.Additional_Info ?? '');
        setImageUrl(data.Image ?? '');
      }
    })();
  }, [id]);

  // Upload file to Storage and return public URL
  const uploadImage = async (file) => {
    // Create a unique path to avoid collisions
    const ext = file.name.split('.').pop();
    const path = `scp-${crypto.randomUUID()}.${ext}`;

    // Upload to the bucket
    const { error: upErr } = await supabase.storage.from('scp-images').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (upErr) throw upErr;

    // Build a public URL (bucket must be public)
    const { data } = supabase.storage.from('scp-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // If user selected a file, upload it and set imageUrl
      let finalImageUrl = imageUrl;
      if (file) finalImageUrl = await uploadImage(file);

      const payload = {
        id: scpId,
        Object_Class: objectClass,
        Title: title,
        Special_Containment: specialContainment,
        Description: description,
        Additional_Info: additionalInfo,
        Image: finalImageUrl
      };

      if (id) {
        // UPDATE
        const { error } = await supabase.from('SCPsupaCRUD').update(payload).eq('id', id);
        if (error) throw error;
      } else {
        // CREATE
        const { error } = await supabase.from('SCPsupaCRUD').insert(payload);
        if (error) throw error;
      }

      nav('/admin');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid" style={{maxWidth: 720}}>
      <div>
        <label className="label">id</label>
        <input className="input" value={scpId} onChange={e=>setScpId(e.target.value)} required />
      </div>

      <div>
        <label className="label">Object Class</label>
        <input className="input" value={objectClass} onChange={e=>setObjectClass(e.target.value)} />
      </div>

      <div>
        <label className="label">Title</label>
        <textarea className="input" value={title} onChange={e=>setTitle(e.target.value)} />
      </div>

      <div>
        <label className="label">Special Containment</label>
        <textarea className="input" value={specialContainment} onChange={e=>setSpecialContainment(e.target.value)} />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea className="input" value={description} onChange={e=>setDescription(e.target.value)} />
      </div>

      <div>
        <label className="label">Additional Information</label>
        <textarea className="input" value={additionalInfo} onChange={e=>setAdditionalInfo(e.target.value)} />
      </div>

      <div>
        <label className="label">Image</label>
        <input className="file" type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
        {imageUrl && (
          <div style={{marginTop:10}}>
            <span className="label">Current image:</span>
            <img src={imageUrl} alt="current" style={{maxWidth: 240, borderRadius: 10, display:'block'}} />
          </div>
        )}
      </div>

      <div style={{display:'flex', gap:10}}>
        <button className="btn" disabled={saving} type="submit">{id ? 'Update' : 'Create'}</button>
        <button className="btn" type="button" onClick={() => nav('/admin')}>Cancel</button>
      </div>

      <p className="label">
        Tip: To enable writes, sign in (e.g., with supabase.auth.signInWithPassword) and refresh.
        You can also test from the SQL Editor using INSERT/UPDATE.
      </p>
    </form>
  );
}