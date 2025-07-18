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
    <div className="p-2 sm:p-4">
      {/* Mobile-first responsive controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-3 sm:space-y-0 sm:space-x-4">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full sm:w-64 p-2 pl-10 text-sm text-gray-900 border rounded-md border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Cari Provinsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative w-full sm:w-auto">
            <select
              value={filterColumn}
              onChange={(e) => setFilterColumn(e.target.value)}
              className="w-full sm:w-64 p-2 text-gray-700 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600 text-sm"
            >
              <option value="">Urut Berdasarkan</option>
              {sortableColumns.map((column, index) => (
                <option key={index} value={column}>
                  {column.length > 30 ? column.substring(0, 30) + '...' : column}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <Filter className="w-4 h-4 text-blue-500" />
            </div>
          </div>

          {/* Sort Order */}
          {filterColumn && (
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full sm:w-auto p-2 text-gray-700 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600 text-sm"
            >
              <option value="">Urutan</option>
              <option value="asc">Terkecil</option>
              <option value="desc">Terbesar</option>
            </select>
          )}

          {/* Reset Button */}
          <Button color="light" onClick={resetFilters} className="w-full sm:w-auto">
            <RotateCcw className="mr-2 h-4 w-4" />
            <span className="text-sm">Reset</span>
          </Button>
        </div>

        {/* Download Button */}
        <Button onClick={handleDownload} className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          <span className="text-sm">Download Data</span>
        </Button>
      </div>

      {/* Responsive Table Container */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <Table striped className="w-full text-xs sm:text-sm lg:text-base text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <Table.Head className="text-xs sm:text-sm text-gray-700 uppercase bg-gray-700 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
            {headers.map((header, index) => (
              <Table.HeadCell 
                key={index} 
                className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap"
              >
                <span className="hidden lg:inline">{header}</span>
                <span className="lg:hidden">
                  {header.length > 15 ? header.substring(0, 15) + '...' : header}
                </span>
              </Table.HeadCell>
            ))}
          </Table.Head>
          <Table.Body className="divide-y">
            {sortedData.map((row, rowIndex) => (
              <Table.Row 
                key={rowIndex} 
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-secondary dark:hover:bg-gray-600"
              >
                {headers.map((header, cellIndex) => {
                  if (header === 'ACTIONS' && isAdmin) {
                    return (
                      <Table.Cell key={cellIndex} className="px-2 sm:px-4 lg:px-6 py-2 sm:py-4 font-medium whitespace-nowrap">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                          <Button 
                            size="xs" 
                            onClick={() => onEdit(row)} 
                            className='flex flex-row items-center justify-center bg-yellow-400 h-fit py-1 w-full sm:w-auto text-xs'
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button 
                            color="failure" 
                            size="xs" 
                            onClick={() => onDelete(row)} 
                            className='flex flex-row bg-red-500 items-center py-1 w-full sm:w-auto text-xs'
                          >
                            <Trash className="mr-1 h-3 w-3" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </Table.Cell>
                    );
                  }
                  return (
                    <Table.Cell 
                      key={cellIndex} 
                      className="px-2 sm:px-4 lg:px-6 py-2 sm:py-4 font-medium text-gray-900 dark:text-white"
                    >
                      <div className="truncate max-w-[80px] sm:max-w-[120px] lg:max-w-none" title={row[header]}>
                        {row[header]}
                      </div>
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Mobile Table Summary */}
      <div className="mt-4 text-sm text-gray-600 text-center lg:hidden">
        Menampilkan {sortedData.length} data dari {data.length} total data
      </div>
    </div>
  );
};

export default DataTable;