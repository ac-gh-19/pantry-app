export default function PantryButton({
  name,
  placeholder,
  type,
  value,
  children,
  options = [],
  ...props
}) {
  if (type != "select")
    return (
      <input
        name={name}
        value={value}
        placeholder={placeholder}
        type={type}
        className="flex-1 border rounded-xl p-3 border-slate-300"
        {...props}
      >
        {children}
      </input>
    );

  return (
    <select
      className="flex-1 border rounded-xl p-3 border-slate-300"
      name={name}
      value={value}
      {...props}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
