export function Input({ type = "text", placeholder, value, onChange }) {
    return (
      <input
        type={type}
        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    );
  }
  