export default function ErrorBox({ children, className, ...props }) {
  return (
    <div
      className={`mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
