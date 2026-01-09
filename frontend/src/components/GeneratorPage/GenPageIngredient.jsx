export default function GenPageIngredient({ item, Icon, ...props }) {
  return (
    <div
      className={`rounded-xl px-3 py-2 truncate flex gap-3 text-slate-500 bg-slate-100`}
      {...props}
    >
      {item.name} - {item.quantity} {item.unit}
      {Icon && <Icon className="w-5 transition hover:scale-110"></Icon>}
    </div>
  );
}
