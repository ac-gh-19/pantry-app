export default function AuthFormInput({
  labelText,
  type,
  name,
  placeholder,
  value,
  handleChange,
  isInvalid = false,
  isRequired = false,
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {labelText}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        required={isRequired}
        onChange={handleChange}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
            ${
              isInvalid
                ? "border-red-500 focus:ring-red-300"
                : "border-slate-300 focus:ring-emerald-300"
            }
        `}
      />
    </div>
  );
}
