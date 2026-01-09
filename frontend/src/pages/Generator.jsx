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
import ErrorBox from "../components/Global/errorBox";

export default function Generator() {
  const [mode, setMode] = useState("random");
  const [selectedItems, setSelectedItems] = useState([]);
  const [genError, setGenError] = useState("yeseror");

  const { pantry } = usePantry();

  const availablePantry = pantry.filter(
    (item) => !selectedItems.some((selected) => selected.id === item.id),
  );

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
      <div className="flex-col p-5 shadow-lg rounded-xl bg-white">
        <div className="flex w-full rounded-xl mb-5 gap-5">
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
            onClick={() => setMode("select")}
          >
            Select From Pantry
          </GenPageButton>
        </div>

        <div className="p-5 rounded-xl flex flex-col">
          <h3 className=" font-semibold mb-2">Available Ingredients</h3>
          <div className="flex gap-5 flex-wrap">
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
            <>
              <h3 className=" font-semibold mt-10 mb-2 border-t border-slate-200 pt-4">
                Selected Ingredients
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
            </>
          )}
        </div>
        <GenPageButton Icon={Sparkles} mode={mode} className="mt-5">
          Generate
        </GenPageButton>
        {genError && <ErrorBox className="mt-4">{genError}</ErrorBox>}
      </div>
    </div>
  );
}
