import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';

const Complaints = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('ELECTRICAL');
  const [desc, setDesc] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get('/complaints/my');
      setComplaints(data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/complaints', {
        title,
        category,
        description: desc
      });
      setTitle('');
      setDesc('');
      fetchComplaints();
      alert('Complaint submitted successfully');
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-800 flex gap-2">
            <i className="fas fa-bug text-indigo-500"></i> File a Complaint
          </h2>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Brief title of the issue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="ELECTRICAL">Electrical</option>
                <option value="PLUMBING">Plumbing</option>
                <option value="CARPENTRY">Carpentry</option>
                <option value="CLEANING">Cleaning</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                rows="3"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Provide details about the problem"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h3 className="text-lg font-medium text-gray-800">Previous Complaints</h3>
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading complaints...</div>
          ) : (
            <div className="mt-3 space-y-3 max-h-96 overflow-auto">
              {complaints.length === 0 ? (
                <div className="text-center py-10 text-gray-400">No complaints filed yet.</div>
              ) : (
                complaints.map((c) => (
                  <div key={c._id} className="border rounded-lg p-3">
                    <div className="flex justify-between">
                      <span className="font-medium">{c.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 uppercase">{c.category}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-400">
                        Status: <span className={`font-semibold ${
                          c.status === 'COMPLETED' ? 'text-green-600' : 
                          c.status === 'IN_PROGRESS' ? 'text-blue-600' : 'text-amber-600'
                        }`}>{c.status}</span> | {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                      {c.assignedTo && (
                        <p className="text-xs text-gray-500">
                          Assigned to: {c.assignedTo.name}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <footer className="text-center text-gray-400 text-xs py-6 border-t mt-12">HOSTELC — Student Portal</footer>
    </div>
  );
};

export default Complaints;
