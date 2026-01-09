export default function RecipeChip({ children, className }) {
  return (
    <div className={`rounded-xl px-3 py-1 truncate flex gap-3 ${className}`}>
      {children}
    </div>
  );
}
