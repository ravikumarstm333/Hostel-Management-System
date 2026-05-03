import { useEffect, useState } from 'react';
import WardenNavbar from '../../components/WardenNavbar';
import API from '../../api';

const ComplaintsManage = () => {
  const [complaints, setComplaints] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // FETCH DATA
  // =========================
  const fetchData = async () => {
    try {
      const [complaintsRes, techniciansRes] = await Promise.all([
        API.get('/warden/complaints'),
        API.get('/auth/technicians')
      ]);

      setComplaints(complaintsRes.data);
      setTechnicians(techniciansRes.data);

    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ASSIGN TECHNICIAN
  // =========================
  const assignTechnician = async (complaintId, technicianId) => {
    if (!technicianId) return;

    try {
      await API.patch(`/warden/complaints/${complaintId}/assign`, {
        technician_id: technicianId
      });

      alert("✅ Technician assigned successfully");
      fetchData();

    } catch (err) {
      alert("❌ Failed to assign technician");
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/warden/complaints/${id}/status`, {
        status
      });

      alert("✅ Status updated");
      fetchData();

    } catch (err) {
      alert("❌ Failed to update status");
    }
  };

  // =========================
  // GET TECH NAME SAFE
  // =========================
  const getTechName = (assigned) => {
    if (!assigned) return "Not Assigned";
    if (typeof assigned === "object") return assigned.name;

    const tech = technicians.find(t => t._id === assigned);
    return tech ? tech.name : "Not Assigned";
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <WardenNavbar />

      <main className="max-w-7xl mx-auto px-4 py-8">

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">
            Student Complaints Management
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-4">

              {complaints.map((c) => (
                <div
                  key={c._id}
                  className="border rounded-lg p-4 flex justify-between gap-6"
                >

                  {/* ================= LEFT SIDE ================= */}
                  <div className="flex-1 space-y-1">

                    <h3 className="font-semibold text-lg">
                      {c.title}
                    </h3>

                    <p className="text-sm text-gray-600">
                      {c.description}
                    </p>

                    <p className="text-xs text-gray-400">
                      Category: {c.category || "General"}
                    </p>

                    <p className="text-xs text-indigo-600">
                      Assigned: {getTechName(c.assigned_to)}
                    </p>

                  </div>

                  {/* ================= RIGHT SIDE ================= */}
                  <div className="w-[220px] flex flex-col gap-2">

                    {/* STATUS */}
                    <select
                      value={c.status}
                      onChange={(e) => updateStatus(c._id, e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="ASSIGNED">ASSIGNED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>

                    {/* TECHNICIAN ASSIGN */}
                    <select
                      value={
                        (c.assigned_to && typeof c.assigned_to === "object")
                          ? c.assigned_to._id
                          : c.assigned_to || ''
                      }
                      onChange={(e) =>
                        assignTechnician(c._id, e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    >
                      <option value="">Assign Technician</option>

                      {technicians.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name}
                        </option>
                      ))}
                    </select>

                  </div>

                </div>
              ))}

              {complaints.length === 0 && (
                <p className="text-center text-gray-400">
                  No complaints found
                </p>
              )}

            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default ComplaintsManage;