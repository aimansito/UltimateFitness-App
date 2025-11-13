function Card({ children, hover = true, className = '' }) {
  return (
    <div className={`
      bg-uf-dark 
      border-2 border-uf-gold/50 
      rounded-lg 
      overflow-hidden 
      ${hover ? 'hover:border-uf-gold hover:scale-105 transition-all duration-300' : ''} 
      ${className}
    `}>
      {children}
    </div>
  );
}

export default Card;