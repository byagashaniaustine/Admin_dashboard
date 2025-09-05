import type { FC } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Registration {
  id: number;
  fname: string;
  Lname: string;
  Occupation: string;
  residence: string;
  file_url: string;
  created_at: string;
}

const Admin: FC = () => {
  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<Partial<Registration>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch all users
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/getContent");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update user
  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      const res = await fetch(`/api/editUser/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update");
      await res.json();
      fetchData();
      setForm({});
      setEditingId(null);
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  // Delete user
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/deleteUser/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await res.json();
      fetchData();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white text-shadow-lg p-6 text-center"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
          className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-wide"
        >
          Admin Dashboard
        </motion.h1>
      </motion.header>

      <div className="p-6">
        {/* Edit Form */}
        {editingId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-md rounded-lg p-6 mb-6"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Edit Member
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="border p-3 rounded w-full focus:ring focus:ring-indigo-300"
                value={form.fname || ""}
                onChange={(e) => setForm({ ...form, fname: e.target.value })}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="border p-3 rounded w-full focus:ring focus:ring-indigo-300"
                value={form.Lname || ""}
                onChange={(e) => setForm({ ...form, Lname: e.target.value })}
              />
              <input
                type="text"
                placeholder="Occupation"
                className="border p-3 rounded w-full focus:ring focus:ring-indigo-300"
                value={form.Occupation || ""}
                onChange={(e) => setForm({ ...form, Occupation: e.target.value })}
              />
              <input
                type="text"
                placeholder="Residence"
                className="border p-3 rounded w-full focus:ring focus:ring-indigo-300"
                value={form.residence || ""}
                onChange={(e) => setForm({ ...form, residence: e.target.value })}
              />
              <input
                type="text"
                placeholder="File URL"
                className="border p-3 rounded w-full sm:col-span-2 focus:ring focus:ring-indigo-300"
                value={form.file_url || ""}
                onChange={(e) => setForm({ ...form, file_url: e.target.value })}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setForm({});
                  setEditingId(null);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Members as Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col hover:shadow-xl transition"
            >
              <h2 className="text-lg font-semibold mb-2 text-indigo-700">
                {item.fname} {item.Lname}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Occupation:</span>{" "}
                {item.Occupation}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Residence:</span>{" "}
                {item.residence}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(item.created_at).toLocaleString()}
              </p>
              <a
                href={item.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-blue-500 hover:underline text-sm"
              >
                View File
              </a>

              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => {
                    setForm(item);
                    setEditingId(item.id);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
