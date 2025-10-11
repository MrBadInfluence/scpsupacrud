import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles.css';
import App from './App.jsx';
import PublicList from './components/PublicList.jsx';
import PublicDetail from './components/PublicDetail.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminList from './components/AdminList.jsx';
import AdminForm from './components/AdminForm.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <PublicList /> },                 // home: list of SCPs
      { path: 'scp/:id', element: <PublicDetail /> },           // public detail view
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminList /> },              // admin list + delete
          { path: 'new', element: <AdminForm /> },              // create
          { path: 'edit/:id', element: <AdminForm /> },         // update
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode><RouterProvider router={router} /></React.StrictMode>
);