// Contenido de los 5 vídeos y los 5 carruseles. Es lo único que hay que editar.
//
// VÍDEOS: cada frase es un plano. `texto` es lo que sale en los subtítulos; `voz` (opcional) es
// cómo se pronuncia cuando no coincide (marcas, siglas). Debe tener el mismo número de palabras
// para que los subtítulos casen palabra a palabra.
// Tipos de plano: portada, app, dato, punto, versus, cta.
//
// POSTS: carrusel de 4 imágenes (portada + 3). Tipos de slide: portada, app, consejo.

export const VOZ = { nombre: 'Pablo', velocidad: 1.2, pausa: 0.22 };
export const MARCA = { web: 'ultimatefitnessuf.com', usuario: '@ultimatefitness.utf' };
const UF = { texto: 'Ultimate Fitness', voz: 'Últimeit Fítnes' };
const CTA = { tipo: 'cta', texto: 'Pruébala gratis. Tienes el enlace en mi perfil.' };

export const VIDEOS = [
  {
    id: '01-que-puedes-hacer',
    descripcion: "Rutinas que creas tocando el músculo en la figura, dietas con calorías y macros ya calculadas, registro de series para ver tu progreso, calculadora de calorías y un blog para aprender. Todo en una sola app.\n\nPruébala gratis en ultimatefitnessuf.com (enlace en la bio).\n\n¿Qué función usarías primero?",
    hashtags: "#gym #gymtok #appfitness #rutinagym #dieta #progreso #entrenamiento #nutricion #fitness #ultimatefitness",
    titulo: 'Todo lo que puedes hacer en la app',
    fondo: 'tiron',
    frases: [
      { tipo: 'portada', eyebrow: 'La app', titulo: ['¿Entrenas', 'sin plan?'], texto: `¿Entrenas sin plan y comes a ojo? Mira todo lo que puedes hacer en ${UF.texto}.`, voz: `¿Entrenas sin plan y comes a ojo? Mira todo lo que puedes hacer en ${UF.voz}.` },
      { tipo: 'app', etiqueta: 'Rutinas', captura: 'rutinas_1_pecho', texto: 'Crea tu rutina en segundos: tocas el músculo en la figura y añades los ejercicios.' },
      { tipo: 'app', etiqueta: 'Dietas', captura: 'dieta_larga', desplazar: 900, texto: 'Monta tu dieta con las calorías y las macros ya calculadas.' },
      { tipo: 'app', etiqueta: 'Progreso', captura: 'progreso-grafica', texto: 'Apunta tus series, repeticiones y peso, y mira cómo mejoras semana a semana.' },
      { tipo: 'app', etiqueta: 'Calculadora', captura: 'calculadora', desplazar: 260, texto: 'Calcula cuánto tienes que comer para bajar, mantener o subir de peso.' },
      { tipo: 'app', etiqueta: 'Blog', captura: 'blog', desplazar: 700, texto: 'Y aprende con los artículos del blog.' },
      { ...CTA, texto: 'Todo en una sola app y gratis. Tienes el enlace en mi perfil.' },
    ],
  },
  {
    id: '02-cuanto-comer',
    descripcion: "Primero tus calorías de mantenimiento. Para bajar grasa, 300-500 menos; para ganar músculo, 200-300 más. Y el IMC úsalo como referencia, no como juez: no distingue músculo de grasa.\n\nCalcula tus calorías en diez segundos, gratis en ultimatefitnessuf.com (enlace en la bio).\n\nGuárdalo para cuando empieces tu dieta.",
    hashtags: "#gym #gymtok #calorias #deficitcalorico #volumen #perdergrasa #ganarmusculo #imc #nutricion #ultimatefitness",
    titulo: 'Cuánto comer para bajar, mantener o subir',
    fondo: 'empuje',
    frases: [
      { tipo: 'portada', eyebrow: 'Nutrición', titulo: ['¿Cuánto', 'tienes que comer?'], texto: '¿Cuántas calorías tienes que comer? Depende de tu objetivo.' },
      { tipo: 'dato', etiqueta: 'Paso 1', valor: 'Mantenimiento', nota: 'Lo que gastas en un día', texto: 'Primero, tus calorías de mantenimiento: lo que gastas en un día según tu peso, altura, edad y actividad.' },
      { tipo: 'dato', etiqueta: 'Bajar grasa', valor: '−300 a −500', unidad: 'kcal', nota: 'por debajo del mantenimiento', texto: 'Para bajar grasa, come entre 300 y 500 calorías menos.' },
      { tipo: 'dato', etiqueta: 'Ganar músculo', valor: '+200 a +300', unidad: 'kcal', nota: 'por encima del mantenimiento', texto: 'Para ganar músculo, unas 200 o 300 más, sin pasarte.' },
      { tipo: 'dato', etiqueta: 'IMC', valor: 'peso / altura²', nota: 'No distingue músculo de grasa', texto: 'Y el IMC solo relaciona peso y altura: no distingue músculo de grasa. Úsalo como referencia, no como juez.' },
      { tipo: 'app', etiqueta: 'Calculadora', captura: 'calculadora', desplazar: 260, texto: 'En la app lo calculas gratis en diez segundos.' },
      CTA,
    ],
  },
  {
    id: '03-carbos-o-proteina',
    descripcion: "Antes de entrenar, los dos: carbohidratos para rendir y proteína para el músculo. 2-3 horas antes, comida normal; 1 hora antes, algo ligero como un plátano con yogur. Evita mucha grasa o fibra justo antes.\n\nMonta tu dieta con las macros de cada comida, gratis en ultimatefitnessuf.com (enlace en la bio).\n\n¿Qué comes tú antes de entrenar?",
    hashtags: "#gym #gymtok #preentreno #carbohidratos #proteina #nutriciondeportiva #comidafit #dieta #fitness #ultimatefitness",
    titulo: '¿Carbohidratos o proteína antes de entrenar?',
    fondo: 'empuje',
    frases: [
      { tipo: 'portada', eyebrow: 'Pregunta frecuente', titulo: ['¿Carbos o', 'proteína antes?'], texto: '¿Carbohidratos o proteína antes de entrenar? La respuesta corta: los dos.' },
      { tipo: 'versus', izquierda: { titulo: 'Carbohidratos', nota: 'Energía para rendir' }, derecha: { titulo: 'Proteína', nota: 'Repara y construye' }, activo: 'izquierda', texto: 'Los carbohidratos son la gasolina: te dan energía para rendir en cada serie.' },
      { tipo: 'versus', izquierda: { titulo: 'Carbohidratos', nota: 'Energía para rendir' }, derecha: { titulo: 'Proteína', nota: 'Repara y construye' }, activo: 'derecha', texto: 'La proteína ayuda a reparar y construir músculo.' },
      { tipo: 'punto', numero: '2-3 h', titulo: 'Comida normal', nota: 'Arroz o pasta, pollo y fruta', texto: 'Si comes dos o tres horas antes, haz una comida normal: arroz o pasta, pollo y algo de fruta.' },
      { tipo: 'punto', numero: '1 h', titulo: 'Algo ligero', nota: 'Un plátano y un yogur', texto: 'Si solo tienes una hora, algo ligero: un plátano con un yogur.' },
      { tipo: 'punto', numero: 'Evita', titulo: 'Mucha grasa o fibra', nota: 'Se digieren lento', texto: 'Y evita mucha grasa o fibra justo antes, porque se digieren lento.' },
      { tipo: 'app', etiqueta: 'Dietas', captura: 'dieta_larga', desplazar: 900, texto: 'En la app montas tu dieta con las macros de cada comida.' },
      CTA,
    ],
  },
  {
    id: '04-suplementos',
    descripcion: "Creatina (3-5 g al día), proteína en polvo si no llegas con la dieta y cafeína con cabeza. Los quemagrasas no hacen el trabajo por ti: lo que funciona es el déficit calórico. Primero lo básico.\n\nOrganiza tu dieta y tu entreno gratis en ultimatefitnessuf.com (enlace en la bio).\n\n¿Qué suplemento tomas tú?",
    hashtags: "#gym #gymtok #suplementos #creatina #proteinaenpolvo #cafeina #mitosdelgym #nutricion #fitness #ultimatefitness",
    titulo: 'Suplementos: cuáles merecen la pena',
    fondo: 'tiron',
    frases: [
      { tipo: 'portada', eyebrow: 'Suplementos', titulo: ['¿Cuáles', 'merecen la pena?'], texto: '¿Qué suplementos merecen la pena? Menos de los que te venden.' },
      { tipo: 'punto', numero: 'Sí', titulo: 'Creatina', nota: '3-5 g al día, todos los días', texto: 'La creatina es de los más estudiados: de 3 a 5 gramos al día, todos los días.' },
      { tipo: 'punto', numero: 'Sí', titulo: 'Proteína en polvo', nota: 'Si no llegas con la comida', texto: 'La proteína en polvo es comida, no magia: úsala si no llegas a tu proteína con la dieta.' },
      { tipo: 'punto', numero: 'Con cabeza', titulo: 'Cafeína', nota: 'Antes de entrenar, nunca tarde', texto: 'La cafeína antes de entrenar puede ayudarte a rendir, pero sin pasarte y nunca por la noche.' },
      { tipo: 'punto', numero: 'No', titulo: 'Quemagrasas', nota: 'Lo que funciona es el déficit', negativo: true, texto: '¿Quemagrasas? No hacen el trabajo por ti: lo que funciona es el déficit calórico.' },
      { tipo: 'dato', etiqueta: 'Lo primero', valor: 'Comida · Descanso · Entreno', nota: 'Ante dudas de salud, consulta a un profesional', texto: 'Antes de suplementarte, asegura lo básico. Y si tienes dudas de salud, consulta a un profesional.' },
      CTA,
    ],
  },
  {
    id: '05-no-veo-resultados',
    descripcion: "Si llevas meses sin ver cambios, revisa estas tres: no progresas en peso o repeticiones, comes poca proteína (1,6-2,2 g por kilo) o duermes poco.\n\nApunta tus series y ve tu evolución, gratis en ultimatefitnessuf.com (enlace en la bio).\n\n¿Cuál de las tres es la tuya?",
    hashtags: "#gym #gymtok #sinresultados #progreso #proteina #descanso #ganarmusculo #consejosgym #fitness #ultimatefitness",
    titulo: 'No veo resultados en el gym',
    fondo: 'empuje',
    frases: [
      { tipo: 'portada', eyebrow: 'Problema típico', titulo: ['¿No ves', 'resultados?'], texto: '¿Llevas meses en el gym y no ves cambios? Seguramente sea una de estas tres cosas.' },
      { tipo: 'punto', numero: '01', titulo: 'No progresas', nota: 'Más peso o más repeticiones', texto: 'Uno: no progresas. Si siempre levantas lo mismo, tu cuerpo no tiene motivo para cambiar.' },
      { tipo: 'punto', numero: '02', titulo: 'Poca proteína', nota: '1,6 a 2,2 g por kilo de peso', texto: 'Dos: comes poca proteína. Apunta a entre 1,6 y 2,2 gramos por kilo de peso.' },
      { tipo: 'punto', numero: '03', titulo: 'Duermes poco', nota: 'El músculo crece descansando', texto: 'Tres: duermes poco. El músculo se construye descansando.' },
      { tipo: 'app', etiqueta: 'Progreso', captura: 'progreso-grafica', texto: `En ${UF.texto} apuntas tus series y ves tu récord y tu evolución.`, voz: `En ${UF.voz} apuntas tus series y ves tu récord y tu evolución.` },
      CTA,
    ],
  },

  // ---------------- Segunda tanda: dudas más frecuentes del gym ----------------
  {
    id: '06-cuantos-dias',
    descripcion: "No necesitas ir al gym todos los días. Con 3 o 4 días a la semana, trabajando cada músculo dos veces, ya puedes ganar músculo y fuerza. Lo que de verdad cuenta es aguantar meses, no semanas.\n\nMonta tu semana de entreno gratis en ultimatefitnessuf.com (enlace en la bio).\n\n¿Cuántos días entrenas tú? Te leo en comentarios.",
    hashtags: "#gym #gymtok #rutinagym #fullbody #torsopierna #principiantesgym #ganarmusculo #consejosgym #fitness #ultimatefitness",
    titulo: '¿Cuántos días a la semana tengo que entrenar?',
    fondo: 'tiron',
    frases: [
      { tipo: 'portada', eyebrow: 'Duda frecuente', titulo: ['¿Cuántos días', 'entreno?'], texto: '¿Cuántos días a la semana tienes que entrenar? Menos de los que crees.' },
      { tipo: 'punto', numero: '3-4 días', titulo: 'Es suficiente', nota: 'Si eres constante', texto: 'Con tres o cuatro días a la semana puedes ganar músculo y fuerza, si eres constante.' },
      { tipo: 'punto', numero: '2 veces', titulo: 'Cada músculo', nota: 'A la semana', texto: 'La clave es trabajar cada músculo unas dos veces por semana.' },
      { tipo: 'versus', izquierda: { titulo: '3 días', nota: 'Cuerpo completo' }, derecha: { titulo: '4 días', nota: 'Torso y pierna' }, activo: 'izquierda', texto: 'Con tres días, haz cuerpo completo.' },
      { tipo: 'versus', izquierda: { titulo: '3 días', nota: 'Cuerpo completo' }, derecha: { titulo: '4 días', nota: 'Torso y pierna' }, activo: 'derecha', texto: 'Con cuatro, divide en torso y pierna.' },
      { tipo: 'dato', etiqueta: 'Lo importante', valor: 'Constancia', nota: 'Mejor 3 días un año que 6 días un mes', texto: 'Mejor tres días durante un año que seis días durante un mes.' },
      { tipo: 'app', etiqueta: 'Rutinas', captura: 'rutinas_4_dia', texto: 'En la app montas tu semana día a día, con tus días de descanso.' },
      CTA,
    ],
  },
  {
    id: '07-series-y-repeticiones',
    descripcion: "De 6 a 12 repeticiones, acabando a 1-3 del fallo, y entre 10 y 20 series por músculo a la semana. Y cada semana, un poco más de peso o una repetición extra.\n\nApunta tus series y mira si progresas, gratis en ultimatefitnessuf.com (enlace en la bio).\n\nGuárdalo para tu próximo entreno.",
    hashtags: "#gym #gymtok #hipertrofia #seriesyrepeticiones #ganarmusculo #sobrecargaprogresiva #consejosgym #entrenamiento #fitness #ultimatefitness",
    titulo: '¿Cuántas series y repeticiones para ganar músculo?',
    fondo: 'empuje',
    frases: [
      { tipo: 'portada', eyebrow: 'Duda frecuente', titulo: ['¿Series y', 'repeticiones?'], texto: '¿Cuántas series y repeticiones necesitas para ganar músculo? Te lo resumo.' },
      { tipo: 'dato', etiqueta: 'Repeticiones', valor: '6 – 12', unidad: 'reps', nota: 'Lo clásico, pero no lo único', texto: 'El rango clásico es de 6 a 12 repeticiones, aunque con más también funciona.' },
      { tipo: 'dato', etiqueta: 'Lo que importa', valor: 'Cerca del fallo', nota: 'Que te queden 1-3 repeticiones', texto: 'Lo que de verdad importa es acabar cerca del fallo: que te queden de una a tres repeticiones.' },
      { tipo: 'dato', etiqueta: 'Por músculo', valor: '10 – 20', unidad: 'series a la semana', nota: 'Empieza por abajo y sube', texto: 'Y para cada músculo, entre 10 y 20 series a la semana. Empieza por abajo y sube poco a poco.' },
      { tipo: 'punto', numero: 'Clave', titulo: 'Progresa', nota: 'Más peso o una repetición más', texto: 'Cada semana intenta sumar un poco de peso o una repetición más.' },
      { tipo: 'app', etiqueta: 'Progreso', captura: 'progreso', texto: 'En la app apuntas cada serie y ves si de verdad estás progresando.' },
      CTA,
    ],
  },
  {
    id: '08-cardio-o-pesas',
    descripcion: "Para perder grasa manda el déficit calórico. Las pesas hacen que pierdas grasa y no músculo, y el cardio suma gasto. Lo ideal: pesas 3-4 días, caminar más y cardio si te gusta.\n\nCalcula cuántas calorías comer para bajar grasa, gratis en ultimatefitnessuf.com (enlace en la bio).\n\n¿Team cardio o team pesas?",
    hashtags: "#gym #gymtok #perdergrasa #deficitcalorico #cardio #pesas #definicion #bajardepeso #fitness #ultimatefitness",
    titulo: '¿Cardio o pesas para perder grasa?',
    fondo: 'tiron',
    frases: [
      { tipo: 'portada', eyebrow: 'Duda frecuente', titulo: ['¿Cardio', 'o pesas?'], texto: '¿Cardio o pesas para perder grasa? Lo que manda de verdad es la dieta.' },
      { tipo: 'dato', etiqueta: 'Lo que manda', valor: 'Déficit calórico', nota: 'Comer menos de lo que gastas', texto: 'Pierdes grasa cuando comes menos de lo que gastas, hagas lo que hagas.' },
      { tipo: 'versus', izquierda: { titulo: 'Pesas', nota: 'Mantienen el músculo' }, derecha: { titulo: 'Cardio', nota: 'Suma gasto' }, activo: 'izquierda', texto: 'Las pesas hacen que, al bajar de peso, pierdas grasa y no músculo.' },
      { tipo: 'versus', izquierda: { titulo: 'Pesas', nota: 'Mantienen el músculo' }, derecha: { titulo: 'Cardio', nota: 'Suma gasto' }, activo: 'derecha', texto: 'El cardio suma calorías gastadas y es bueno para tu corazón.' },
      { tipo: 'dato', etiqueta: 'Lo ideal', valor: 'Pesas + caminar', nota: 'Y cardio si te gusta', texto: 'Lo ideal: pesas tres o cuatro días, caminar más cada día, y cardio si te gusta.' },
      { tipo: 'app', etiqueta: 'Calculadora', captura: 'calculadora', desplazar: 260, texto: 'En la app calculas cuántas calorías comer para bajar grasa.' },
      CTA,
    ],
  },
  {
    id: '09-agujetas',
    descripcion: "Las agujetas no miden lo bien que has entrenado. Salen sobre todo cuando haces algo nuevo. Lo que de verdad indica que vas bien es progresar: más peso o más repeticiones.\n\nSigue tu progreso real semana a semana, gratis en ultimatefitnessuf.com (enlace en la bio).\n\nEtiqueta a quien cree que sin agujetas no vale el entreno.",
    hashtags: "#gym #gymtok #agujetas #mitosdelgym #recuperacionmuscular #progreso #consejosgym #entrenamiento #fitness #ultimatefitness",
    titulo: 'Agujetas: ¿significan que entrenaste bien?',
    fondo: 'empuje',
    frases: [
      { tipo: 'portada', eyebrow: 'Mito del gym', titulo: ['¿Agujetas =', 'buen entreno?'], texto: '¿Si no tienes agujetas es que no has entrenado bien? Falso.' },
      { tipo: 'dato', etiqueta: 'Qué son', valor: 'Daño muscular leve', nota: 'Aparecen de 1 a 3 días después', texto: 'Las agujetas son un pequeño daño muscular que aparece entre uno y tres días después.' },
      { tipo: 'punto', numero: 'Ojo', titulo: 'No miden nada', nota: 'Salen más con lo nuevo', texto: 'Salen sobre todo cuando haces algo nuevo, no porque el entreno fuera mejor.' },
      { tipo: 'punto', numero: 'Lo que vale', titulo: 'Progresar', nota: 'Más peso o más repeticiones', texto: 'Lo que indica que vas bien es que progresas: más peso o más repeticiones.' },
      { tipo: 'punto', numero: 'Si tienes', titulo: 'Muévete suave', nota: 'Paseo, movilidad y dormir bien', texto: 'Si tienes agujetas, muévete suave, duerme bien y espera a que se pasen para darle fuerte a ese músculo.' },
      { tipo: 'app', etiqueta: 'Progreso', captura: 'progreso-grafica', texto: 'En la app ves tu progreso real, semana a semana.' },
      CTA,
    ],
  },
  {
    id: '10-descanso-entre-series',
    descripcion: "En ejercicios grandes (sentadilla, press, remo) descansa 2-3 minutos; en aislamiento (bíceps, laterales) 1-2 minutos. Descansar poco te quita repeticiones y te frena.\n\nTu rutina con el descanso de cada ejercicio, gratis en ultimatefitnessuf.com (enlace en la bio).\n\n¿Cuánto descansas tú entre series?",
    hashtags: "#gym #gymtok #descansoentreseries #hipertrofia #fuerza #rutinagym #consejosgym #entrenamiento #fitness #ultimatefitness",
    titulo: '¿Cuánto descansar entre series?',
    fondo: 'tiron',
    frases: [
      { tipo: 'portada', eyebrow: 'Duda frecuente', titulo: ['¿Cuánto', 'descansar?'], texto: '¿Cuánto tienes que descansar entre series? Más de lo que piensas.' },
      { tipo: 'dato', etiqueta: 'Ejercicios grandes', valor: '2 – 3', unidad: 'minutos', nota: 'Sentadilla, press, remo', texto: 'En los ejercicios grandes, como sentadilla, press o remo, descansa de dos a tres minutos.' },
      { tipo: 'dato', etiqueta: 'Aislamiento', valor: '1 – 2', unidad: 'minutos', nota: 'Bíceps, laterales, extensiones', texto: 'En los de aislamiento, como bíceps o laterales, con uno o dos minutos basta.' },
      { tipo: 'punto', numero: 'Ojo', titulo: 'Poco descanso', nota: 'Rindes menos en la siguiente', texto: 'Si descansas poco, haces menos repeticiones en la siguiente serie, y eso te frena.' },
      { tipo: 'punto', numero: 'Regla fácil', titulo: 'Recupera el aire', nota: 'Y ve a por la siguiente', texto: 'La regla fácil: cuando recuperes el aliento y te veas capaz, ve a por la siguiente.' },
      { tipo: 'app', etiqueta: 'Rutinas', captura: 'rutina', desplazar: 1150, texto: 'En tu rutina de la app tienes el descanso de cada ejercicio.' },
      CTA,
    ],
  },
];

export const POSTS = [
  {
    id: '01-funciones-app',
    texto: 'Rutinas, dietas con macros, progreso, calculadora y blog. Todo en una app y gratis. Enlace en la bio.',
    slides: [
      { tipo: 'portada', titulo: ['Todo lo que puedes', 'hacer en la *app*'], visual: { captura: 'inicio' } },
      { tipo: 'app', numero: 1, titulo: ['Tu rutina en', '*segundos*'], cuerpo: 'Toca el músculo en la figura y añade los ejercicios. Sin listas eternas.', captura: 'rutinas_1_pecho' },
      { tipo: 'app', numero: 2, titulo: ['Dietas con las', '*macros* contadas'], cuerpo: 'Calorías, proteína, carbohidratos y grasas de cada comida, ya calculados.', captura: 'dieta_larga', desplazar: 900 },
      { tipo: 'app', numero: 3, titulo: ['Mira cómo', '*progresas*'], cuerpo: 'Apunta series, repeticiones y peso. Ves tu récord y tu evolución. Empieza gratis: enlace en la bio.', captura: 'progreso-grafica' },
    ],
  },
  {
    id: '02-calorias-objetivo',
    texto: 'Bajar, mantener o subir: cuántas calorías necesitas. Calcúlalo gratis en la app, enlace en la bio.',
    slides: [
      { tipo: 'portada', titulo: ['¿Cuánto tienes', 'que *comer*?'] },
      { tipo: 'consejo', numero: 1, dato: 'Tu base', titulo: ['Calorías de', '*mantenimiento*'], cuerpo: 'Lo que gastas en un día según tu peso, altura, edad y actividad. A partir de aquí se ajusta todo.' },
      { tipo: 'consejo', numero: 2, dato: '−300 a −500', unidad: 'kcal', titulo: ['Para bajar', '*grasa*'], cuerpo: 'Come entre 300 y 500 kcal por debajo de tu mantenimiento. Más déficit no es mejor: pierdes músculo y energía.' },
      { tipo: 'consejo', numero: 3, dato: '+200 a +300', unidad: 'kcal', titulo: ['Para ganar', '*músculo*'], cuerpo: 'Un superávit pequeño basta. Si comes de más, ganas más grasa, no más músculo. Calcúlalo gratis en la app.' },
    ],
  },
  {
    id: '03-imc',
    texto: 'El IMC es útil, pero no lo cuenta todo. En la app lo tienes calculado en tu perfil.',
    slides: [
      { tipo: 'portada', titulo: ['IMC: lo que', 'no te *cuentan*'] },
      { tipo: 'consejo', numero: 1, dato: 'peso / altura²', titulo: ['Qué es el', '*IMC*'], cuerpo: 'Tu peso en kilos dividido entre tu altura en metros al cuadrado. Entre 18,5 y 24,9 se considera un rango normal.' },
      { tipo: 'consejo', numero: 2, dato: 'Músculo ≠ grasa', titulo: ['Lo que', '*no te dice*'], cuerpo: 'No distingue músculo de grasa. Una persona con mucho músculo puede salir con «sobrepeso» estando en forma.' },
      { tipo: 'consejo', numero: 3, dato: 'Cintura · Fotos · Fuerza', titulo: ['Mídete', '*mejor*'], cuerpo: 'Combínalo con el perímetro de cintura, fotos cada mes y tu fuerza en el gym. En la app ves tu IMC y tu progreso.' },
    ],
  },
  {
    id: '04-proteina',
    texto: 'Cuánta proteína necesitas, cómo repartirla y dónde encontrarla. Guárdalo para tu próxima compra.',
    slides: [
      { tipo: 'portada', titulo: ['Proteína: cuánta', 'y *cuándo*'] },
      { tipo: 'consejo', numero: 1, dato: '1,6 – 2,2', unidad: 'g/kg', titulo: ['Cuánta', '*necesitas*'], cuerpo: 'Si entrenas fuerza, entre 1,6 y 2,2 gramos por kilo de peso al día. Si pesas 70 kg: de 112 a 154 g.' },
      { tipo: 'consejo', numero: 2, dato: '3 – 5', unidad: 'comidas', titulo: ['Repártela en el', '*día*'], cuerpo: 'Mejor en varias tomas de 20 a 40 g que todo de golpe en la cena.' },
      { tipo: 'consejo', numero: 3, dato: 'Comida primero', titulo: ['Dónde', '*encontrarla*'], cuerpo: 'Huevos, pollo, pescado, lácteos, legumbres y tofu. La proteína en polvo es un complemento, no la base.' },
    ],
  },
  {
    id: '05-mitos-gym',
    texto: 'Tres mitos del gym que te hacen perder el tiempo. ¿Cuál te creías?',
    slides: [
      { tipo: 'portada', titulo: ['3 mitos del gym', 'que te *frenan*'] },
      { tipo: 'consejo', numero: 1, dato: 'Falso', titulo: ['Sudar más quema', 'más *grasa*'], cuerpo: 'El sudor es agua para refrigerarte. Lo que recuperas al beber vuelve. La grasa se pierde con déficit calórico.' },
      { tipo: 'consejo', numero: 2, dato: 'Falso', titulo: ['Abdominales para', 'quitar *barriga*'], cuerpo: 'No se puede quemar grasa solo de una zona. Los abdominales fortalecen; la barriga baja con déficit y constancia.' },
      { tipo: 'consejo', numero: 3, dato: 'Falso', titulo: ['Las pesas te', 'ponen *enorme*'], cuerpo: 'Ganar músculo cuesta años de entreno y comida. Las pesas te dan forma y fuerza, no volumen de un día para otro.' },
    ],
  },
];
