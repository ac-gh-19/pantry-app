import PageSection from "./PageSection";
import GradientWrapper from "./gradientWrapper";
import { Clock4 } from "lucide-react";
import RecipeChip from "../GeneratorPage/RecipeChip";
import { ToggleRight } from "lucide-react";
import { ToggleLeft } from "lucide-react";
import GenPageSubsection from "../GeneratorPage/GenPageSubsection";

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

export default function RecipeCard({
  recipe,
  TopRightIcon,
  handleTopRightClick,
  setRecipes,
  loading,
}) {
  return (
    <PageSection key={recipe.title} className="mb-5">
      <div className="flex items-center ">
        <h4 className={`${RECIPE_SECTION_HEADER_STYLES.lg}`}>{recipe.title}</h4>{" "}
        <GradientWrapper
          className={`ml-auto rounded-xl px-4 py-1 text-gray-100 transition hover:scale-97 ${loading ? "opacity-50 pointer-events-none disabled" : ""}`}
          onClick={handleTopRightClick}
        >
          {TopRightIcon && <TopRightIcon></TopRightIcon>}
        </GradientWrapper>
      </div>
      <div className="flex items-center mb-3 text-slate-500 text-sm">
        <Clock4 className="inline w-5 mr-2"></Clock4>
        {recipe.cooking_time}
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
            <RecipeChip key={index} className={RECIPE_CHIP_STYLES.default}>
              {ingredient}
            </RecipeChip>
          ))}
        </ul>
      </GenPageSubsection>
      {recipe.optional_additions && recipe.optional_additions.length > 0 && (
        <GenPageSubsection>
          <h5 className={`${RECIPE_SECTION_HEADER_STYLES.md}`}>
            Optional Additions
          </h5>
          <ul className="flex gap-3">
            {recipe.optional_additions.map((addition, index) => (
              <RecipeChip key={index} className={RECIPE_CHIP_STYLES.default}>
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
    </PageSection>
  );
}
