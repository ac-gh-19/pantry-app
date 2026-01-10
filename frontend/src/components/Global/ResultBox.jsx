export default function ResultBox({
  children,
  className,
  fail = false,
  ...props
}) {
  return (
    <div
      className={`mt-2 text-sm ${fail ? "text-red-600 bg-red-50 border border-red-200" : "text-green-600 bg-green-50 border border-green-200"} rounded-lg px-3 py-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
