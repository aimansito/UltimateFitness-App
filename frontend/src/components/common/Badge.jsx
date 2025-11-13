function Badge({ type = 'premium', text, icon }) {
  const styles = {
    premium: 'bg-gradient-to-r from-uf-red to-red-600 text-white',
    free: 'bg-gray-500 text-white',
    basic: 'bg-uf-blue text-white',
  };

  return (
    <span className={`${styles[type]} px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider inline-flex items-center shadow-lg`}>
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </span>
  );
}

export default Badge;