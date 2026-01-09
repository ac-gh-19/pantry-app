import { useState, useEffect } from "react";
import { usePantry } from "../provider/pantry/PantryContext";
import { Plus } from "lucide-react";
import GradientWrapper from "../components/Global/gradientWrapper";
import PantryItemInput from "../components/PantryPage/PantryItemInput";
import PantryButton from "../components/PantryPage/PantryButton";
import PantryItem from "../components/PantryPage/PantryItem";
import ErrorBox from "../components/Global/errorBox";
import PageTitle from "../components/Global/PageTitle";
import { X } from "lucide-react";
import { useMediaQuery } from "../hooks/useMediaQuery";

export default function Pantry() {
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    unit: "pcs",
  });
  const [addingItem, setAddingItem] = useState(false);
  const [addItemError, setAddItemError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  console.log("rerendering");

  const { getAllItems, addItem, deleteItem, pantry, setPantry } = usePantry();

  const isFormFilled = form.name && form.quantity && form.unit;
  const initialForm = {
    name: "",
    quantity: "",
    unit: "pcs",
  };

  useEffect(() => {
    async function getPantry() {
      const res = await getAllItems();
      setPantry(res.data);
      console.log(res.data);
      return res;
    }

    getPantry();
  }, []);

  async function handleAddItem(e) {
    e.preventDefault();
    setAddItemError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const quantity = formData.get("quantity");
    const unit = formData.get("unit");

    try {
      const created = await addItem(name, quantity, unit);

      // update list immediately (no refetch needed)
      setPantry((prev) => (prev ? [created, ...prev] : [created]));

      form.reset();
      setForm(initialForm);
    } catch (err) {
      setAddItemError(err.message || "Failed to add item");
    }
    setLoading(false);
  }

  async function handleDeleteItem(itemId) {
    console.log("Deleting", itemId);
    try {
      await deleteItem(itemId);
      setPantry((prev) => prev.filter((item) => item.id != itemId));
    } catch (err) {
      console.log(err.message || "Failed to delete item");
    }
  }

  return (
    <div className={`h-screen`}>
      <div className="flex mb-8 items-center">
        <PageTitle
          className={`${isDesktop ? "text-3xl" : "text-2xl"}`}
          title={"My Pantry"}
          description={"Manage your ingredients"}
        ></PageTitle>
        <GradientWrapper
          className={`${isDesktop ? "px-6 py-3" : "px-4 py-2"} flex flex-row gap-2 ml-auto rounded-xl truncate transition hover:opacity-90 hover:scale-99 text-slate-100`}
          onClick={() => setAddingItem(!addingItem)}
        >
          <Plus></Plus>
          <button className="">Add Item</button>
        </GradientWrapper>
      </div>

      <div className="flex flex-col">
        {addingItem && (
          <div className="p-5 flex flex-col bg-white rounded-xl shadow-md mb-5">
            <div className="mb-3 text-lg font-semibold flex items-center">
              <div>Add New Item</div>
              <X
                className="ml-auto transition hover:scale-110"
                onClick={() => {
                  setAddingItem(false);
                  setAddItemError(false);
                }}
              ></X>
            </div>
            <form
              id="addItem"
              className="flex flex-wrap bg-white rounded-xl text-md mb-5 gap-5"
              onSubmit={(e) => handleAddItem(e)}
            >
              <PantryItemInput
                name="name"
                type="text"
                placeholder="Chicken"
                value={form.name}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }));
                }}
              ></PantryItemInput>
              <PantryItemInput
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }));
                }}
                name="quantity"
                type="number"
                placeholder="1"
                value={form.quantity}
              ></PantryItemInput>
              <PantryItemInput
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }));
                }}
                name="unit"
                type="select"
                value={form.unit}
                options={[
                  "pcs",
                  "g",
                  "kg",
                  "oz",
                  "lb",
                  "ml",
                  "l",
                  "cup",
                  "tbsp",
                  "tsp",
                  "can",
                  "jar",
                  "bottle",
                  "pack",
                ]}
              ></PantryItemInput>
            </form>
            <div className="flex gap-5 text-white">
              <GradientWrapper
                className={`flex flex-2 rounded-xl justify-center transition ${isFormFilled ? "hover:scale-99" : "opacity-50"}`}
              >
                <PantryButton
                  form="addItem"
                  type="submit"
                  disabled={!isFormFilled && loading}
                >
                  Add to Pantry
                </PantryButton>
              </GradientWrapper>
            </div>
            {addingItem && addItemError && <ErrorBox>{addItemError}</ErrorBox>}
          </div>
        )}
        <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
          {pantry?.map((item) => (
            <PantryItem
              isDesktop={isDesktop}
              key={item.id}
              item={item}
              onDelete={() => handleDeleteItem(item.id)}
            ></PantryItem>
          ))}
        </div>
      </div>
    </div>
  );
}
