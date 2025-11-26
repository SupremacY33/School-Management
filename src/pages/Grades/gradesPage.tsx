import React, { useState, useEffect } from "react";
import Header from "../../components/navbar";
import Footer from "../../components/footer";
import { useNavigate } from "react-router-dom";

const Grades: React.FC = () => {
  const [gradeRecords, setGradeRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  // Extract studentId from JWT
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("Missing token");
  }

  const navigate = useNavigate();


  let studentId: number | null = null;
  if (token) {
    try {
      const parts = token.split(".");
      const payloadBase64 = parts[1] ?? null;
      if (payloadBase64) {
        const decoded = JSON.parse(atob(payloadBase64));
        studentId = Number(decoded?.sub ?? decoded?.nameid ?? null);
      } else {
        studentId = null;
      }
    } catch {
      studentId = null;
    }
  } else {
    studentId = null;
  }

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch(
          `https://localhost:7072/api/Grade/GradeRecordByStudentId/${studentId}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setGradeRecords([]); // no records found
            return;
          }
          throw new Error("Failed to fetch grade records");
        }

        const data = await response.json();
        setGradeRecords(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  // Redirect to dashboard if fetch completed and there are no grade records
  useEffect(() => {
    if (!loading && !error && Array.isArray(gradeRecords) && gradeRecords.length === 0) {
      navigate("/dashboard");
    }
  }, [loading, error, gradeRecords, navigate]);

  if (loading)
    return (
      <div className="text-center py-10 text-lg font-medium">Loading...</div>
    );

  if (error) {
    return (
      <div className="text-center py-3 text-red-600 font-medium">
        {error}
      </div>
    );
  }

  if (!gradeRecords.length)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          No grade found.
        </h2>

        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Go to Home
        </button>
      </div>
    );

  // Convert the API list into UI-friendly format
  const mappedGrades = gradeRecords.map((gr) => ({
    subject: gr.subjectName,
    teacher: gr.teacherName,
    grade: gr.grade,
    marks: ((gr.marksObtained / gr.totalMarks) * 100).toFixed(1),
    remarks: gr.remarks,
    examType: gr.examName,
  }));

  // Normalize exam type values for matching
  const normalize = (value: string) =>
    value.replace(/[\s-]/g, "").toLowerCase();

  // Filtering logic
  const normalizedFilter = normalize(filter);

  const filteredRecords =
    filter === "All"
      ? mappedGrades
      : mappedGrades.filter(
        (x) => normalize(x.examType) === normalizedFilter
      );

  const average = filteredRecords.length
    ? filteredRecords.reduce((acc, g) => acc + Number(g.marks), 0) /
    filteredRecords.length
    : 0;

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column p-0">
      <Header />

      <main className="flex-grow-1 py-5 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
              🎓 My Grades
            </h1>

            <div className="flex items-center gap-3">
              <label
                htmlFor="filter"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Filter by:
              </label>

              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                border border-gray-300 dark:border-gray-600 rounded-lg
                px-3 py-2 text-sm focus:outline-none focus:ring-2
                focus:ring-blue-500 transition"
              >
                <option value="All">All</option>
                <option value="Midterm">Mid-term</option>
                <option value="Finalterm">Final-term</option>
                <option value="Quiz">Quiz</option>
              </select>

              <div className="bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300 font-medium">
                  Avg Score:{" "}
                  <span className="font-bold">
                    {filteredRecords.length === 0
                      ? "N/A"
                      : `${average.toFixed(1)}%`}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <tr>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Teacher</th>
                  <th className="px-6 py-3 text-center">Exam Type</th>
                  <th className="px-6 py-3 text-center">Marks</th>
                  <th className="px-6 py-3 text-center">Grade</th>
                  <th className="px-6 py-3">Remarks</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.length ? (
                  filteredRecords.map((rec, index) => (
                    <tr
                      key={index}
                      className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                    >
                      <td className="px-6 py-3 font-medium">{rec.subject}</td>
                      <td className="px-6 py-3">{rec.teacher}</td>
                      <td className="px-6 py-3 text-center">
                        {rec.examType}
                      </td>
                      <td className="px-6 py-3 text-center">{rec.marks}%</td>
                      <td
                        className={`px-6 py-3 text-center font-semibold ${
                          rec.grade.startsWith("A")
                            ? "text-green-600"
                            : rec.grade.startsWith("B")
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {rec.grade}
                      </td>
                      <td className="px-6 py-3">{rec.remarks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-6 text-gray-500 dark:text-gray-400"
                    >
                      No records found for this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8 bg-teal-50 dark:bg-teal-900/20 rounded-xl p-5 shadow-sm text-center">
            <h2 className="text-lg font-medium text-teal-700 dark:text-teal-300">
              Keep up the great work! 🌟
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Consistent performance leads to success.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Grades;