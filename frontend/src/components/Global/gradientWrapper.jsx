export default function GradientWrapper({
  children,
  className = "",
  ...props
}) {
  return (
    <div
      className={`bg-gradient-to-r from-emerald-500 to-teal-600 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
