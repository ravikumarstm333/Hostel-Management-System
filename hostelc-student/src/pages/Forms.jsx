import Navbar from '../components/Navbar';
import { generatePDF } from '../utils/pdfHelpers';

const Forms = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-800 flex gap-2">
            <i className="fas fa-file-pdf text-red-500"></i> 
            Download Application Forms (PDF)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Click any button to generate a ready-to-print PDF form.
          </p>
          <div className="grid sm:grid-cols-2 gap-5 mt-6">
            <button 
              onClick={() => generatePDF('Leave Application Form', [
                'Student Name: _________________', 
                'Room Number: _________________', 
                'Leave From (Date): ___________ To: ___________', 
                'Reason for Leave: ________________________________', 
                'Parent/Guardian Contact: _______________________', 
                'Signature: _________________', 
                'Date: _________________'
              ])} 
              className="flex items-center justify-center gap-3 bg-red-50 border border-red-200 px-4 py-3 rounded-xl hover:shadow transition"
            >
              <i className="fas fa-door-open text-red-600 text-xl"></i> 
              <span>Leave Application Form</span>
            </button>
            
            <button 
              onClick={() => generatePDF('Room Change Request', [
                'Student Name: _________________', 
                'Current Room: _________________', 
                'Requested Room: _________________', 
                'Reason for change: ________________________________', 
                'I request the warden to kindly consider my room change.', 
                'Date: _________________', 
                'Student Signature: _________________'
              ])} 
              className="flex items-center justify-center gap-3 bg-blue-50 border border-blue-200 px-4 py-3 rounded-xl hover:shadow transition"
            >
              <i className="fas fa-bed text-blue-600 text-xl"></i> 
              <span>Room Change Request</span>
            </button>
            
            <button 
              onClick={() => generatePDF('Gatepass Undertaking', [
                'Student Name: _________________', 
                'Room Number: _________________', 
                'Out Time: ______ (between 4 PM - 9 PM)', 
                'Expected Return Time: ______', 
                'Purpose: ________________________________', 
                'I confirm that I will return before 9 PM and follow hostel rules.', 
                'Signature: _________________', 
                'Warden Approval: ______'
              ])} 
              className="flex items-center justify-center gap-3 bg-purple-50 border border-purple-200 px-4 py-3 rounded-xl hover:shadow transition"
            >
              <i className="fas fa-passport text-purple-600 text-xl"></i> 
              <span>Gatepass Undertaking</span>
            </button>
            
            <button 
              onClick={() => generatePDF('Medical Leave Form', [
                'Student Name: _________________', 
                'Room Number: _________________', 
                'Nature of illness: _________________', 
                'Recommended rest period: From ______ To ______', 
                'Attach medical certificate if any.', 
                'Parent contact: _________________', 
                'Signature: _________________', 
                'Date: _________________'
              ])} 
              className="flex items-center justify-center gap-3 bg-green-50 border border-green-200 px-4 py-3 rounded-xl hover:shadow transition"
            >
              <i className="fas fa-notes-medical text-green-600 text-xl"></i> 
              <span>Medical Leave Form</span>
            </button>
            
            <button 
              onClick={() => generatePDF('Hostel Transfer Form', [
                'Student Name: _________________', 
                'Current Hostel & Room: _________________', 
                'Requested Hostel & Room: _________________', 
                'Reason for transfer: ________________________________', 
                'Parent/Guardian Consent: _________________', 
                'Signature: _________________', 
                'Date: _________________'
              ])} 
              className="flex items-center justify-center gap-3 bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl hover:shadow transition"
            >
              <i className="fas fa-exchange-alt text-amber-600 text-xl"></i> 
              <span>Hostel Transfer Form</span>
            </button>
          </div>
        </div>
      </main>
      <footer className="text-center text-gray-400 text-xs py-6 border-t mt-12">
        HOSTELC — Student Portal
      </footer>
    </div>
  );
};

export default Forms;