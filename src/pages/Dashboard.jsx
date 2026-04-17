import React, { useState } from 'react';
import { auth } from '../firebase';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getHeaders = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const token = await user.getIdToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchContent = async () => {
    setLoading(true);
    try {
      const headers = await getHeaders();
      const response = await fetch('/api/admin/content', { method: 'GET', headers });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="space-x-4 mb-6">
        <button 
          onClick={fetchContent}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Fetch Content
        </button>
        <input 
          type="file" 
          onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0])}
          className="border p-2"
        />
      </div>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {loading ? 'Loading...' : JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default Dashboard;
