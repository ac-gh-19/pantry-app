export default function AuthFormResult({ children, result }) {
  return (
    <div
      className={`text-sm rounded-lg px-3 py-2 mb-4 ${result === false ? "text-red-600 bg-red-50 border-red-200" : "text-emerald-700 bg-emerald-50 border-emerald-200"}`}
    >
      {children}
    </div>
  );
}
