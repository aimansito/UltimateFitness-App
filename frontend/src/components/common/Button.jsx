function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  type = 'button',
  disabled = false,
  className = ''
}) {
  const baseStyles = 'font-bold uppercase tracking-wider transition transform hover:scale-105 rounded';
  
  const variants = {
    primary: 'bg-uf-gold text-black hover:bg-uf-blue hover:text-white',
    secondary: 'bg-uf-blue text-white hover:bg-uf-gold hover:text-black',
    outline: 'border-2 border-uf-gold text-uf-gold hover:bg-uf-gold hover:text-black',
    danger: 'bg-uf-red text-white hover:bg-red-700',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;