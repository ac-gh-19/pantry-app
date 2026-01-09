export default function AddItemButton({ className = "", children, ...props }) {
  return (
    <button className={`rounded-xl p-3 ${className} `} {...props}>
      {children}
    </button>
  );
}
