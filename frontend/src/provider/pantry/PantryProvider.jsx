import { useAuth } from "../auth/AuthContext";
import { PantryContext } from "./PantryContext";

export function PantryProvider({ children }) {
  const { authFetch } = useAuth();

  async function getAllItems() {
    const res = await authFetch("/api/pantry");
    console.log(res);
    return res;
  }

  async function addItem(name, quantity, unit) {
    const res = await authFetch("/api/pantry", {
      method: "POST",
      // headers: { "Content-Type": "application/json" },
      body: {
        name,
        quantity: Number(quantity), // backend will Number(...) it
        unit,
      },
    });

    if (!res.ok) {
      const message = res.error.message || "Failed to add item";
      throw new Error(message);
    }

    return res.data;
  }

  async function deleteItem(itemId) {
    const res = await authFetch(`/api/pantry/${itemId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const message = res.error.message || "Failed to delete Item";
      throw new Error(message);
    }

    return res.data;
  }

  const value = {
    getAllItems,
    addItem,
    deleteItem,
  };

  return (
    <PantryContext.Provider value={value}>{children}</PantryContext.Provider>
  );
}
