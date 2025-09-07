import { useState, useEffect } from "react";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ title: "", image: "" });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", image: "" });

  const BASE_URL =
    "https://restro-a8f84-default-rtdb.firebaseio.com/categories";

  // Fetch all categories
  useEffect(() => {
    fetch(`${BASE_URL}.json`)
      .then((res) => res.json())
      .then((data) => {
        const loaded = Object.entries(data || {}).map(([key, value]) => ({
          firebaseId: key,
          ...value,
        }));
        setCategories(loaded);
      });
  }, []);

  // Add Category
  const addCategory = async () => {
    if (!newCategory.title || !newCategory.image) return;

    const category = { ...newCategory, id: Date.now() };
    const res = await fetch(`${BASE_URL}.json`, {
      method: "POST",
      body: JSON.stringify(category),
    });

    const data = await res.json(); // Firebase returns { name: "-Nxyz123" }
    const firebaseId = data.name;

    setCategories([...categories, { ...category, firebaseId }]);
    setNewCategory({ title: "", image: "" });
  };

  // Delete Category
  const deleteCategory = async (firebaseId) => {
    await fetch(`${BASE_URL}/${firebaseId}.json`, { method: "DELETE" });
    setCategories(categories.filter((c) => c.firebaseId !== firebaseId));
  };

  // Update Category
  const updateCategory = async (firebaseId, updated) => {
    await fetch(`${BASE_URL}/${firebaseId}.json`, {
      method: "PATCH",
      body: JSON.stringify(updated),
    });
    setCategories(
      categories.map((c) =>
        c.firebaseId === firebaseId ? { ...c, ...updated } : c
      )
    );
  };

  // Start editing
  const startEdit = (c) => {
    setEditingId(c.firebaseId);
    setEditData({ title: c.title, image: c.image });
  };

  // Save editing
  const saveEdit = () => {
    updateCategory(editingId, editData);
    setEditingId(null);
    setEditData({ title: "", image: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        ⚙️ Manage Categories
      </h2>

      {/* Add Form */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={newCategory.title}
          onChange={(e) =>
            setNewCategory({ ...newCategory, title: e.target.value })
          }
          className="border rounded px-3 py-2 flex-1"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newCategory.image}
          onChange={(e) =>
            setNewCategory({ ...newCategory, image: e.target.value })
          }
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={addCategory}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add
        </button>
      </div>

      {/* Table */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Title</th>
            <th className="p-3">Image</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.firebaseId} className="border-b">
              <td className="p-3">
                {editingId === c.firebaseId ? (
                  <input
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  c.title
                )}
              </td>
              <td className="p-3">
                {editingId === c.firebaseId ? (
                  <input
                    value={editData.image}
                    onChange={(e) =>
                      setEditData({ ...editData, image: e.target.value })
                    }
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-20 h-12 object-cover rounded"
                  />
                )}
              </td>
              <td className="p-3">
                {editingId === c.firebaseId ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="ml-2 px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => deleteCategory(c.firebaseId)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => startEdit(c)}
                      className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
