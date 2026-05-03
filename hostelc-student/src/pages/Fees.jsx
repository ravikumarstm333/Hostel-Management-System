import { useState } from 'react';
import Navbar from '../components/Navbar';

const Fees = () => {
  const [feeDue, setFeeDue] = useState(28000);
  const [fines, setFines] = useState([{ desc: 'Late night noise complaint', amount: 500 }, { desc: 'Damaged common property', amount: 200 }, { desc: 'Room key lost', amount: 150 }, { desc: 'Mess timings violation', amount: 100 }]);
  const [feeMsg, setFeeMsg] = useState('');
  const [fineMsg, setFineMsg] = useState('');
  const handlePayFee = () => { setFeeDue(0); setFeeMsg('Payment successful! Fee cleared.'); setTimeout(() => setFeeMsg(''), 3000); };
  const handlePayAllFines = () => { setFines([]); setFineMsg('All fines paid!'); setTimeout(() => setFineMsg(''), 3000); };
  return <div className="bg-gray-50 min-h-screen"><Navbar /><main className="max-w-4xl mx-auto px-4 py-8"><div className="bg-white rounded-xl shadow-sm p-6 mb-6"><h2 className="text-xl font-medium text-gray-800">Hostel Fee (Semester)</h2><p className="text-3xl font-semibold mt-2">₹{feeDue}</p><button onClick={handlePayFee} className="mt-3 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"><i className="fas fa-credit-card"></i> Pay Now</button>{feeMsg && <div className="text-sm mt-2 text-green-600">{feeMsg}</div>}</div><div className="bg-white rounded-xl shadow-sm p-6"><h2 className="text-xl font-medium text-gray-800 flex items-center gap-2"><i className="fas fa-gavel text-red-500"></i> Active Fines</h2><div className="mt-4 space-y-3">{fines.length === 0 ? <p className="text-green-600">No pending fines. Great!</p> : fines.map((f, idx) => <div key={idx} className="flex justify-between border-b pb-2"><span className="text-gray-700">{f.desc}</span><span className="font-medium">₹{f.amount}</span></div>)}</div><button onClick={handlePayAllFines} className="mt-4 bg-amber-500 text-white px-5 py-2 rounded-lg hover:bg-amber-600 transition">Pay All Fines</button>{fineMsg && <div className="text-sm mt-2 text-green-600">{fineMsg}</div>}</div><div className="bg-gray-100 rounded-lg p-4 mt-6 text-xs text-gray-600"><i className="fas fa-info-circle"></i> Demo: Fines include late fees, damages, etc. Payment clears them instantly.</div></main><footer className="text-center text-gray-400 text-xs py-6 border-t mt-12">HOSTELC — Student Portal</footer></div>;
};

export default Fees;
