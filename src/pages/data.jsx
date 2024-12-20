import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "../components/DataTable";

const DataPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://skripsi-backend-three.vercel.app/api/combined-data"
        );
        const jsonData = await response.data.data;
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data: " + error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <div className="min-h-screen p-4 text-white">Loading...</div>;
  if (error)
    return <div className="min-h-screen  p-4 text-white">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-[#1B4D99] p-4">
      <h1 className="text-2xl font-bold mb-4 text-white px-4">
        Data Ketenagakerjaan
      </h1>
      <DataTable data={data} />
    </div>
  );
};

export default DataPage;