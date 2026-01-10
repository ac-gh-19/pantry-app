import PageTitle from "../components/Global/PageTitle";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { Sparkles } from "lucide-react";
import GenPageButton from "../components/GeneratorPage/GenPageButton";
import { Funnel } from "lucide-react";
import { useState } from "react";
import { usePantry } from "../provider/pantry/PantryContext";
import GenPageIngredient from "../components/GeneratorPage/GenPageIngredient";
import { Plus } from "lucide-react";
import { X } from "lucide-react";
import ResultBox from "../components/Global/ResultBox";
import { useAuth } from "../provider/auth/AuthContext";
import { Wand2 } from "lucide-react";
import PageSection from "../components/Global/PageSection";
import RecipeCard from "../components/Global/RecipeCard";
import { useGenerator } from "../provider/generator/GeneratorContext";

export default function Generator() {
  const [mode, setMode] = useState("random");
  const [selectedItems, setSelectedItems] = useState([]);
  const [genResult, setGenResult] = useState({
    error: false,
    message: "",
    result: false,
  });
  const [loading, setLoading] = useState(false);

  const { pantry } = usePantry();
  const { authFetch } = useAuth();
  const { recipes, setRecipes } = useGenerator();

  const availablePantry = pantry.filter(
    (item) => !selectedItems.some((selected) => selected.id === item.id),
  );

  async function handleGenerateRecipes(ids) {
    setLoading(true);
    setGenResult({ error: false, message: "", result: false });
    try {
      const res =
        mode === "select"
          ? await authFetch("/api/recipes/generate", {
              method: "POST",
              body: {
                selectedItemIds: ids,
                mode: "select",
              },
            })
          : await authFetch("/api/recipes/generate", {
              method: "POST",
            });

      if (!res.ok) {
        const message = res.error?.message || "Failed to generate recipes";
        throw new Error(message);
      }

      const recipes = res.data.map((recipe) => ({
        ...recipe,
        viewInstructions: true,
      }));

      setRecipes(recipes);
      setGenResult({
        error: false,
        message: "Recipes generated!",
        result: true,
      });
    } catch (err) {
      setGenResult({
        error: true,
        message: err.message || "Failed to generate recipes",
        result: true,
      });
    }
    setLoading(false);
  }

  async function handleSaveRecipe(recipe) {
    setLoading(true);
    try {
      const res = await authFetch("/api/recipes", {
        method: "POST",
        body: {
          title: recipe.title,
          ingredients_used: recipe.ingredients_used,
          instructions: recipe.instructions,
          cooking_time: recipe.cooking_time,
          difficulty: recipe.difficulty,
          optional_additions: recipe.optional_additions,
        },
      });

      if (!res.ok) {
        const message = res.error?.message || "Failed to save recipe";
        throw new Error(message);
      }

      alert(`${recipe.title} saved successfully`);
    } catch {
      setGenResult({
        error: true,
        message: "Failed to save recipe",
        result: true,
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setGenResult({ error: false, message: "", result: false });
      }, 3000);
    }
  }

  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <div>
      <PageTitle
        title="Generate Recipes"
        description="Create recipes from what you already have"
        className={`${isDesktop ? "text-3xl" : "text-2xl"}`}
      ></PageTitle>
      <PageSection>
        <div className="flex w-full rounded-xl mb-5 gap-5 p-1 bg-slate-200">
          <GenPageButton
            Icon={Sparkles}
            mode={mode === "random"}
            onClick={() => {
              setMode("random");
            }}
          >
            Use All Items
          </GenPageButton>
          <GenPageButton
            Icon={Funnel}
            mode={mode === "select"}
            onClick={() => {
              setMode("select");
            }}
          >
            Select From Pantry
          </GenPageButton>
        </div>

        <div className="flex flex-col">
          <div></div>
          <h3 className=" font-semibold mb-2">
            Available Ingredients
            <div>
              {(pantry.length == 0 || availablePantry.length == 0) && (
                <span className="text-sm font-normal text-slate-500">
                  Add items to your pantry
                </span>
              )}
            </div>
          </h3>
          <div className="flex gap-5 flex-wrap mb-5">
            {mode == "select"
              ? availablePantry.map((item) => (
                  <GenPageIngredient
                    key={item.id}
                    item={item}
                    Icon={Plus}
                    onClick={() => {
                      setSelectedItems((prev) =>
                        prev ? [...prev, { ...item }] : [{ ...item }],
                      );
                    }}
                  ></GenPageIngredient>
                ))
              : pantry.map((item) => (
                  <GenPageIngredient
                    key={item.id}
                    item={item}
                    onClick={() => {
                      setSelectedItems((prev) =>
                        prev ? [...prev, { ...item }] : [{ ...item }],
                      );
                    }}
                  ></GenPageIngredient>
                ))}
          </div>
          {mode == "select" && (
            <div className="mb-8">
              <h3 className=" font-semibold mb-2">
                Selected Ingredients
                <div>
                  {selectedItems.length == 0 && (
                    <span className="text-sm font-normal text-slate-500">
                      Select items to generate recipes
                    </span>
                  )}
                </div>
              </h3>

              <div className="flex gap-5 flex-wrap">
                {selectedItems.map((item) => (
                  <GenPageIngredient
                    key={item.name}
                    item={item}
                    Icon={X}
                    onClick={() => {
                      setSelectedItems((prev) =>
                        prev.filter((i) => i.id != item.id),
                      );
                    }}
                  ></GenPageIngredient>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          className={`px-5 py-3 flex gap-3 rounded-xl justify-center flex-wrap items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-gray-100 ${loading ? "disabled opacity-65" : "transition hover:scale-99"}`}
          onClick={() => {
            mode === "random"
              ? handleGenerateRecipes(pantry.map((item) => item.id))
              : handleGenerateRecipes(selectedItems.map((item) => item.id));
          }}
        >
          <Wand2></Wand2>
          <div>{loading ? "Loading..." : "Generate"}</div>
        </button>
        {genResult.result == true && (
          <ResultBox fail={genResult.error} className="mt-4 flex items-center">
            {genResult.message}
            <X
              className="w-5 items-center ml-auto"
              onClick={() => setGenResult(false)}
            ></X>
          </ResultBox>
        )}
      </PageSection>

      {recipes && (
        <>
          <h3 className={`text-xl mb-3 font-bold`}>Generated Recipes</h3>

          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.title}
              recipe={recipe}
              TopRightIcon={Plus}
              handleTopRightClick={() => handleSaveRecipe(recipe)}
              setRecipes={setRecipes}
              loading={loading}
            ></RecipeCard>
          ))}
        </>
      )}
    </div>
  );
}
