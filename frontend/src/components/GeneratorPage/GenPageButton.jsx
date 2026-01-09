export default function GenPageButton({
  children,
  Icon,
  mode,
  className,
  ...props
}) {
  return (
    <button
      className={`${className} w-full py-3 flex gap-3 rounded-xl justify-center flex-wrap items-center transition hover:scale-99 ${mode ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-gray-100" : "text-slate-600 border-slate-300"}`}
      {...props}
    >
      <Icon></Icon>
      <div>{children}</div>
    </button>
  );
}
