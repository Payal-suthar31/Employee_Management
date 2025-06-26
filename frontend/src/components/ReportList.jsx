import React, { useState, useEffect } from 'react';
import api, { reportApi } from '../services/api';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'reportId', direction: 'desc' });
  const [isViewingDocument, setIsViewingDocument] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await reportApi.getAllReports();
        // Map the response data to include documentPath from documentUrl if available
        const mappedReports = response.data.map(report => ({
          ...report,
          documentPath: report.documentUrl || report.documentPath // Use documentUrl if available, fall back to documentPath
        }));
        setReports(mappedReports);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleApprove = async (reportId) => {
    try {
      await api.post(`/Report/approve/${reportId}`);
      // Update the report status in the local state
      setReports(reports.map(report =>
        report.reportId === reportId
          ? { ...report, status: 'Approved' }
          : report
      ));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to approve report');
    }
  };

  const handleReject = async (reportId) => {
    try {
      await api.post(`/Report/reject/${reportId}`);
      // Update the report status in the local state
      setReports(reports.map(report =>
        report.reportId === reportId
          ? { ...report, status: 'Rejected' }
          : report
      ));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reject report');
    }
  };

  const handleViewDocument = (documentPath) => {
    if (!documentPath) {
      setError('No document available.');
      return;
    }

    try {
      // For Cloudinary URLs, use them directly
      const documentUrl = documentPath;
      
      // Extract file extension from the URL
      const fileExtension = documentPath.split('.').pop()?.toLowerCase();
      const isPdf = fileExtension === 'pdf';
      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);

      // Get the file name from the URL
      const fileName = documentPath.split('/').pop();

      setDocumentUrl(documentUrl);
      setDocumentName(fileName);
      setDocumentType(
        isPdf ? 'application/pdf' : isImage ? 'image/*' : 'application/octet-stream'
      );
      setShowModal(true);
    } catch (error) {
      setError('Failed to load document. Please try again.');
      console.error('Document view error:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (documentUrl) {
      window.URL.revokeObjectURL(documentUrl);
    }
    setDocumentUrl('');
    setDocumentType('');
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  const filteredAndSortedReports = React.useMemo(() => {
    let sortableReports = [...reports];

    // Filter reports based on search text
    if (filterText) {
      sortableReports = sortableReports.filter((report) =>
        report.employeeName?.toLowerCase().includes(filterText.toLowerCase()) ||
        report.type?.toLowerCase().includes(filterText.toLowerCase()) ||
        report.status?.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    // Sort reports
    sortableReports.sort((a, b) => {
      if (sortConfig.key === 'reportId') {
        // For reportId, higher numbers are more recent
        return sortConfig.direction === 'asc' 
          ? a.reportId - b.reportId 
          : b.reportId - a.reportId;
      }

      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sortableReports;
  }, [reports, sortConfig, filterText]);
  // Calculate pagination
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredAndSortedReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredAndSortedReports.length / reportsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (report) => {
    setReportToDelete(report);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!reportToDelete) return;
    
    setIsDeleting(true);
    setDeleteError('');
    
    try {
      await reportApi.deleteReport(reportToDelete.reportId);
      // Remove the deleted report from the state
      setReports(reports.filter(r => r.reportId !== reportToDelete.reportId));
      setShowDeleteConfirm(false);
      setReportToDelete(null);
    } catch (error) {
      setDeleteError(error.response?.data?.message || 'Failed to delete report');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setReportToDelete(null);
    setDeleteError('');
  };

  return (
    <div className="min-h-screen p-6 bg-[#fdf8f6]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#232946] mb-6">Manage Reports</h1>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-[#BFA181] animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-t-2 border-b-2 border-[#D4C4B0] animate-spin animation-delay-150"></div>
              </div>
              <p className="text-[#232946] font-medium">Loading reports...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto border border-[#bfa181]/10">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-center text-[#232946] mb-2">Error Loading Reports</h3>
            <p className="text-[#232946]/70 text-center">{error}</p>
            <button
              onClick={() => {
                setError('');
                fetchReports();
              }}
              className="mt-6 w-full px-4 py-2 bg-[#BFA181] text-white rounded-lg hover:bg-[#A69073] transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Search Bar */}
        {!loading && !error && (
          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Search reports..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full md:w-96 pl-10 pr-4 py-2 border border-[#bfa181]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bfa181]/20"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-[#bfa181]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        )}

        {/* Reports Table */}
        {!loading && !error && (
          <>
            <div className="overflow-x-auto bg-white rounded-xl shadow-md">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('employeeName')}>
                      Employee {getSortIcon('employeeName')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('type')}>
                      Type {getSortIcon('type')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                      Status {getSortIcon('status')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentReports.map((report) => (
                    <tr key={report.reportId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-[#BFA181] flex items-center justify-center text-white font-semibold">
                            {report.employeeName?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{report.employeeName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          report.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.documentPath && (
                          <button
                            onClick={() => handleViewDocument(report.documentPath)}
                            className="text-[#BFA181] hover:text-[#A69073] flex items-center space-x-1"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>View</span>
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {report.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(report.reportId)}
                                className="px-3 py-1 bg-[#22c55e] text-white text-xs rounded hover:bg-[#16a34a] transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(report.reportId)}
                                className="px-3 py-1 bg-[#ef4444] text-white text-xs rounded hover:bg-[#dc2626] transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(report)}
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-[#BFA181] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === index + 1
                        ? 'bg-[#BFA181] text-white'
                        : 'bg-white text-[#BFA181] hover:bg-[#BFA181] hover:text-white'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-[#BFA181] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Document Viewer Modal */}
        {showModal && documentUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white w-[90%] h-[90%] rounded-lg overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">{documentName}</h3>
                <div className="flex items-center space-x-4">
                  <a
                    href={documentUrl}
                    download={documentName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Download
                  </a>
                  <a
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Open in New Tab
                  </a>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4 bg-gray-100 overflow-auto">
                {documentType === 'application/pdf' ? (
                  <iframe
                    src={`${documentUrl}#toolbar=0`}
                    className="w-full h-full"
                    title={documentName}
                  >
                    <p>
                      Your browser does not support PDFs.
                      <a href={documentUrl} target="_blank" rel="noopener noreferrer">Download the PDF</a>
                    </p>
                  </iframe>
                ) : documentType === 'image/*' ? (
                  <div className="flex items-center justify-center h-full">
                    <img
                      src={documentUrl}
                      alt={documentName}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        setError('Failed to load image');
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-gray-600 mb-4">This file type cannot be previewed directly.</p>
                    <a
                      href={documentUrl}
                      download={documentName}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Download File
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this report? This action cannot be undone.
              </p>
              {deleteError && (
                <p className="text-red-500 mb-4">{deleteError}</p>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Toast */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportList;
