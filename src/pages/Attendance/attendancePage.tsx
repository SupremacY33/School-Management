import React, { useEffect, useState } from 'react';
import Header from '../../components/navbar';
import Footer from '../../components/footer';

interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  classroomId: number;
  classroomName: string;
  date: string;
  status: string;
  remarks: string;
}

const Attendance: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('November 2025');
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const studentId = 2; // Replace with actual logged-in student ID or dynamic value

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://localhost:7072/api/Attendance/AttendanceRecordThroughStudentId/${studentId}`
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data: AttendanceRecord[] = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error('Failed to fetch attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [studentId]);

  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter((a) => a.status === 'Present').length;
  const absentDays = attendanceData.filter((a) => a.status === 'Absent').length;
  const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : '0';

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column p-0">
      <Header />

      <main className="flex-grow-1 py-5 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
              📅 Attendance Record
            </h1>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="mt-3 sm:mt-0 border border-gray-400 rounded-lg px-3 py-2 bg-gray-100 text-black"
            >
              <option>November 2025</option>
              <option>October 2025</option>
              <option>September 2025</option>
            </select>
          </div>

          {loading ? (
            <p className="text-center text-gray-600 dark:text-gray-300">Loading attendance...</p>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow text-center">
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Total Days</h3>
                  <p className="text-2xl font-bold text-blue-600">{totalDays}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl shadow text-center">
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Present</h3>
                  <p className="text-2xl font-bold text-green-600">{presentDays}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl shadow text-center">
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Absent</h3>
                  <p className="text-2xl font-bold text-red-600">{absentDays}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-xl shadow text-center">
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Attendance %</h3>
                  <p className="text-2xl font-bold text-yellow-600">{percentage}%</p>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    <tr>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Classroom</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((record) => (
                      <tr
                        key={record.id}
                        className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                      >
                        <td className="px-6 py-3">{record.date}</td>
                        <td className="px-6 py-3">{record.classroomName}</td>
                        <td
                          className={`px-6 py-3 font-semibold ${
                            record.status === 'Present'
                              ? 'text-green-600'
                              : record.status === 'Absent'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          {record.status}
                        </td>
                        <td className="px-6 py-3">{record.remarks || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Attendance;