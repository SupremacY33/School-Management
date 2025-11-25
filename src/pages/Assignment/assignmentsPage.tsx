import React, { useState, useEffect } from "react";
import Header from "../../components/navbar";
import Footer from "../../components/footer";

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [details, setDetails] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  // Extract studentId and name from JWT (if available)
  const token = localStorage.getItem("token");
  let studentId: number | null = null;
  let studentFirstName = "";
  let studentLastName = "";
  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const decoded = JSON.parse(atob(payloadBase64));
      studentId = Number(decoded?.sub ?? decoded?.nameid ?? null);
      studentFirstName = decoded?.given_name ?? decoded?.firstname ?? "";
      studentLastName = decoded?.family_name ?? decoded?.lastname ?? "";
    } catch {
      studentId = null;
    }
  }

  // Load assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("https://localhost:7072/api/Assignment");
        if (!res.ok) throw new Error("Failed to fetch assignments");
        const data = await res.json();
        // Map assignments and keep existing filePath value if present.
        // Also make sure we have a flag to mark this student as submitted (if backend provides filePath)
        const mapped = data.map((a: any) => ({ ...a, studentSubmitted: !!a.filePath }));
        setAssignments(mapped);
      } catch (err) {
        console.error("Error loading assignments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  // View details
  const handleViewDetails = async (id: number) => {
    try {
      const res = await fetch(`https://localhost:7072/api/Assignment/${id}`);
      if (!res.ok) throw new Error("Failed to fetch assignment details");
      const data = await res.json();
      setDetails(data);
      setShowDetailsModal(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load assignment details");
    }
  };

  // Open upload modal
  const handleUploadClick = (assignment: any) => {
    setSelectedAssignment(assignment);
    setShowModal(true);
  };

  // Upload assignment
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    // Build multipart form data according to StudentAssignment API
    formData.append("Id", "0");
    formData.append("StudentId", String(studentId ?? "0"));
    formData.append("AssignmentId", String(selectedAssignment.id));
    formData.append("SubmissionFilePath", "");
    formData.append("SubmittedOn", new Date().toISOString());
    formData.append("StudentFirstName", studentFirstName ?? "");
    formData.append("StudentLastName", studentLastName ?? "");
    formData.append("AssignmentTitle", selectedAssignment.title ?? "");
    formData.append("file", file);

    // Call the StudentAssignment upload endpoint (multipart/form-data)
    try {
      const headers: any = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(
        "https://localhost:7072/api/StudentAssignment/UploadStudentAssignment",
        {
          method: "POST",
          headers,
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      // Try to read returned JSON (may contain submission path/url)
      let respJson: any = {};
      try {
        respJson = await res.json();
      } catch {}

      alert("Assignment uploaded successfully!");
      setShowModal(false);
      setFile(null);

      // Update local assignments state: mark this assignment as submitted for current student
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === selectedAssignment.id
            ? {
                ...a,
                studentSubmitted: true,
                // try to use any path returned by API
                filePath:
                  respJson?.submissionFilePath || respJson?.filePath || a.filePath || "",
              }
            : a
        )
      );
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column p-0 bg-white text-dark">
      <Header />

      <main className="flex-grow-1 py-5 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
              🧾 My Assignments
            </h1>
          </div>

          {loading && <p className="text-center text-gray-600">Loading...</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {assignment.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                  Classroom:{" "}
                  <span className="font-medium">{assignment.classroomName ?? "N/A"}</span>
                </p>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                  Due Date:{" "}
                  <span className="font-medium">
                    {assignment.dueDate?.substring(0, 10)}
                  </span>
                </p>

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleViewDetails(assignment.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    📄 View Details
                  </button>

                  <button
                    onClick={() => handleUploadClick(assignment)}
                    disabled={!!assignment.filePath || !!assignment.studentSubmitted}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      assignment.filePath || assignment.studentSubmitted
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-teal-500 hover:bg-teal-600 text-white"
                    }`}
                  >
                    {assignment.filePath || assignment.studentSubmitted ? "Submitted" : "Upload"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* UPLOAD MODAL */}
      {showModal && selectedAssignment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              📤 Upload Assignment
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {selectedAssignment.title} – {selectedAssignment.classroomName ?? "N/A"}
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Select File
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {showDetailsModal && details && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              📄 Assignment Details
            </h2>

            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Title:</strong> {details.title}
            </p>

            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Description:</strong> {details.description}
            </p>

            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Classroom:</strong> {details.classroomName ?? "N/A"}
            </p>

            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Due Date:</strong> {details.dueDate?.substring(0, 10)}
            </p>

            {(() => {
              const local = assignments.find((a) => a.id === details.id)?.filePath;
              const path = details.filePath || local;
              return (
                path && (
                  <a
                    href={`https://localhost:7072${path}`}
                    target="_blank"
                    className="text-blue-500 underline"
                  >
                    Download File
                  </a>
                )
              );
            })()}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;