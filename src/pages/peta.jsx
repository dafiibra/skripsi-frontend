import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import BatasProvinsi from "../assets/provinsi.json";
import axios from 'axios';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

const provinceCoordinates = {
  'Aceh': [4.695135, 96.749397],
  'SUMATERA UTARA': [2.1153547, 99.5450974],
  'SUMATERA BARAT': [-0.7399397, 100.8000051],
  'RIAU': [0.2933469, 101.7068294],
  'JAMBI': [-1.6101229, 103.6131203],
  'SUMATERA SELATAN': [-3.3194374, 103.914399],
  'BENGKULU': [-3.5778471, 102.3463875],
  'LAMPUNG': [-4.5585849, 105.4068079],
  'KEPULAUAN BANGKA BELITUNG': [-2.7410513, 106.4405872],
  'KEPULAUAN RIAU': [3.9456514, 108.1428669],
  'DKI JAKARTA': [-6.2087634, 106.845599],
  'JAWA BARAT': [-6.9174639, 107.6191228],
  'JAWA TENGAH': [-7.150975, 110.1402594],
  'DI YOGYAKARTA': [-7.8753849, 110.4262088],
  'JAWA TIMUR': [-7.5360639, 112.2384017],
  'BANTEN': [-6.4058172, 106.0640179],
  'BALI': [-8.4095178, 115.188916],
  'NUSA TENGGARA BARAT': [-8.6529334, 117.3616476],
  'NUSA TENGGARA TIMUR': [-8.6573819, 121.0793705],
  'KALIMANTAN BARAT': [-0.2787808, 111.4752851],
  'KALIMANTAN TENGAH': [-1.6814878, 113.3823545],
  'KALIMANTAN SELATAN': [-3.0926415, 115.2837585],
  'KALIMANTAN TIMUR': [1.6406296, 116.4194239],
  'KALIMANTAN UTARA': [3.0730929, 116.0413889],
  'SULAWESI UTARA': [0.6246932, 123.9750018],
  'SULAWESI TENGAH': [-1.4300254, 121.4456586],
  'SULAWESI SELATAN': [-3.6687994, 119.9740534],
  'SULAWESI TENGGARA': [-4.14491, 122.174605],
  'GORONTALO': [0.6999372, 122.4467238],
  'SULAWESI BARAT': [-2.8441371, 119.2320784],
  'MALUKU': [-3.2384616, 130.1452734],
  'MALUKU UTARA': [1.5709993, 127.8087693],
  'PAPUA': [-4.269928, 138.0803137],
  'PAPUA BARAT': [-1.3361154, 133.1747162]
};

const Map = () => {
  const [selectedFilter, setSelectedFilter] = useState('Total Pencari Kerja');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/combined-data');
        const normalizedData = response.data.map(item => ({
          ...item,
          PROVINSI: item.PROVINSI.toUpperCase()
        }));
        setData(normalizedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const style = (feature) => {
    return {
      fillColor: "red",
      weight: 1,
      opacity: 1,
      color: "grey",
      fillOpacity: 0.7,
    };
  };

  const getDataForProvince = (province) => {
    const upperProvince = province.toUpperCase();
    const found = data.find(item => item.PROVINSI === upperProvince);
    if (!found) {
      console.log(`No data found for province: ${province}`);
      console.log('Available provinces:', data.map(item => item.PROVINSI));
    }
    return found;
  };

  const getDisplayValue = (provinceData) => {
    if (!provinceData) return 'Data not available';
    
    switch(selectedFilter) {
      case 'Jumlah Pencari Kerja Terdaftar':
        return provinceData['JUMLAH PENCARI KERJA TERDAFTAR'];
      case 'Jumlah Lowongan Kerja Terdaftar':
        return provinceData['JUMLAH LOWONGAN KERJA TERDAFTAR'];
      case 'Pencari Kerja Laki-laki':
        return provinceData['PENCARI KERJA LAKI-LAKI'];
      case 'Pencari Kerja Perempuan':
        return provinceData['PENCARI KERJA PEREMPUAN'];
      case 'Lowongan Kerja Laki-laki':
        return provinceData['LOWONGAN KERJA LAKI-LAKI'];
      case 'Lowongan Kerja Perempuan':
        return provinceData['LOWONGAN KERJA PEREMPUAN'];
      default:
        return provinceData['JUMLAH PENCARI KERJA TERDAFTAR'];
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-[1000] flex gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-gray-700">Pilih Jenis Data</label>
          <div className="relative w-64">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full p-2 text-gray-700 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
            >
              <option>Jumlah Pencari Kerja Terdaftar</option>
              <option>Jumlah Lowongan Kerja Terdaftar</option>
              <option>Pencari Kerja Laki-laki</option>
              <option>Pencari Kerja Perempuan</option>
              <option>Lowongan Kerja Laki-laki</option>
              <option>Lowongan Kerja Perempuan</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 fill-current text-gray-500" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-9 right-6 z-[1000] bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-bold mb-2 text-sm">Klasifikasi Berdasarkan {selectedFilter}</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2"></div>
            <span className="text-sm">{selectedFilter} &gt; 12</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-400 mr-2"></div>
            <span className="text-sm">1186929.36 ≤ {selectedFilter} ≤ 1</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2"></div>
            <span className="text-sm">{selectedFilter} &lt; 1</span>
          </div>
        </div>
      </div>
      
      <MapContainer
        center={[0, 120]}
        zoom={5}
        className="w-full h-screen"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON data={BatasProvinsi} style={style} />
        
        {!loading && Object.entries(provinceCoordinates).map(([province, coordinates]) => {
          const provinceData = getDataForProvince(province);
          return (
            <Marker key={province} position={coordinates}>
              <Popup>
                <div className="font-sans">
                  <h3 className="font-bold mb-2">PROVINSI: {province}</h3>
                  <p>{selectedFilter}: {getDisplayValue(provinceData)}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );  
};

export default Map;