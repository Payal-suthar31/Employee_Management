import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const SubmitReport = () => {
  const [reports, setReports] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    reportType: 'Daily',
  });
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports/my');
      setReports(response.data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const data = new FormData();
      data.append('Title', formData.title);
      data.append('Content', formData.content);
      data.append('ReportType', formData.reportType);
      if (document) {
        data.append('Document', document);
      }
      await api.post('/reports', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFormData({
        title: '',
        content: '',
        reportType: 'Daily',
      });
      setDocument(null);
      fetchReports();
    } catch (err) {
      console.error('Failed to submit report:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Submit Report</h1>

      {/* Submit Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Report Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Report Type
            </label>
            <select
              name="reportType"
              value={formData.reportType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Document (optional)
            </label>
            <input
              type="file"
              name="document"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={e => setDocument(e.target.files[0])}
              className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">My Reports</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No reports submitted yet</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div key={report.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{report.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Type: {report.reportType}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Submitted: {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : report.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">{report.content}</p>
                  {report.documentPath && (
                    <a
                      href={`/${report.documentPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm mt-2 block"
                    >
                      View Uploaded Document
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitReport; 