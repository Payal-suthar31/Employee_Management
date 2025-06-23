import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [isViewingDocument, setIsViewingDocument] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentName, setDocumentName] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5181/api/Report', {
        headers: {
          'Authorization': token,
          'Accept': 'application/json'
        }
      });
      setReports(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load reports');
      setLoading(false);
    }
  };

  const handleApprove = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5181/api/Report/approve/${reportId}`, {}, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      fetchReports();
    } catch (error) {
      setError('Failed to approve report');
    }
  };

  const handleReject = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5181/api/Report/reject/${reportId}`, {}, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      fetchReports();
    } catch (error) {
      setError('Failed to reject report');
    }
  };

  const handleViewDocument = async (reportId) => {
    try {
      setIsViewingDocument(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You are not authenticated. Please login again.');
        return;
      }

      const response = await axios({
        method: 'get',
        url: `http://localhost:5181/api/Report/${reportId}/document`,
        headers: {
          'Authorization': token,
          'Accept': '*/*'
        },
        responseType: 'blob'
      });

      // Get filename from content-disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'document';
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (matches && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      setDocumentName(filename);

      // Get file type and create URL
      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      
      setDocumentUrl(url);
      setDocumentType(contentType);
      setShowModal(true);

    } catch (err) {
      console.error('Failed to view document:', err);
      setError('Failed to view document. Please try again.');
    } finally {
      setIsViewingDocument(false);
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

  const filteredAndSortedReports = React.useMemo(() => {
    let sortableReports = [...reports];
    if (filterText) {
      sortableReports = sortableReports.filter(report => 
        report.title?.toLowerCase().includes(filterText.toLowerCase()) ||
        report.type?.toLowerCase().includes(filterText.toLowerCase()) ||
        report.content?.toLowerCase().includes(filterText.toLowerCase())
      );
    }
    if (sortConfig.key) {
      sortableReports.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableReports;
  }, [reports, sortConfig, filterText]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#fdf8f6]">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-[#BFA181] animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-t-2 border-b-2 border-[#D4C4B0] animate-spin animation-delay-150"></div>
          </div>
          <p className="text-[#232946] font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#fdf8f6]">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-[#bfa181]/10">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-center text-[#232946] mb-2">Error Loading Reports</h3>
          <p className="text-[#232946]/70 text-center">{error}</p>
          <button
            onClick={fetchReports}
            className="mt-6 w-full px-4 py-2 bg-[#BFA181] text-white rounded-lg hover:bg-[#A69073] transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f6] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#232946] mb-6">Manage Reports</h1>
        
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedReports.map((report) => (
            <div
              key={report.reportId}
              className="bg-white rounded-xl shadow-md p-6 border border-[#bfa181]/10"
            >
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-[#BFA181] flex items-center justify-center text-white font-semibold text-lg">
                  {report.employeeName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-semibold text-[#232946]">{report.employeeName}</h3>
                  <p className="text-sm text-[#232946]/70">{report.type}</p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-[#232946]">Status:</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                    report.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    report.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
          
              </div>

              {report.documentPath && (
                <button
                  onClick={() => handleViewDocument(report.reportId)}
                  className="w-full py-2 bg-[#b69677] text-white text-sm font-medium rounded-md hover:bg-[#a68666] transition-colors flex items-center justify-center gap-2"
                  disabled={isViewingDocument}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{isViewingDocument ? 'Opening...' : 'View Document'}</span>
                </button>
              )}

              {report.status === 'Pending' && (
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={() => handleApprove(report.reportId)}
                    className="flex-1 px-4 py-2 bg-[#22c55e] text-white text-sm rounded-md hover:bg-[#16a34a] transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(report.reportId)}
                    className="flex-1 px-4 py-2 bg-[#ef4444] text-white text-sm rounded-md hover:bg-[#dc2626] transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Document Viewer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 h-5/6 max-w-6xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{documentName}</h3>
              <div className="flex items-center gap-4">
                <a
                  href={documentUrl}
                  download={documentName}
                  className="px-4 py-2 bg-[#b69677] text-white rounded hover:bg-[#a68666] transition-colors"
                >
                  Download
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

            <div className="flex-1 bg-gray-50 rounded-lg overflow-auto">
              {documentType?.startsWith('image/') ? (
                <img
                  src={documentUrl}
                  alt={documentName}
                  className="max-w-full h-auto mx-auto"
                />
              ) : documentType === 'application/pdf' ? (
                <object
                  data={documentUrl}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <iframe
                    src={documentUrl}
                    title="PDF Viewer"
                    className="w-full h-full min-h-[600px]"
                  >
                    <p>Your browser does not support PDFs. Please download to view.</p>
                  </iframe>
                </object>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 text-center mb-4">
                    This file type cannot be previewed in the browser.
                  </p>
                  <a
                    href={documentUrl}
                    download={documentName}
                    className="px-4 py-2 bg-[#b69677] text-white rounded hover:bg-[#a68666] transition-colors"
                  >
                    Download to View
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error message display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default ReportList;
