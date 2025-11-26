// Script para reemplazar todos los emojis por iconos de lucide-react
const fs = require('fs');
const path = require('path');

// Mapeo de emojis a nombres de iconos de lucide-react
const emojiToIcon = {
    '💪': { icon: 'Dumbbell', import: 'Dumbbell' },
    '🏃': { icon: 'Activity', import: 'Activity' },
    '🍽️': { icon: 'Utensils', import: 'Utensils' },
    '✨': { icon: 'Sparkles', import: 'Sparkles' },
    '📅': { icon: 'Calendar', import: 'Calendar' },
    '💊': { icon: 'Pill', import: 'Pill' },
    '👑': { icon: 'Crown', import: 'Crown' },
    '🌅': { icon: 'Sunrise', import: 'Sunrise' },
    '☕': { icon: 'Coffee', import: 'Coffee' },
    '🍎': { icon: 'Apple', import: 'Apple' },
    '🌙': { icon: 'Moon', import: 'Moon' },
    '🥗': { icon: 'Salad', import: 'Salad' },
    '💻': { icon: 'Monitor', import: 'Monitor' },
    '🏋️': { icon: 'Dumbbell', import: 'Dumbbell' },
    '🥩': { icon: 'Beef', import: 'Beef' },
    '🍚': { icon: 'Cookie', import: 'Cookie' },
    '🥑': { icon: 'LeafyGreen', import: 'LeafyGreen' },
    '🥦': { icon: 'Broccoli', import: 'Broccoli' },
    '🥛': { icon: 'Milk', import: 'Milk' },
    '🔨': { icon: 'Hammer', import: 'Hammer' },
    '🕐': { icon: 'Clock', import: 'Clock' },
    '🟢': { icon: 'CircleDot', import: 'CircleDot', color: 'green' },
    '🟡': { icon: 'CircleDot', import: 'CircleDot', color: 'yellow' },
    '🔴': { icon: 'CircleDot', import: 'CircleDot', color: 'red' },
    '📉': { icon: 'TrendingDown', import: 'TrendingDown' },
    '⚖️': { icon: 'Scale', import: 'Scale' },
    '🎯': { icon: 'Target', import: 'Target' },
    '👨': { icon: 'User', import: 'User' },
    '👩': { icon: 'User', import: 'User' },
    '⭐': { icon: 'Star', import: 'Star' }
};

// Archivos a procesar
const filesToProcess = [
    'src/components/layout/Navbar.jsx',
    'src/pages/public/Home.jsx',
    'src/components/dieta/CalculadoraNutricional.jsx',
    'src/components/dieta/ConstructorPlatos.jsx',
    'src/pages/public/DetalleDieta.jsx',
    'src/pages/public/CrearDieta.jsx',
    'src/components/common/Badge.jsx'
];

function processFile(filePath) {
    const fullPath = path.join(__dirname, filePath);

    if (!fs.existsSync(fullPath)) {
        console.log(`Archivo no encontrado: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;

    // Detectar qué iconos necesitamos importar
    const iconsNeeded = new Set();

    for (const [emoji, iconInfo] of Object.entries(emojiToIcon)) {
        if (content.includes(emoji)) {
            iconsNeeded.add(iconInfo.import);
        }
    }

    if (iconsNeeded.size === 0) {
        console.log(`No hay emojis para reemplazar en: ${filePath}`);
        return;
    }

    // Añadir import de lucide-react si no existe
    const lucideImport = `import { ${Array.from(iconsNeeded).sort().join(', ')} } from 'lucide-react';`;

    if (!content.includes('lucide-react')) {
        // Buscar la última línea de import
        const importRegex = /^import .+ from .+;$/gm;
        const matches = Array.from(content.matchAll(importRegex));

        if (matches.length > 0) {
            const lastImport = matches[matches.length - 1];
            const insertPosition = lastImport.index + lastImport[0].length;
            content = content.slice(0, insertPosition) + '\n' + lucideImport + content.slice(insertPosition);
        }
    }

    console.log(`Procesando: ${filePath}`);
    console.log(`  Iconos a importar: ${Array.from(iconsNeeded).sort().join(', ')}`);

    // Reemplazar emojis por componentes de icono
    // Nota: Este script NO modifica los archivos, solo muestra lo que se cambiaría
    // Para aplicar los cambios, descomentar fs.writeFileSync al final

    for (const [emoji, iconInfo] of Object.entries(emojiToIcon)) {
        if (content.includes(emoji)) {
            console.log(`    - Encontrado: ${emoji} -> será reemplazado por <${iconInfo.icon} /> en contextos JSX`);
        }
    }

    // NOTA: Los reemplazos reales requieren parsing de JSX para distinguir
    // donde usar <Icon /> vs 'text label'
    // Este es un script de análisis, no de modificación automática

    console.log('');
}

console.log('=== Análisis de Emojis a Reemplazar ===\n');

filesToProcess.forEach(processFile);

console.log('\\nPara aplicar los cambios manualmente, usa los iconos listados arriba.');
console.log('Ejemplo: \\n  {icon && <Icon className="w-4 h-4" />}');
