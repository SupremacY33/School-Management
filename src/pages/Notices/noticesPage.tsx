import React, { useEffect, useState } from "react";
import Header from "../../components/navbar";
import Footer from "../../components/footer";

interface Notice {
  id: number;
  title: string;
  description: string;
  noticeDate: string;
  postedBy?: string;
}

const Notices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [newNotice, setNewNotice] = useState({
    title: "",
    description: "",
    noticeDate: "",
    postedBy: "Admin",
  });

  // Fetch notices from backend
  const fetchNotices = async () => {
    try {
      const response = await fetch(
        "https://localhost:7072/api/Notice/AllNoticeRecord"
      );

      if (!response.ok) throw new Error("Failed to load notices");

      const data = await response.json();

      const withPostedBy = data.map((item: Notice) => ({
        ...item,
        postedBy: "Admin",
      }));

      setNotices(withPostedBy);
    } catch (err: any) {
      setError(err.message || "Error loading notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateNotice = async () => {
    if (!newNotice.title || !newNotice.noticeDate) {
      alert("Title & Date are required!");
      return;
    }

    const postBody = {
      title: newNotice.title,
      description: newNotice.description,
      noticeDate: newNotice.noticeDate,
    };

    try {
      const response = await fetch(
        "https://localhost:7072/api/Notice/CreateNoticeRecord",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postBody),
        }
      );

      if (!response.ok) throw new Error("Failed to post notice");

      fetchNotices();
      setShowModal(false);

      setNewNotice({
        title: "",
        description: "",
        noticeDate: "",
        postedBy: "Admin",
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const postedByColor = (postedBy: string) => {
    switch (postedBy.toLowerCase()) {
      case "admin":
        return "bg-red-500";
      case "teacher":
        return "bg-yellow-500";
      case "system":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column p-0 bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-grow-1 py-5 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
              📢 School Notices
            </h1>

            <button
              onClick={() => setShowModal(true)}
              className="mt-4 sm:mt-0 px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
            >
              + Add New Notice
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <p className="text-center text-gray-600 dark:text-gray-300">
              Loading notices...
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-center text-red-500 font-semibold">{error}</p>
          )}

          {/* Notices List */}
          <div className="space-y-6">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 border-l-8 border-blue-500 hover:scale-[1.01] transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {notice.title}
                  </h2>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {notice.noticeDate}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  {notice.description}
                </p>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 italic">
                    Posted by:
                    <span
                      className={`ml-2 text-white text-xs px-2 py-1 rounded-full ${postedByColor(
                        notice.postedBy || ""
                      )}`}
                    >
                      {notice.postedBy}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {!loading && notices.length === 0 && (
            <div className="text-center py-10">
              <h3 className="text-gray-600 dark:text-gray-300">
                No notices available at the moment.
              </h3>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* MODAL POPUP */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Create New Notice
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Notice Title"
                value={newNotice.title}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, title: e.target.value })
                }
                className="w-full p-3 rounded border bg-gray-200 text-black"
              />

              <textarea
                placeholder="Description"
                value={newNotice.description}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, description: e.target.value })
                }
                className="w-full p-3 rounded border bg-gray-200 text-black"
              />

              <input
                type="date"
                value={newNotice.noticeDate}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, noticeDate: e.target.value })
                }
                className="w-full p-3 rounded border bg-gray-200 text-black"
              />

              <button
                onClick={handleCreateNotice}
                className="w-full py-2 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Post Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;