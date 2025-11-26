import { Crown } from 'lucide-react';

function Badge({ type = 'premium', text, showIcon = true }) {
  const styles = {
    premium: 'bg-gradient-to-r from-uf-red to-red-600 text-white',
    free: 'bg-gray-500 text-white',
    basic: 'bg-uf-blue text-white',
  };

  return (
    <span className={`${styles[type]} px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider inline-flex items-center shadow-lg`}>
      {showIcon && type === 'premium' && <Crown className="w-4 h-4 mr-2" />}
      {text}
    </span>
  );
}

export default Badge;