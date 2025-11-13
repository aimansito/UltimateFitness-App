function Input({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  required = false,
  error,
  className = ''
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-uf-red">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-4 py-3 
          border-b-2 
          ${error ? 'border-uf-red' : 'border-uf-gold'} 
          focus:outline-none focus:border-uf-blue 
          transition
          bg-white
        `}
      />
      {error && (
        <p className="text-uf-red text-sm mt-1">{error}</p>
      )}
    </div>
  );
}

export default Input;