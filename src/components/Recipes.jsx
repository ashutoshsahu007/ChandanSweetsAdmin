// src/components/Recipes.jsx
import { useState } from "react";

const Recipes = () => {
  const [recipes, setRecipes] = useState([
    {
      id: 1,
      name: "Cocktail",
      category: "Unknown",
      price: 200,
      ingredients: ["Alcohol"],
      image:
        "https://images.unsplash.com/photo-1580910051074-3b1f20aebd8b?w=500",
    },
    {
      id: 2,
      name: "Paneer Tikka",
      category: "Appetizers",
      price: 299,
      ingredients: ["Paneer", "Besan", "Chilli Powder"],
      image:
        "https://images.unsplash.com/photo-1622445270398-3d7f54c1fac5?w=500",
    },
    {
      id: 3,
      name: "Paneer Masala",
      category: "Main Course",
      price: 349,
      ingredients: ["Paneer", "Onion", "Tomato", "Ginger", "Garlic", "Spices"],
      image:
        "https://images.unsplash.com/photo-1604908817012-f9d2160a8b7c?w=500",
    },
  ]);

  const [newRecipe, setNewRecipe] = useState({
    name: "",
    category: "",
    ingredients: [""],
    price: "",
    image: "",
  });

  // Handle ingredient change
  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...newRecipe.ingredients];
    updatedIngredients[index] = value;
    setNewRecipe({ ...newRecipe, ingredients: updatedIngredients });
  };

  // Add new ingredient input
  const addIngredientField = () => {
    setNewRecipe({ ...newRecipe, ingredients: [...newRecipe.ingredients, ""] });
  };

  // Handle image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewRecipe({ ...newRecipe, image: URL.createObjectURL(file) });
    }
  };

  // Add Recipe
  const handleAddRecipe = () => {
    if (!newRecipe.name || !newRecipe.category || !newRecipe.price) return;

    setRecipes([
      ...recipes,
      { id: Date.now(), ...newRecipe, price: parseFloat(newRecipe.price) },
    ]);

    // Reset form
    setNewRecipe({
      name: "",
      category: "",
      ingredients: [""],
      price: "",
      image: "",
    });
  };

  // Delete Recipe
  const handleDelete = (id) => {
    setRecipes(recipes.filter((r) => r.id !== id));
  };

  return (
    <div className="p-6 flex-1">
      {/* Add Recipe Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-4">Add New Recipe</h2>
        <div className="space-y-4">
          {/* Recipe Name */}
          <input
            type="text"
            placeholder="Enter recipe name"
            value={newRecipe.name}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, name: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />

          {/* Category */}
          <select
            value={newRecipe.category}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, category: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select a category</option>
            <option value="Drinks">Drinks</option>
            <option value="Appetizers">Appetizers</option>
            <option value="Main Course">Main Course</option>
          </select>

          {/* Ingredients */}
          <div>
            <label className="block font-medium mb-2">Ingredients</label>
            {newRecipe.ingredients.map((ingredient, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Ingredient ${index + 1}`}
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="w-full border rounded px-3 py-2 mb-2"
              />
            ))}
            <button
              onClick={addIngredientField}
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

          {/* Image Upload */}
          <input type="file" onChange={handleFileChange} />

          {/* Add Button */}
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
            key={recipe.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <img
              src={recipe.image}
              alt={recipe.name}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium">{recipe.name}</h3>
              <p className="text-sm text-gray-600">
                Category: {recipe.category}
              </p>
              <p className="text-sm text-gray-600">
                Price: ₹{recipe.price.toFixed(2)}
              </p>
              <p className="mt-2 text-sm font-medium">Ingredients:</p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>

              <div className="flex gap-4 text-sm mt-3">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button
                  onClick={() => handleDelete(recipe.id)}
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

export default Recipes;
