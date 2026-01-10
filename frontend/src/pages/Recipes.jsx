import { useEffect, useState } from "react";
import ResultBox from "../components/Global/ResultBox";
import { useAuth } from "../provider/auth/AuthContext";
import PageTitle from "../components/Global/PageTitle";
import { useMediaQuery } from "../hooks/useMediaQuery";
import RecipeCard from "../components/Global/RecipeCard";
import { Trash2 } from "lucide-react";

export default function Recipes() {
  const [genResult, setGenResult] = useState({
    error: false,
    message: "",
    result: false,
  });
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  console.log(recipes);

  const { authFetch } = useAuth();

  useEffect(() => {
    async function getRecipes() {
      setLoading(true);
      try {
        const res = await authFetch("/api/recipes", {
          method: "GET",
        });

        if (!res.ok) {
          const message = res.error?.message || "Failed to fetch recipes";
          throw new Error(message);
        }

        setRecipes(
          res.data.map((recipe) => ({
            ...recipe,
            viewInstructions: true,
          })),
        );
      } catch (err) {
        setGenResult({
          error: true,
          message: err.message || "Failed to fetch recipes",
          result: true,
        });
      }
      setLoading(false);
    }
    getRecipes();
  }, [authFetch]);

  async function handleDeleteRecipe(recipeId) {
    setLoading(true);
    try {
      const res = await authFetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const message = "Failed to delete recipe";
        throw new Error(message);
      }

      setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
    } catch (err) {
      setGenResult({
        error: true,
        message: err.message || "Failed to delete recipe",
        result: true,
      });
    }
    setLoading(false);
  }

  return (
    <div>
      <PageTitle
        title="My Recipes"
        description="View and manage your saved recipes"
        className={`${isDesktop ? "text-3xl" : "text-2xl"}`}
      />
      {genResult.result == true && (
        <ResultBox show={genResult.result} error={genResult.error}>
          {genResult.message}
        </ResultBox>
      )}

      {recipes?.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          TopRightIcon={Trash2}
          className="bg-emerald-50"
          setRecipes={setRecipes}
          handleTopRightClick={() => handleDeleteRecipe(recipe.id)}
        />
      ))}
    </div>
  );
}
