import { useState } from "react";

const Categories = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Drinks",
      image:
        "https://images.unsplash.com/photo-1600891963934-9609c2c19b0d?w=500",
    },
    {
      id: 2,
      name: "Appetizers",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500",
    },
    {
      id: 3,
      name: "Main Course",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500",
    },
  ]);

  const [newCategory, setNewCategory] = useState({
    name: "",
    image: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategory({
        ...newCategory,
        image: URL.createObjectURL(file), // preview only
      });
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.image) return;
    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: newCategory.name,
        image: newCategory.image,
      },
    ]);
    setNewCategory({ name: "", image: "" });
  };

  const handleDelete = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <div className="p-6 flex-1">
      {/* Add New Category Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-4">Add New Category</h2>
        <div className="space-y-4">
          <label>Category Name </label>
          <input
            type="text"
            placeholder="Enter category name"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />
          <input type="file" onChange={handleFileChange} />
          <button
            onClick={handleAddCategory}
            className="bg-purple-600 text-white px-4 py-2 rounded w-full hover:bg-purple-700"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium">{cat.name}</h3>
              <div className="flex gap-4 text-sm mt-2">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
