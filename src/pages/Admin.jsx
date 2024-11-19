import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Label, TextInput, Alert } from 'flowbite-react';
import { PlusCircle, LogOut } from 'lucide-react';
import DataTable from '../components/DataTable';
import Swal from 'sweetalert2';

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
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/combined-data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
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
        const response = await fetch(`http://localhost:3000/api/pencari-kerja/${row.NO}/${row.PROVINSI}`, {
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
      const response = await fetch(`http://localhost:3000/api/combined-data/${updatedRow.NO}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRow),
      });
      const result = await response.json();
      setData(data.map(item => item.NO === result.NO ? result : item));
      setShowModal(false);
      showNotification('Data successfully updated!');
    } catch (err) {
      showNotification('Failed to update item', 'error');
      console.error('Error updating item:', err);
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
            fetch('http://localhost:3000/api/pencari-kerja', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: pencariKerjaData }),
            })
          );
        }

        if (lowonganKerjaData.length > 0) {
          requests.push(
            fetch('http://localhost:3000/api/lowongan-kerja', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: lowonganKerjaData }),
            })
          );
        }

        // Wait for all requests to complete
        await Promise.all(requests);

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
        text: "Failed to add the data. Please try again.",
        icon: "error"
      });
      console.error('Error adding item:', err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRow(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mx-auto p-4" style={{ backgroundColor: '#090D44', minHeight: '100vh' }}>
      {showAlert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert color={alertType === 'success' ? 'success' : 'failure'}>
            {alertMessage}
          </Alert>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold px-4 text-white">Admin Dashboard</h1>
        <div className="flex items-center">
          <Button onClick={() => setShowModal(true)} className='mx-4 bg-green-500'>
            <PlusCircle className="mr-3 h-5 w-5 " />
            Add New Data
          </Button>
          <Button onClick={handleLogout} className='mx-4 bg-red-500'>
            <LogOut className="mr-3 h-5 w-5 " />
            Logout
          </Button>
        </div>
      </div>
      
      <DataTable
        data={data}
        isAdmin={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal show={showModal} onClose={handleCloseModal} className="mx-20">
        <Modal.Header>{editingRow ? 'Edit Entry' : 'Add New Entry'}</Modal.Header>
        <Modal.Body className="bg--500">
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
            {['PROVINSI', 'JUMLAH PENCARI KERJA TERDAFTAR', 'JUMLAH LOWONGAN KERJA TERDAFTAR',
              'PENCARI KERJA LAKI-LAKI', 'PENCARI KERJA PEREMPUAN', 'LOWONGAN KERJA LAKI-LAKI',
              'LOWONGAN KERJA PEREMPUAN'].map((field) => (
              <div key={field} className="mb-2">
                <Label htmlFor={field}>{field} {field === 'PROVINSI' && <span className="text-red-500">*</span>}</Label>
                <TextInput
                  id={field}
                  name={field}
                  defaultValue={editingRow ? editingRow[field] : ''}
                  type={field === 'PROVINSI' ? 'text' : 'number'}
                  required={field === 'PROVINSI'}
                />
              </div>
            ))}
            <Button type="submit" className="mt-4 bg-blue-500">
              {editingRow ? 'Save Changes' : 'Add Entry'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminPage;