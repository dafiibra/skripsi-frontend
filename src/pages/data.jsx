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
          "https://skripsi-backend-three.vercel.app/api/combined-data"
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
    return (
      <div className="min-h-screen p-4 text-white bg-[#1B4D99] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl">Loading...</p>
        </div>
      </div>
    );
    
  if (error)
    return (
      <div className="min-h-screen p-4 text-white bg-[#1B4D99] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-lg sm:text-xl">Error: {error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#1B4D99] p-2 sm:p-4 lg:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white px-2 sm:px-4">
          Data Ketenagakerjaan
        </h1>
        <p className="text-sm sm:text-base text-blue-200 px-2 sm:px-4 mt-2">
          Menampilkan data pencari kerja dan lowongan kerja berdasarkan provinsi
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <DataTable data={data} />
      </div>
      
      {/* Mobile Summary Stats */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:hidden">
        <div className="bg-white p-3 rounded-lg shadow-md text-center">
          <p className="text-sm text-gray-600">Total Provinsi</p>
          <p className="text-lg font-bold text-blue-600">{data.length}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-md text-center">
          <p className="text-sm text-gray-600">Total Pencari Kerja</p>
          <p className="text-lg font-bold text-green-600">
            {data.reduce((sum, item) => sum + (item['JUMLAH PENCARI KERJA TERDAFTAR'] || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-md text-center">
          <p className="text-sm text-gray-600">Total Lowongan</p>
          <p className="text-lg font-bold text-orange-600">
            {data.reduce((sum, item) => sum + (item['JUMLAH LOWONGAN KERJA TERDAFTAR'] || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-md text-center">
          <p className="text-sm text-gray-600">Rasio</p>
          <p className="text-lg font-bold text-red-600">
            {(data.reduce((sum, item) => sum + (item['JUMLAH PENCARI KERJA TERDAFTAR'] || 0), 0) / 
              data.reduce((sum, item) => sum + (item['JUMLAH LOWONGAN KERJA TERDAFTAR'] || 0), 0)).toFixed(1)}:1
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataPage;