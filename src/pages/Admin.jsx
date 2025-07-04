import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Label, TextInput, Alert } from 'flowbite-react';
import { PlusCircle, LogOut } from 'lucide-react';
import DataTable from '../components/DataTable';
import Swal from 'sweetalert2';
import axios from 'axios';

const AdminPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success mx-2",
      cancelButton: "btn btn-danger mx-2"
    },
    buttonsStyling: true
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [navigate]);

  const showNotification = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://skripsi-backend-three.vercel.app/api/combined-data'
      );
      const jsonData = await response.data.data;
      setData(jsonData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data: ' + error.message);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleEdit = (row) => {
    setEditingRow(row);
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    try {
      const result = await swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: `You are about to delete data for ${row.PROVINSI}. This action cannot be undone!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      });

      if (result.isConfirmed) {
        const response = await fetch(`https://skripsi-backend-three.vercel.app/api/pencari-kerja/${row.NO}/${row.PROVINSI}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setData(data.filter(item => item.NO !== row.NO));
          await swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: `Data for ${row.PROVINSI} has been deleted successfully.`,
            icon: "success"
          });
        } else {
          throw new Error('Failed to delete data');
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        await swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your data is safe :)",
          icon: "error"
        });
      }
    } catch (err) {
      await Swal.fire({
        title: "Error!",
        text: "Failed to delete the data. Please try again.",
        icon: "error"
      });
      console.error('Error deleting item:', err);
    }
  };

  const handleSave = async (updatedRow) => {
    try {
      const result = await swalWithBootstrapButtons.fire({
        title: "Confirm Update",
        text: "Are you sure you want to update this data?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      });
  
      if (result.isConfirmed) {
        const updateData = {
          pencariKerja: {},
          lowonganKerja: {}
        };
  
        // Check if PencariKerja data has changed
        if (
          updatedRow['PENCARI KERJA LAKI-LAKI'] !== editingRow['PENCARI KERJA LAKI-LAKI'] ||
          updatedRow['PENCARI KERJA PEREMPUAN'] !== editingRow['PENCARI KERJA PEREMPUAN']
        ) {
          updateData.pencariKerja = {
            lakiLaki: parseInt(updatedRow['PENCARI KERJA LAKI-LAKI']),
            perempuan: parseInt(updatedRow['PENCARI KERJA PEREMPUAN'])
          };
        }
  
        // Check if LowonganKerja data has changed
        if (
          updatedRow['LOWONGAN KERJA LAKI-LAKI'] !== editingRow['LOWONGAN KERJA LAKI-LAKI'] ||
          updatedRow['LOWONGAN KERJA PEREMPUAN'] !== editingRow['LOWONGAN KERJA PEREMPUAN']
        ) {
          updateData.lowonganKerja = {
            lakiLaki: parseInt(updatedRow['LOWONGAN KERJA LAKI-LAKI']),
            perempuan: parseInt(updatedRow['LOWONGAN KERJA PEREMPUAN'])
          };
        }
  
        // Only send request if there are changes
        if (Object.keys(updateData.pencariKerja).length > 0 || Object.keys(updateData.lowonganKerja).length > 0) {
          const response = await fetch(`https://skripsi-backend-three.vercel.app/api/update/${updatedRow.PROVINSI}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update data');
          }
  
          await fetchData(); // Refresh the data
          setShowModal(false);
          
          await swalWithBootstrapButtons.fire({
            title: "Updated!",
            text: "Your data has been updated successfully.",
            icon: "success"
          });
        } else {
          setShowModal(false);
          await swalWithBootstrapButtons.fire({
            title: "No Changes",
            text: "No data was modified.",
            icon: "info"
          });
        }
      }
    } catch (err) {
      console.error('Error updating item:', err);
      await Swal.fire({
        title: "Error!",
        text: err.message || "Failed to update the data. Please try again.",
        icon: "error"
      });
    }
  };

  const handleAdd = async (formData) => {
    try {
      if (!formData.PROVINSI) {
        await Swal.fire({
          title: "Error!",
          text: "Province field is required!",
          icon: "error"
        });
        return;
      }
  
      const result = await swalWithBootstrapButtons.fire({
        title: "Confirm Addition",
        text: "Are you sure you want to add this data?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, add it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      });
  
      if (result.isConfirmed) {
        // First, try to add the province
        try {
          const provinceResponse = await fetch('https://skripsi-backend-three.vercel.app/api/provinsi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: formData.PROVINSI })
          });
  
          // If the province exists, the backend will return a 400 status
          // We'll ignore that error and continue with adding data
          if (!provinceResponse.ok && provinceResponse.status !== 400) {
            throw new Error('Failed to add province');
          }
        } catch (provinceError) {
          console.error('Province addition error:', provinceError);
          await Swal.fire({
            title: "Warning",
            text: "Could not add province. It may already exist.",
            icon: "warning"
          });
        }
  
        // Create separate objects for each collection
        const pencariKerjaData = [];
        const lowonganKerjaData = [];
        const currentYear = new Date().getFullYear();
  
        // Process job seeker data if provided
        if (formData['PENCARI KERJA LAKI-LAKI']) {
          pencariKerjaData.push({
            provinsi: formData.PROVINSI,
            gender: 'laki-laki',
            amount: parseInt(formData['PENCARI KERJA LAKI-LAKI']),
            year: currentYear
          });
        }
  
        if (formData['PENCARI KERJA PEREMPUAN']) {
          pencariKerjaData.push({
            provinsi: formData.PROVINSI,
            gender: 'perempuan',
            amount: parseInt(formData['PENCARI KERJA PEREMPUAN']),
            year: currentYear
          });
        }
  
        // Process job vacancy data if provided
        if (formData['LOWONGAN KERJA LAKI-LAKI']) {
          lowonganKerjaData.push({
            provinsi: formData.PROVINSI,
            gender: 'laki-laki',
            amount: parseInt(formData['LOWONGAN KERJA LAKI-LAKI']),
            year: currentYear
          });
        }
  
        if (formData['LOWONGAN KERJA PEREMPUAN']) {
          lowonganKerjaData.push({
            provinsi: formData.PROVINSI,
            gender: 'perempuan',
            amount: parseInt(formData['LOWONGAN KERJA PEREMPUAN']),
            year: currentYear
          });
        }
  
        // Send data to appropriate endpoints
        const requests = [];
  
        if (pencariKerjaData.length > 0) {
          requests.push(
            fetch('https://skripsi-backend-three.vercel.app/api/pencari-kerja', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: pencariKerjaData }),
            })
          );
        }
  
        if (lowonganKerjaData.length > 0) {
          requests.push(
            fetch('https://skripsi-backend-three.vercel.app/api/lowongan-kerja', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: lowonganKerjaData }),
            })
          );
        }
  
        // Wait for all requests to complete
        const responses = await Promise.all(requests);
  
        // Check if any request failed
        const failedResponses = responses.filter(response => !response.ok);
        if (failedResponses.length > 0) {
          throw new Error('Failed to add some data');
        }
  
        // Refresh the data
        await fetchData();
        setShowModal(false);
        
        await swalWithBootstrapButtons.fire({
          title: "Added!",
          text: "Your data has been added successfully.",
          icon: "success"
        });
      }
    } catch (err) {
      await Swal.fire({
        title: "Error!",
        text: err.message || "Failed to add the data. Please try again.",
        icon: "error"
      });
      console.error('Error adding item:', err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRow(null);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#090D44] flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Loading...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-[#090D44] flex items-center justify-center p-4">
      <div className="text-center text-white max-w-md">
        <div className="text-red-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-lg">Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="mx-auto p-2 sm:p-4 lg:p-6" style={{ backgroundColor: '#090D44', minHeight: '100vh' }}>
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Alert color={alertType === 'success' ? 'success' : 'failure'}>
            {alertMessage}
          </Alert>
        </div>
      )}
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold px-2 sm:px-4 text-white">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-blue-200 px-2 sm:px-4 mt-1">
            Kelola data ketenagakerjaan
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 px-2 sm:px-4">
          <Button 
            onClick={() => setShowModal(true)} 
            className='w-full sm:w-auto bg-green-500 hover:bg-green-600 text-sm sm:text-base'
          >
            <PlusCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sm:inline">Add New Data</span>
          </Button>
          <Button 
            onClick={handleLogout} 
            className='w-full sm:w-auto bg-red-500 hover:bg-red-600 text-sm sm:text-base'
          >
            <LogOut className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sm:inline">Logout</span>
          </Button>
        </div>
      </div>
      
      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <DataTable
          data={data}
          isAdmin={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Responsive Modal */}
      <Modal show={showModal} onClose={handleCloseModal} className="p-2 sm:p-4">
        <Modal.Header className="text-lg sm:text-xl">
          {editingRow ? 'Edit Entry' : 'Add New Entry'}
        </Modal.Header>
        <Modal.Body className="max-h-[70vh] overflow-y-auto">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const rowData = Object.fromEntries(formData.entries());
            if (editingRow) {
              handleSave({ ...editingRow, ...rowData });
            } else {
              handleAdd(rowData);
            }
          }}>
            <div className="space-y-3 sm:space-y-4">
              {['PROVINSI', 'JUMLAH PENCARI KERJA TERDAFTAR', 'JUMLAH LOWONGAN KERJA TERDAFTAR',
                'PENCARI KERJA LAKI-LAKI', 'PENCARI KERJA PEREMPUAN', 'LOWONGAN KERJA LAKI-LAKI',
                'LOWONGAN KERJA PEREMPUAN'].map((field) => (
                <div key={field}>
                  <Label htmlFor={field} className="text-sm sm:text-base">
                    {field.length > 25 ? field.substring(0, 25) + '...' : field}
                    {field === 'PROVINSI' && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <TextInput
                    id={field}
                    name={field}
                    defaultValue={editingRow ? editingRow[field] : ''}
                    type={field === 'PROVINSI' ? 'text' : 'number'}
                    required={field === 'PROVINSI'}
                    className="mt-1"
                    placeholder={field === 'PROVINSI' ? 'Masukkan nama provinsi' : 'Masukkan angka'}
                  />
                </div>
              ))}
            </div>
            
            {/* Modal Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 order-1 sm:order-1"
              >
                {editingRow ? 'Save Changes' : 'Add Entry'}
              </Button>
              <Button 
                type="button"
                color="gray" 
                onClick={handleCloseModal}
                className="w-full sm:w-auto order-2 sm:order-2"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Mobile Stats Summary */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:hidden">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-sm text-gray-600">Total Entries</p>
          <p className="text-2xl font-bold text-blue-600">{data.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-sm text-gray-600">Last Updated</p>
          <p className="text-sm font-semibold text-gray-800">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;