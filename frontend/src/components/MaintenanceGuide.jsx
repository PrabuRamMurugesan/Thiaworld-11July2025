
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MaintenanceGuide = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URI}/maintenance`);
        if (Array.isArray(res.data) && res.data.length) {
          setItems(res.data);
        }
      } catch (err) {
        console.warn("Failed to load maintenance guide", err);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-blue-50 rounded-md shadow mt-10">
      <h3 className="text-xl font-bold mb-4 text-blue-800">💎 Jewellery Maintenance Guide</h3>
      <ul className="list-disc pl-6 text-sm text-gray-700 space-y-2">
        {items.length > 0 ? (
          items.map((i) => <li key={i._id}>{i.title}</li>)
        ) : (
          <>
            <li>Clean with mild soap and soft cloth. Avoid harsh chemicals.</li>
            <li>Store separately in a soft pouch or cloth bag to avoid scratches.</li>
            <li>Avoid direct contact with perfumes, lotions, or hairsprays.</li>
            <li>Remove jewellery during workouts, showers, and household chores.</li>
            <li>Inspect clasps and stones regularly. Get professional polishing yearly.</li>
          </>
        )}
      </ul>
    </div>
  );
};

export default MaintenanceGuide;
