export default function AuthFormButton({ children, handleClick, isLogin }) {
  return (
    <button
      type="button"
      onClick={() => handleClick()}
      className={`flex-1 py-2 rounded-lg font-medium transition text-md
              ${isLogin ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}
    >
      {children}
    </button>
  );
}
