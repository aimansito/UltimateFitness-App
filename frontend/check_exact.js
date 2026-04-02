import fs from 'fs';

const files = [
    "src/pages/public/PoliticaCookies.jsx",
    "src/pages/public/PoliticaPrivacidad.jsx",
    "src/pages/public/RecuperarPassword.jsx",
    "src/pages/public/Register.jsx",
    "src/pages/public/RestablecerPassword.jsx",
    "src/pages/public/Servicios.jsx",
    "src/pages/public/TerminosCondiciones.jsx",
    "src/pages/public/MisPlatos.jsx",
    "src/pages/public/Login.jsx",
    "src/pages/public/Home.jsx",
    "src/pages/user/MisDietas.jsx",
    "src/pages/public/DetalleDieta.jsx",
    "src/pages/public/BlogPost.jsx",
    "src/pages/public/Blog.jsx",
    "src/pages/public/AvisoLegal.jsx",
    "src/pages/user/DashboardUsuario.jsx",
    "src/pages/public/Alimentacion.jsx",
    "src/pages/private/PlanificadorSemanal.jsx",
    "src/pages/entrenador/LoginEntrenador.jsx",
    "src/components/layout/Navbar.jsx",
    "src/components/layout/Footer.jsx",
    "src/components/common/CookieBanner.jsx",
    "src/components/blog/BlogCard.jsx",
    "src/App.jsx"
];

const importRegex = /import\s+{[^}]*Link[^}]*}\s+from\s+['"]react-router-dom['"]/;

for (let file of files) {
    try {
        const content = fs.readFileSync(file, 'utf8');
        if (!importRegex.test(content) && content.includes('<Link')) {
            console.log("BAD FILE MISSING IMPORT:", file);
        }
    } catch (e) {
        console.error("Error reading", file, e.message);
    }
}
console.log("Done");
