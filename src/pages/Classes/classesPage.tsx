import React, { useState, useEffect } from 'react';
import Header from '../../components/navbar';
import Footer from '../../components/footer';
import { FaBook } from 'react-icons/fa';
import { Button, Modal } from "react-bootstrap";

interface Classroom {
  id: number;
  className: string;
  classCode: string;
  teacherId: number;
  teacherName: string;
  subjectId: number;
  subjectName: string;
  days: string;
  startTime: string;
  endTime: string;
}

const Classes: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [assignedTeacher, setAssignedTeacher] = useState('');
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [showClassModal, setShowClassModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);

  const handleViewClass = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Missing token");

      const response = await fetch(`https://localhost:7072/api/classroom/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch classroom details');

      const data: Classroom = await response.json();
      setSelectedClass(data);
      setShowClassModal(true);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch class details");
    }
  };

  const handleClassClose = () => setShowClassModal(false);

  // Fetch all classrooms on mount
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://localhost:7072/api/classroom', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch classrooms');
        const data = await response.json();
        setClassrooms(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClassrooms();
  }, []);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedSubject(selected);

    const found = classrooms.find((c) => c.className === selected);
    setAssignedTeacher(found ? found.teacherName : '');
  };

  const handleJoin = () => {
    if (!selectedSubject) {
      alert('Please select a subject to join.');
      return;
    }
    alert(`You have successfully joined ${selectedSubject} with ${assignedTeacher}`);
    setShowModal(false);
    setSelectedSubject('');
    setAssignedTeacher('');
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column p-0 bg-white text-dark">
      <Header />

      <main className="flex-grow-1 py-5 px-4 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          {/* Title section */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white flex items-center space-x-2">
              <FaBook className="text-3xl" />
              <span>My Classes</span>
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow"
            >
              + Join New Class
            </button>
          </div>

          {/* Classroom cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 transition-transform hover:scale-[1.02]"
              >
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Class Name: {c.className}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">Instructor: {c.teacherName}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-3">Subject Name: {c.subjectName}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-3">Class Code: {c.classCode}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-3">Days: {c.days}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-3">Time: {c.startTime} AM - {c.endTime} PM</p>
                <button
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
                  onClick={() => handleViewClass(c.id)}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* Join Class Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-11/12 max-w-md p-6 relative">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Join a New Class</h2>

            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="w-full p-2 border rounded-lg mb-4 text-white"
            >
              <option value="">-- Select a Subject --</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.className}>
                  {c.subjectName}
                </option>
              ))}
            </select>

            {assignedTeacher && (
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 font-medium">Assigned Teacher:</p>
                <p className="text-blue-600 dark:text-blue-400">{assignedTeacher}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleJoin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal show={showClassModal} onHide={handleClassClose}>
        <Modal.Body>
          {selectedClass ? (
            <>
              <p>Class Id: {selectedClass.id}</p>
              <p>Class Name: {selectedClass.className}</p>
              <p>Teacher Id: {selectedClass.teacherId}</p>
              <p>Instructor: {selectedClass.teacherName}</p>
              <p>Subject Id: {selectedClass.subjectId}</p>
              <p>Subject Name: {selectedClass.subjectName}</p>
              <p>Class Code: {selectedClass.classCode}</p>
              <p>Days: {selectedClass.days}</p>
              <p>Time: {selectedClass.startTime} AM - {selectedClass.endTime} PM</p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClassClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Classes;