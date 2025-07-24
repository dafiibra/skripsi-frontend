import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import BatasProvinsi from "../assets/provinsi.json";
import axios from "axios";
import L from "leaflet";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

const provinceCoordinates = {
  "ACEH": [4.695135, 96.749397],
  "SUMATERA UTARA": [2.1153547, 99.5450974],
  "SUMATERA BARAT": [-0.7399397, 100.8000051],
  "RIAU": [0.2933469, 101.7068294],
  "JAMBI": [-1.6101229, 103.6131203],
  "SUMATERA SELATAN": [-3.3194374, 103.914399],
  "BENGKULU": [-3.5778471, 102.3463875],
  "LAMPUNG": [-4.5585849, 105.4068079],
  "BANGKA BELITUNG": [-2.7410513, 106.4405872],
  "KEPULAUAN RIAU": [3.9456514, 108.1428669],
  "DKI JAKARTA": [-6.2087634, 106.845599],
  "JAWA BARAT": [-6.9174639, 107.6191228],
  "JAWA TENGAH": [-7.150975, 110.1402594],
  "DI YOGYAKARTA": [-7.8753849, 110.4262088],
  "JAWA TIMUR": [-7.5360639, 112.2384017],
  "BANTEN": [-6.4058172, 106.0640179],
  "BALI": [-8.4095178, 115.188916],
  "NUSA TENGGARA BARAT": [-8.6529334, 117.3616476],
  "NUSA TENGGARA TIMUR": [-8.6573819, 121.0793705],
  "KALIMANTAN BARAT": [-0.2787808, 111.4752851],
  "KALIMANTAN TENGAH": [-1.6814878, 113.3823545],
  "KALIMANTAN SELATAN": [-3.0926415, 115.2837585],
  "KALIMANTAN TIMUR": [1.6406296, 116.4194239],
  "KALIMANTAN UTARA": [3.0730929, 116.0413889],
  "SULAWESI UTARA": [0.6246932, 123.9750018],
  "SULAWESI TENGAH": [-1.4300254, 121.4456586],
  "SULAWESI SELATAN": [-3.6687994, 119.9740534],
  "SULAWESI TENGGARA": [-4.14491, 122.174605],
  "GORONTALO": [0.6999372, 122.4467238],
  "SULAWESI BARAT": [-2.8441371, 119.2320784],
  "MALUKU": [-3.2384616, 130.1452734],
  "MALUKU UTARA": [1.5709993, 127.8087693],
  "PAPUA": [-4.269928, 138.0803137],
  "PAPUA BARAT": [-1.3361154, 133.1747162],
};

const Map = () => {
  const [selectedFilter, setSelectedFilter] = useState(
    "JUMLAH PENCARI KERJA TERDAFTAR"
  );
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://skripsi-backend-three.vercel.app/api/combined-data"
        );
        const normalizedData = response.data.data.map((item) => ({
          ...item,
          PROVINSI: item.PROVINSI.toUpperCase(),
        }));
        setData(normalizedData);
        setStats(response.data.stats);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDataForProvince = (province) => {
    const found = data.find((item) => item.PROVINSI === province.toUpperCase());
    return found || null;
  };

  const getDisplayValue = (provinceData) => {
    if (!provinceData) return null;
    return provinceData[selectedFilter];
  };

  // Function to check if the selected filter is related to job seekers (pencari kerja)
  const isJobSeekerFilter = (filter) => {
    const jobSeekerFilters = [
      "JUMLAH PENCARI KERJA TERDAFTAR",
      "PENCARI KERJA LAKI-LAKI",
      "PENCARI KERJA PEREMPUAN"
    ];
    return jobSeekerFilters.includes(filter);
  };

  // Function to check if the selected filter is related to job vacancies (lowongan kerja)
  const isJobVacancyFilter = (filter) => {
    const jobVacancyFilters = [
      "JUMLAH LOWONGAN KERJA TERDAFTAR",
      "LOWONGAN KERJA LAKI-LAKI",
      "LOWONGAN KERJA PEREMPUAN"
    ];
    return jobVacancyFilters.includes(filter);
  };

  const style = (feature) => {
    const province = feature.properties.NAME_1.toUpperCase() || "UNKNOWN";

    const provinceData = getDataForProvince(province);
    const upper = stats[`upper_${selectedFilter}`];
    const lower = stats[`lower_${selectedFilter}`];

    let fillColor = "grey";
    if (provinceData) {
      const value = getDisplayValue(provinceData);
      
      if (isJobSeekerFilter(selectedFilter)) {
        // For job seekers: HIGH value = BAD (red), LOW value = GOOD (green)
        if (value > upper) fillColor = "green";        // Many job seekers = bad
        else if (value < lower) fillColor = "red"; // Few job seekers = good
        else fillColor = "yellow";                   // Medium = neutral
      } else if (isJobVacancyFilter(selectedFilter)) {
        // For job vacancies: HIGH value = GOOD (green), LOW value = BAD (red)
        if (value > upper) fillColor = "red";      // Many vacancies = good
        else if (value < lower) fillColor = "green";   // Few vacancies = bad
        else fillColor = "yellow";                   // Medium = neutral
      } else {
        // Default logic for other filters (if any)
        if (value > upper) fillColor = "green";
        else if (value < lower) fillColor = "red";
        else fillColor = "yellow";
      }
    }

    return {
      fillColor,
      weight: 1,
      opacity: 1,
      color: "grey",
      fillOpacity: 0.7,
    };
  };

  return (
    <div className="relative">
      {/* Responsive Dropdown for selecting filter */}
      <div className="absolute top-2 sm:top-4 left-2 right-2 sm:left-auto sm:right-4 z-[1000] flex gap-2 sm:gap-4">
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-xs sm:text-sm font-medium mb-1 text-gray-700 bg-white px-2 py-1 rounded-t-md sm:bg-transparent sm:px-0 sm:py-0">
            Pilih Jenis Data
          </label>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full sm:w-64 lg:w-80 p-2 text-xs sm:text-sm text-gray-700 bg-white border rounded-md shadow-sm outline-none focus:border-indigo-600"
          >
            <option value="JUMLAH PENCARI KERJA TERDAFTAR">
              Jumlah Pencari Kerja Terdaftar
            </option>
            <option value="JUMLAH LOWONGAN KERJA TERDAFTAR">
              Jumlah Lowongan Kerja Terdaftar
            </option>
            <option value="PENCARI KERJA LAKI-LAKI">
              Pencari Kerja Laki-laki
            </option>
            <option value="PENCARI KERJA PEREMPUAN">
              Pencari Kerja Perempuan
            </option>
            <option value="LOWONGAN KERJA LAKI-LAKI">
              Lowongan Kerja Laki-laki
            </option>
            <option value="LOWONGAN KERJA PEREMPUAN">
              Lowongan Kerja Perempuan
            </option>
          </select>
        </div>
      </div>

      {/* Responsive Legend */}
      <div className="absolute bottom-2 sm:bottom-4 left-2 right-2 sm:left-auto sm:right-4 lg:right-6 z-[1000] bg-white p-2 sm:p-4 rounded-lg shadow-md max-w-xs sm:max-w-sm lg:max-w-md">
        <h3 className="font-bold mb-2 text-xs sm:text-sm lg:text-base">
          Klasifikasi Berdasarkan 
          <span className="block sm:inline sm:ml-1">
            {selectedFilter.length > 20 ? selectedFilter.substring(0, 20) + '...' : selectedFilter}
          </span>
        </h3>
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center">
            <div 
              className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" 
              style={{ backgroundColor: "red" }}
            ></div>
            <span className="text-xs sm:text-sm break-words">
              {selectedFilter} {">"} {stats[`upper_${selectedFilter}`]}
            </span>
          </div>
          <div className="flex items-center">
            <div 
              className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" 
              style={{ backgroundColor: "yellow" }}
            ></div>
            <span className="text-xs sm:text-sm break-words">
              {stats[`lower_${selectedFilter}`]} ≤ {selectedFilter.length > 15 ? selectedFilter.substring(0, 15) + '...' : selectedFilter} ≤{" "}
              {stats[`upper_${selectedFilter}`]}
            </span>
          </div>
          <div className="flex items-center">
            <div 
              className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" 
              style={{ backgroundColor: "green" }}
            ></div>
            <span className="text-xs sm:text-sm break-words">
              {selectedFilter.length > 15 ? selectedFilter.substring(0, 15) + '...' : selectedFilter} {"<"} {stats[`lower_${selectedFilter}`]}
            </span>
          </div>
        </div>
      </div>

      <MapContainer 
        center={[0, 120]} 
        zoom={5} 
        className="w-full h-screen"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON data={BatasProvinsi} style={style} />
        {!loading &&
          Object.entries(provinceCoordinates).map(([province, coordinates]) => {
            const provinceData = getDataForProvince(province);
            const displayValue = getDisplayValue(provinceData);

            return (
              <Marker key={province} position={coordinates}>
                <Popup className="custom-popup">
                  <div className="font-sans p-1">
                    <h3 className="font-bold mb-2 text-sm sm:text-base">{province}</h3>
                    {provinceData ? (
                      <div className="text-xs sm:text-sm">
                        <p className="font-medium">
                          {selectedFilter.length > 25 ? selectedFilter.substring(0, 25) + '...' : selectedFilter}:
                        </p>
                        <p className="font-bold text-blue-600">{displayValue?.toLocaleString()}</p>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-500">Data tidak tersedia</p>
                    )}
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