import React, { useState } from 'react';
import { Table, TextInput, Button, Dropdown } from 'flowbite-react';
import { Search, Download, Filter, RotateCcw, Edit, Trash } from 'lucide-react';

const DataTable = ({ data, isAdmin, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColumn, setFilterColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const headers = [
    'NO',
    'PROVINSI',
    'JUMLAH PENCARI KERJA TERDAFTAR',
    'JUMLAH LOWONGAN KERJA TERDAFTAR',
    'PENCARI KERJA LAKI-LAKI',
    'PENCARI KERJA PEREMPUAN',
    'LOWONGAN KERJA LAKI-LAKI',
    'LOWONGAN KERJA PEREMPUAN'
  ];

  if (isAdmin) {
    headers.push('ACTIONS');
  }

  const sortableColumns = headers.slice(2);

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = filterColumn
    ? filteredData.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[filterColumn] - b[filterColumn];
        } else if (sortOrder === 'desc') {
          return b[filterColumn] - a[filterColumn];
        }
        return 0;
      })
    : filteredData;

  const handleDownload = () => {
    const csvContent = [
      headers.join(','),
      ...sortedData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'data_ketenagakerjaan.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterColumn('');
    setSortOrder('');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 space-x-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full p-2 pl-10 text-sm text-gray-900 border rounded-md border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-64">
            <select
              value={filterColumn}
              onChange={(e) => setFilterColumn(e.target.value)}
              className="w-full p-2 text-gray-700 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
            >
              <option value="">Urut Berdasarkan</option>
              {sortableColumns.map((column, index) => (
                <option key={index} value={column}>
                  {column}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <Filter className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          {filterColumn && (
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 text-gray-700 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
            >
              <option value="">Urutan</option>
              <option value="asc">Terkecil</option>
              <option value="desc">Terbesar</option>
            </select>
          )}
          <Button color="light" onClick={resetFilters}>
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-5 w-5 " />
          Download Data
        </Button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <Table striped className="w-full text-base text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <Table.Head className="text-sm text-gray-700 uppercase bg-gray-700 dark:bg-gray-700 dark:text-gray-400">
            {headers.map((header, index) => (
              <Table.HeadCell key={index} className="px-6 py-3">
                {header}
              </Table.HeadCell>
            ))}
          </Table.Head>
          <Table.Body className="divide-y">
            {sortedData.map((row, rowIndex) => (
              <Table.Row key={rowIndex} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-secondary dark:hover:bg-gray-600">
                {headers.map((header, cellIndex) => {
                  if (header === 'ACTIONS' && isAdmin) {
                    return (
                      <Table.Cell key={cellIndex} className="font-medium whitespace-nowrap">
                        <Button.Group>
                          <Button size="sm" onClick={() => onEdit(row)} className='flex flex-row items-center justify-center bg-yellow-400 h-fit py-1 w-24'>
                            <Edit className="mr-2 h-4 w-4" />
                            <p>Edit</p>
                          </Button>
                          <Button color="failure" size="sm" onClick={() => onDelete(row)} className='flex flex-row bg-red-500 items-center py-1 w-24'>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </Button.Group>
                      </Table.Cell>
                    );
                  }
                  return (
                    <Table.Cell key={cellIndex} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {row[header]}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;