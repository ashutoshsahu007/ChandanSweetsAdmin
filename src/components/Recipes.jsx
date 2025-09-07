// src/components/Recipes.jsx
import React, { useEffect, useState } from "react";

const FIREBASE_URL = "https://restro-a8f84-default-rtdb.firebaseio.com";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);

  const defaultNew = {
    name: "",
    category: "",
    ingredients: [""],
    price: "",
    image: "", // only URL
  };

  const [newRecipe, setNewRecipe] = useState(defaultNew);

  // For editing
  const [editingId, setEditingId] = useState(null);
  const [editRecipe, setEditRecipe] = useState(defaultNew);

  // Load categories & recipes
  useEffect(() => {
    fetch(`${FIREBASE_URL}/categories.json`)
      .then((res) => res.json())
      .then((data) => {
        if (!data) return setCategories([]);
        const loaded = Object.entries(data).map(([key, val]) => ({
          firebaseId: key,
          ...val,
        }));
        setCategories(loaded);
      });

    fetch(`${FIREBASE_URL}/recipes.json`)
      .then((res) => res.json())
      .then((data) => {
        if (!data) return setRecipes([]);
        const loaded = Object.entries(data).map(([key, val]) => ({
          firebaseId: key,
          ...val,
        }));
        setRecipes(loaded);
      });
  }, []);

  /* -------------------- Add new recipe -------------------- */

  const handleNewIngredientChange = (index, value) => {
    const updated = [...newRecipe.ingredients];
    updated[index] = value;
    setNewRecipe({ ...newRecipe, ingredients: updated });
  };

  const addNewIngredientField = () => {
    setNewRecipe({
      ...newRecipe,
      ingredients: [...newRecipe.ingredients, ""],
    });
  };

  const removeNewIngredient = (index) => {
    const updated = newRecipe.ingredients.filter((_, i) => i !== index);
    setNewRecipe({
      ...newRecipe,
      ingredients: updated.length ? updated : [""],
    });
  };

  const resetNew = () => setNewRecipe(defaultNew);

  const handleAddRecipe = async () => {
    if (!newRecipe.name || !newRecipe.category || !newRecipe.price) return;

    const payload = {
      name: newRecipe.name,
      category: newRecipe.category,
      ingredients: newRecipe.ingredients.filter((i) => i && i.trim()),
      price: parseFloat(newRecipe.price),
      image: newRecipe.image,
      id: Date.now().toString(),
    };

    const res = await fetch(`${FIREBASE_URL}/recipes.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const firebaseId = data.name;

    setRecipes((prev) => [...prev, { ...payload, firebaseId }]);
    resetNew();
  };

  /* -------------------- Delete -------------------- */

  const handleDelete = async (firebaseId) => {
    if (!confirm("Delete this recipe?")) return;
    await fetch(`${FIREBASE_URL}/recipes/${firebaseId}.json`, {
      method: "DELETE",
    });
    setRecipes((prev) => prev.filter((r) => r.firebaseId !== firebaseId));
    if (editingId === firebaseId) {
      setEditingId(null);
      setEditRecipe(defaultNew);
    }
  };

  /* -------------------- Edit -------------------- */

  const startEdit = (recipe) => {
    setEditingId(recipe.firebaseId);
    setEditRecipe({
      name: recipe.name || "",
      category: recipe.category || "",
      ingredients: Array.isArray(recipe.ingredients)
        ? recipe.ingredients
        : [""],
      price: recipe.price != null ? recipe.price.toString() : "",
      image: recipe.image || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRecipe(defaultNew);
  };

  const handleEditIngredientChange = (index, value) => {
    const updated = [...editRecipe.ingredients];
    updated[index] = value;
    setEditRecipe({ ...editRecipe, ingredients: updated });
  };

  const addEditIngredientField = () => {
    setEditRecipe({
      ...editRecipe,
      ingredients: [...editRecipe.ingredients, ""],
    });
  };

  const removeEditIngredient = (index) => {
    const updated = editRecipe.ingredients.filter((_, i) => i !== index);
    setEditRecipe({
      ...editRecipe,
      ingredients: updated.length ? updated : [""],
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!editRecipe.name || !editRecipe.category || !editRecipe.price) return;

    const payload = {
      name: editRecipe.name,
      category: editRecipe.category,
      ingredients: editRecipe.ingredients.filter((i) => i && i.trim()),
      price: parseFloat(editRecipe.price),
      image: editRecipe.image,
    };

    await fetch(`${FIREBASE_URL}/recipes/${editingId}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setRecipes((prev) =>
      prev.map((r) => (r.firebaseId === editingId ? { ...r, ...payload } : r))
    );

    setEditingId(null);
    setEditRecipe(defaultNew);
  };

  /* -------------------- Render -------------------- */

  return (
    <div className="p-6 flex-1">
      {/* Add Recipe Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-4 text-xl">Add New Recipe</h2>

        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Enter recipe name"
            value={newRecipe.name}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, name: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />

          <select
            value={newRecipe.category}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, category: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option
                key={cat.firebaseId}
                value={cat.title || cat.name || cat.id}
              >
                {cat.title || cat.name || cat.id}
              </option>
            ))}
          </select>

          {/* Ingredients */}
          <div>
            <label className="block font-medium mb-2">Ingredients</label>
            {newRecipe.ingredients.map((ing, index) => (
              <div key={index} className="flex gap-2 items-center mb-2">
                <input
                  type="text"
                  placeholder={`Ingredient ${index + 1}`}
                  value={ing}
                  onChange={(e) =>
                    handleNewIngredientChange(index, e.target.value)
                  }
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  onClick={() => removeNewIngredient(index)}
                  className="px-2 py-1 bg-red-100 text-red-700 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={addNewIngredientField}
              className="text-purple-600 text-sm hover:underline"
            >
              + Add Ingredient
            </button>
          </div>

          {/* Price */}
          <input
            type="number"
            placeholder="₹ 0.00"
            value={newRecipe.price}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, price: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />

          {/* Image URL only */}
          <input
            type="text"
            placeholder="Image URL"
            value={newRecipe.image}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, image: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />

          {newRecipe.image ? (
            <img
              src={newRecipe.image}
              alt="preview"
              className="h-40 w-full object-cover rounded"
            />
          ) : null}

          <button
            onClick={handleAddRecipe}
            className="bg-purple-600 text-white px-4 py-2 rounded w-full hover:bg-purple-700"
          >
            Add Recipe
          </button>
        </div>
      </div>

      {/* Recipes List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.firebaseId}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <img
              src={recipe.image}
              alt={recipe.name}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              {editingId === recipe.firebaseId ? (
                <>
                  <input
                    type="text"
                    value={editRecipe.name}
                    onChange={(e) =>
                      setEditRecipe({ ...editRecipe, name: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 mb-2"
                  />

                  <select
                    value={editRecipe.category}
                    onChange={(e) =>
                      setEditRecipe({ ...editRecipe, category: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 mb-2"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option
                        key={cat.firebaseId}
                        value={cat.title || cat.name || cat.id}
                      >
                        {cat.title || cat.name || cat.id}
                      </option>
                    ))}
                  </select>

                  <div className="mb-2">
                    <label className="block font-medium mb-2">
                      Ingredients
                    </label>
                    {editRecipe.ingredients.map((ing, idx) => (
                      <div key={idx} className="flex gap-2 items-center mb-2">
                        <input
                          value={ing}
                          onChange={(e) =>
                            handleEditIngredientChange(idx, e.target.value)
                          }
                          className="flex-1 border rounded px-3 py-2"
                        />
                        <button
                          onClick={() => removeEditIngredient(idx)}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addEditIngredientField}
                      className="text-purple-600 text-sm hover:underline"
                    >
                      + Add Ingredient
                    </button>
                  </div>

                  <input
                    type="number"
                    value={editRecipe.price}
                    onChange={(e) =>
                      setEditRecipe({ ...editRecipe, price: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 mb-2"
                  />

                  <input
                    type="text"
                    placeholder="Image URL"
                    value={editRecipe.image}
                    onChange={(e) =>
                      setEditRecipe({ ...editRecipe, image: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 mb-2"
                  />

                  {editRecipe.image ? (
                    <img
                      src={editRecipe.image}
                      alt="preview"
                      className="h-36 w-full object-cover rounded mb-2"
                    />
                  ) : null}

                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-medium">{recipe.name}</h3>
                  <p className="text-sm text-gray-600">
                    Category: {recipe.category}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: ₹{recipe.price}
                  </p>
                  <p className="mt-2 text-sm font-medium">Ingredients:</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 mb-3">
                    {Array.isArray(recipe.ingredients) &&
                      recipe.ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                  </ul>

                  <div className="flex gap-4 text-sm mt-3">
                    <button
                      onClick={() => startEdit(recipe)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(recipe.firebaseId)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
