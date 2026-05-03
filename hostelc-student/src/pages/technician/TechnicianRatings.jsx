import { useEffect, useState } from 'react';
import TechnicianNavbar from '../../components/TechnicianNavbar';

const TechnicianRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = () => {
    const data = JSON.parse(localStorage.getItem('technician_ratings') || '[]');
    setRatings(data);
    if (data.length > 0) {
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      setAverageRating(avg);
    } else {
      setAverageRating(0);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <TechnicianNavbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
            <h2 className="text-xl font-medium text-gray-800 flex gap-2"><i className="fas fa-star text-yellow-500"></i> My Ratings & Feedback</h2>
            <div className="bg-indigo-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600">Average Rating:</span>
              <span className="text-2xl font-bold text-indigo-600 ml-2">{averageRating.toFixed(1)}</span>
              <span className="text-yellow-500 ml-1">★</span>
            </div>
          </div>
          {ratings.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No ratings yet. Complete tasks to receive feedback.</p>
          ) : (
            <div className="space-y-4">
              {ratings.map((r) => (
                <div key={r.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Task #{r.taskId}</span>
                        <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{r.feedback}</p>
                      <p className="text-xs text-gray-400 mt-1">{r.createdAt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="text-center text-gray-400 text-xs py-6 border-t mt-12">HOSTELC — Technician Portal</footer>
    </div>
  );
};

export default TechnicianRatings;
