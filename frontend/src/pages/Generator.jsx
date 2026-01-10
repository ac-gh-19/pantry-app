import PageTitle from "../components/Global/PageTitle";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { Sparkles } from "lucide-react";
import GenPageButton from "../components/GeneratorPage/GenPageButton";
import GradientWrapper from "../components/Global/gradientWrapper";
import { Funnel } from "lucide-react";
import { useState } from "react";
import { usePantry } from "../provider/pantry/PantryContext";
import GenPageIngredient from "../components/GeneratorPage/GenPageIngredient";
import { Plus } from "lucide-react";
import { X } from "lucide-react";
import ResultBox from "../components/Global/ResultBox";
import { useAuth } from "../provider/auth/AuthContext";
import { Wand2 } from "lucide-react";
import GenPageSection from "../components/GeneratorPage/GenPageSection";
import { Clock4 } from "lucide-react";
import RecipeChip from "../components/GeneratorPage/RecipeChip";
import GenPageSubsection from "../components/GeneratorPage/GenPageSubsection";
import { ToggleLeft } from "lucide-react";
import { ToggleRight } from "lucide-react";

const RECIPE_CHIP_STYLES = {
  easy: "bg-green-100 text-green-600",
  medium: "bg-yellow-100 text-yellow-600",
  hard: "bg-red-100 text-red-600",
  default: "bg-slate-100 text-slate-500 text-sm",
};

const RECIPE_SECTION_HEADER_STYLES = {
  md: "text-md font-semibold mb-2 text-slate-700",
  lg: "text-xl font-bold mb-2",
};

export default function Generator() {
  const [mode, setMode] = useState("random");
  const [selectedItems, setSelectedItems] = useState([]);
  const [genResult, setGenResult] = useState({
    error: false,
    message: "",
    result: false,
  });
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(false);

  const { pantry } = usePantry();
  const { authFetch } = useAuth();

  const availablePantry = pantry.filter(
    (item) => !selectedItems.some((selected) => selected.id === item.id),
  );

  async function handleGenerateRecipes(ids) {
    setLoading(true);
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

      setGenResult({
        error: false,
        message: "Recipe saved successfully!",
        result: true,
      });
    } catch {
      setGenResult({
        error: true,
        message: "Failed to save recipe",
        result: true,
      });
    }
  }

  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <div>
      <div className="mb-8">
        <PageTitle
          title="Generate Recipes"
          description="Create recipes from what you already have"
          className={`${isDesktop ? "text-3xl" : "text-2xl"}`}
        ></PageTitle>
      </div>
      <GenPageSection>
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
              {pantry.length == 0 && (
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
      </GenPageSection>

      {recipes && (
        <>
          <h3 className={`text-xl mb-3 font-bold`}>Generated Recipes</h3>

          {recipes.map((recipe) => (
            <GenPageSection key={recipe.title} className="mb-5">
              <div className="flex items-center ">
                <h4 className={`${RECIPE_SECTION_HEADER_STYLES.lg}`}>
                  {recipe.title}
                </h4>{" "}
                <GradientWrapper className="ml-auto rounded-xl px-4 py-1 text-gray-100 transition hover:scale-97">
                  <Plus onClick={() => handleSaveRecipe(recipe)}></Plus>
                </GradientWrapper>
              </div>
              <div className="flex items-center mb-3 text-slate-500 text-sm">
                <Clock4 className="inline w-5 mr-2"></Clock4>
                {recipe.cooking_time} min
                <RecipeChip
                  className={`mx-3 text-xs ${RECIPE_CHIP_STYLES[recipe.difficulty] || RECIPE_CHIP_STYLES.default}`}
                >
                  {recipe.difficulty}
                </RecipeChip>
              </div>
              <GenPageSubsection>
                <h5 className={`${RECIPE_SECTION_HEADER_STYLES.md}`}>
                  Ingredients Used
                </h5>
                <ul className="flex gap-3">
                  {recipe.ingredients_used.map((ingredient, index) => (
                    <RecipeChip
                      key={index}
                      className={RECIPE_CHIP_STYLES.default}
                    >
                      {ingredient}
                    </RecipeChip>
                  ))}
                </ul>
              </GenPageSubsection>
              {recipe.optional_additions &&
                recipe.optional_additions.length > 0 && (
                  <GenPageSubsection>
                    <h5 className={`${RECIPE_SECTION_HEADER_STYLES.md}`}>
                      Optional Additions
                    </h5>
                    <ul className="flex gap-3">
                      {recipe.optional_additions.map((addition, index) => (
                        <RecipeChip
                          key={index}
                          className={RECIPE_CHIP_STYLES.default}
                        >
                          {addition}
                        </RecipeChip>
                      ))}
                    </ul>
                  </GenPageSubsection>
                )}
              <GenPageSubsection>
                <h5
                  className={`${RECIPE_SECTION_HEADER_STYLES.md} w-max flex gap-2`}
                  onClick={() => {
                    setRecipes((prev) =>
                      prev.map((r) =>
                        r.id === recipe.id
                          ? { ...r, viewInstructions: !r.viewInstructions }
                          : r,
                      ),
                    );
                  }}
                >
                  {recipe.viewInstructions == true
                    ? "Hide Instructions"
                    : "View Instructions"}
                  {recipe.viewInstructions == true ? (
                    <ToggleRight stroke="green" className="ml-1"></ToggleRight>
                  ) : (
                    <ToggleLeft stroke="gray" className="ml-1"></ToggleLeft>
                  )}
                </h5>
                {recipe.viewInstructions == true && (
                  <ul className="text-sm text-slate-700">
                    {recipe.instructions.map((step, index) => (
                      <li key={index}>- {step}</li>
                    ))}
                  </ul>
                )}
              </GenPageSubsection>
            </GenPageSection>
          ))}
        </>
      )}
    </div>
  );
}
