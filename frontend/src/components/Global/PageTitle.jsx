export default function PageTitle({ className = "", title, description }) {
  return (
    <div>
      <h1 className={`font-bold mb-2 ${className}`}>{title}</h1>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
