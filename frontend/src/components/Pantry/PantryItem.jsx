import { Package, Trash2 } from "lucide-react";
import { Pen } from "lucide-react";

export default function PantryItem({ item, onDelete }) {
  const displayName = item.name.charAt(0).toUpperCase() + item.name.slice(1);

  return (
    <div className="p-5 bg-white shadow-sm flex rounded-xl gap-3 items-center flex-wrap">
      <div className="p-3 bg-emerald-200 rounded-xl">
        <Package stroke="green"></Package>
      </div>
      <div className="flex flex-col">
        <h3 className="text-xl">{displayName}</h3>
        <p className="text-slate-400">
          {item.quantity} {item.unit}
        </p>
      </div>
      <div className="flex ml-auto gap-3 items-center">
        <Pen className="transition hover:scale-105" stroke="gray"></Pen>
        <Trash2
          className="transition hover:scale-105"
          stroke="gray"
          onClick={onDelete}
        ></Trash2>
      </div>
    </div>
  );
}
