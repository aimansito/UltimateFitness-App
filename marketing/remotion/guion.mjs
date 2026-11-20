// Vídeos de resolución de problemas (tercera tanda), montados con Remotion + Three.js.
// Siguen la línea de los que mejor han funcionado: entrenar sin plan, qué comer, suplementos y
// no ver resultados.
//
// Cada frase es un plano. `texto` es lo que se dice y sale en los subtítulos; `voz` (opcional) es la
// pronunciación para la voz de Windows, con el mismo número de palabras.
// Tipos de plano: portada, dato, lista, punto, mito, grafica, plato, app, cta.
// Objetos 3D de portada: mancuerna, batido, capsula, bascula, plato.

export const VOZ = { nombre: 'Pablo', velocidad: 1.2, pausa: 0.22 };
export const MARCA = { web: 'ultimatefitnessuf.com', usuario: '@ultimatefitness.utf' };
const UF = { texto: 'Ultimate Fitness', voz: 'Últimeit Fítnes' };
const CTA = { tipo: 'cta', texto: 'Pruébala gratis. Tienes el enlace en mi perfil.' };

export const VIDEOS = [
  {
    id: '11-no-se-que-hacer',
    titulo: '¿No sabes qué hacer en el gym? Tu primera rutina',
    fondo: 'empuje',
    descripcion: 'Si llegas al gym y no sabes por dónde empezar: 3 días de cuerpo completo, un ejercicio de pierna, uno de empuje y uno de tirón, 3 series de 8 a 12. Y cada semana, intenta superarte.\n\nMonta esta rutina en un minuto, gratis en ultimatefitnessuf.com (enlace en la bio).\n\nGuárdalo y mándaselo a quien está empezando.',
    hashtags: '#gym #gymtok #principiantesgym #rutinagym #fullbody #primerarutina #consejosgym #entrenamiento #fitness #ultimatefitness',
    frases: [
      { tipo: 'portada', objeto: 'mancuerna', eyebrow: 'Gym sin plan', titulo: ['¿No sabes qué', 'hacer en el gym?'], texto: '¿Llegas al gym y no sabes qué hacer? Te doy un plan para empezar hoy.' },
      { tipo: 'dato', etiqueta: 'Días a la semana', valor: '3', unidad: 'Cuerpo completo', nota: 'Lunes · Miércoles · Viernes', texto: 'Elige tres días a la semana y entrena cuerpo completo.' },
      { tipo: 'lista', etiqueta: 'Cada día', items: [{ titulo: 'Pierna', nota: '1 ejercicio' }, { titulo: 'Empuje', nota: '1 ejercicio' }, { titulo: 'Tirón', nota: '1 ejercicio' }], texto: 'Cada día, un ejercicio de pierna, uno de empuje y uno de tirón.' },
      { tipo: 'lista', etiqueta: 'Por ejemplo', items: [{ titulo: 'Sentadilla', nota: 'Pierna' }, { titulo: 'Press de banca', nota: 'Empuje' }, { titulo: 'Jalón al pecho', nota: 'Tirón' }], texto: 'Por ejemplo: sentadilla, press de banca y jalón al pecho.' },
      { tipo: 'dato', etiqueta: 'En cada ejercicio', valor: '3 × 8-12', unidad: 'Series × repeticiones', nota: 'Que las últimas te cuesten', texto: 'Haz tres series de ocho a doce repeticiones en cada uno.' },
      { tipo: 'punto', numero: 'La clave', titulo: 'Supérate', nota: 'Más peso o una repetición más', texto: 'Apunta el peso que mueves y la semana siguiente intenta superarlo.' },
      { tipo: 'app', etiqueta: 'Crea tu rutina', captura: 'rutinas_1_pecho', desplazar: 300, texto: 'En la app montas esta rutina en un minuto, tocando el músculo en la figura.' },
      CTA,
    ],
  },
  {
    id: '12-despues-de-entrenar',
    titulo: '¿Qué comer después de entrenar?',
    fondo: 'tiron',
    descripcion: 'La ventana de 30 minutos no es tan estricta: tienes varias horas. Mete 20-40 g de proteína y carbohidratos para recargar. Arroz con pollo, huevos con tostadas o yogur con avena y fruta. Y lo que más cuenta es el total del día.\n\nMonta tu dieta con la proteína de cada comida, gratis en ultimatefitnessuf.com (enlace en la bio).\n\n¿Qué comes tú después de entrenar?',
    hashtags: '#gym #gymtok #postentreno #proteina #carbohidratos #nutriciondeportiva #comidafit #dieta #fitness #ultimatefitness',
    frases: [
      { tipo: 'portada', objeto: 'batido', eyebrow: 'Post-entreno', titulo: ['¿Qué comer', 'después de entrenar?'], texto: '¿Qué comer después de entrenar? Es más fácil de lo que te han contado.' },
      { tipo: 'mito', mito: 'Si no comes en 30 minutos, pierdes músculo', verdad: 'Tienes varias horas', texto: 'La famosa ventana de treinta minutos no es tan estricta: tienes varias horas.' },
      { tipo: 'dato', etiqueta: 'Proteína', valor: '20-40', unidad: 'gramos', nota: 'Para reparar el músculo', texto: 'Lo importante es meter proteína: entre veinte y cuarenta gramos.' },
      { tipo: 'punto', numero: 'Energía', titulo: 'Carbohidratos', nota: 'Recargan lo que has gastado', texto: 'Y carbohidratos para recargar energía, sobre todo si entrenas fuerte.' },
      { tipo: 'lista', etiqueta: 'Ideas fáciles', items: [{ titulo: 'Arroz con pollo', nota: 'Comida completa' }, { titulo: 'Huevos y tostadas', nota: 'En 5 minutos' }, { titulo: 'Yogur, avena y fruta', nota: 'Sin cocinar' }], texto: 'Por ejemplo: arroz con pollo, huevos con tostadas, o un yogur con avena y fruta.' },
      { tipo: 'punto', numero: 'Lo que más cuenta', titulo: 'El total del día', nota: 'Más que la hora exacta', texto: 'Al final, lo que más cuenta es lo que comes en todo el día.' },
      { tipo: 'app', etiqueta: 'Tu dieta', captura: 'dieta_larga', desplazar: 900, texto: 'En la app montas tu dieta con la proteína de cada comida.' },
      CTA,
    ],
  },
  {
    id: '13-creatina',
    titulo: 'Creatina: las dudas que todos tienen',
    fondo: 'empuje',
    descripcion: '3-5 g al día, todos los días. La hora da igual, no hace falta carga ni descansos, y el kilo que puedes subir es agua dentro del músculo, no grasa. Elige monohidrato. Si tienes algún problema de riñón, consulta antes con tu médico.\n\nOrganiza tu entreno y tu dieta gratis en ultimatefitnessuf.com (enlace en la bio).\n\n¿Tomas creatina? Te leo.',
    hashtags: '#gym #gymtok #creatina #suplementos #creatinamonohidrato #mitosdelgym #nutriciondeportiva #fuerza #fitness #ultimatefitness',
    frases: [
      { tipo: 'portada', objeto: 'capsula', eyebrow: 'Suplementos', titulo: ['Dudas de la', 'creatina'], texto: '¿Retiene líquidos? ¿Antes o después de entrenar? Te resuelvo las dudas de la creatina.' },
      { tipo: 'dato', etiqueta: 'Cada día', valor: '3-5', unidad: 'gramos', nota: 'También los días de descanso', texto: 'Toma de tres a cinco gramos al día, todos los días, también cuando no entrenas.' },
      { tipo: 'punto', numero: '¿A qué hora?', titulo: 'Da igual', nota: 'Lo que importa es no fallar', texto: 'La hora da igual: lo que importa es tomarla siempre.' },
      { tipo: 'mito', mito: 'Hay que hacer carga y descansar de ella', verdad: 'Ni carga ni descansos', texto: 'No hace falta fase de carga ni dejar de tomarla cada cierto tiempo.' },
      { tipo: 'mito', mito: 'Te hincha y engorda', verdad: 'Es agua dentro del músculo', texto: 'Puede subir uno o dos kilos de agua, pero dentro del músculo. No es grasa.' },
      { tipo: 'punto', numero: '¿Cuál?', titulo: 'Monohidrato', nota: 'La más estudiada y la más barata', texto: 'Elige creatina monohidrato: la más estudiada y la más barata.' },
      { tipo: 'punto', negativo: true, numero: 'Ojo', titulo: 'Riñones', nota: 'Consulta antes a tu médico', texto: 'Si tienes algún problema de riñón, consulta antes con tu médico.' },
      { tipo: 'cta', texto: `Organiza tu entreno en ${UF.texto}. Tienes el enlace en mi perfil.`, voz: `Organiza tu entreno en ${UF.voz}. Tienes el enlace en mi perfil.` },
    ],
  },
  {
    id: '14-no-pierdo-grasa',
    titulo: 'Como poco y no pierdo grasa',
    fondo: 'tiron',
    descripcion: 'Aceite, salsas, picoteo y bebidas suman sin que te des cuenta, y el finde puede borrar el déficit de la semana. Además la báscula sube y baja por el agua: pésate 3-4 mañanas y mira la media. Si en 3 semanas no baja, quita unas 200 kcal.\n\nCalcula tus calorías gratis en ultimatefitnessuf.com (enlace en la bio).\n\n¿Te ha pasado?',
    hashtags: '#gym #gymtok #perdergrasa #deficitcalorico #bajardepeso #estancado #caloriasocultas #nutricion #fitness #ultimatefitness',
    frases: [
      { tipo: 'portada', objeto: 'bascula', eyebrow: 'Estancado', titulo: ['¿Comes poco y', 'no bajas?'], texto: '¿Comes poco y no bajas de peso? Seguramente comes más de lo que crees.' },
      { tipo: 'lista', etiqueta: 'Calorías ocultas', items: [{ titulo: 'Aceite', nota: '1 cucharada ≈ 120 kcal' }, { titulo: 'Salsas y picoteo', nota: 'Suman sin darte cuenta' }, { titulo: 'Bebidas', nota: 'Refrescos, alcohol, cafés' }], texto: 'El aceite, las salsas, el picoteo y las bebidas suman cientos de calorías sin que te des cuenta.' },
      { tipo: 'punto', negativo: true, numero: 'El finde', titulo: 'Borra el déficit', nota: 'Dos días pueden anular cinco', texto: 'Y el fin de semana puede borrar el déficit de toda la semana.' },
      { tipo: 'grafica', etiqueta: 'Tu peso real', texto: 'Además, la báscula sube y baja por el agua: mira la media semanal, no un día suelto.' },
      { tipo: 'dato', etiqueta: 'Pésate', valor: '3-4', unidad: 'mañanas por semana', nota: 'Y compara las medias', texto: 'Pésate tres o cuatro mañanas por semana y compara las medias.' },
      { tipo: 'dato', etiqueta: 'Si en 3 semanas no baja', valor: '-200', unidad: 'kcal al día', nota: 'Un ajuste pequeño', texto: 'Si en tres semanas la media no baja, quita unas doscientas calorías.' },
      { tipo: 'app', etiqueta: 'Tus calorías', captura: 'calculadora', desplazar: 500, texto: 'En la app calculas tus calorías para bajar grasa.' },
      CTA,
    ],
  },
  {
    id: '15-hambre-a-dieta',
    titulo: '¿Pasas hambre a dieta? Haz esto',
    fondo: 'empuje',
    descripcion: 'Proteína en cada comida, medio plato de verdura, agua y sin saltarte comidas, dormir bien y un déficit pequeño. Así se aguanta una dieta.\n\nMira cuántas calorías te tocan para bajar sin pasar hambre, gratis en ultimatefitnessuf.com (enlace en la bio).\n\n¿Cuál te cuesta más?',
    hashtags: '#gym #gymtok #dieta #hambre #perdergrasa #deficitcalorico #saciedad #habitossaludables #nutricion #ultimatefitness',
    frases: [
      { tipo: 'portada', objeto: 'plato', eyebrow: 'A dieta', titulo: ['¿Pasas hambre', 'a dieta?'], texto: '¿Estás a dieta y te mueres de hambre? Haz estos cambios.' },
      { tipo: 'punto', numero: '01', titulo: 'Proteína', nota: 'En cada comida: es lo que más sacia', texto: 'Uno: proteína en cada comida, es lo que más sacia.' },
      { tipo: 'plato', etiqueta: '02 · Tu plato', texto: 'Dos: llena medio plato de verdura. Mucho volumen y pocas calorías.' },
      { tipo: 'punto', numero: '03', titulo: 'No te saltes comidas', nota: 'Y bebe agua', texto: 'Tres: bebe agua y no te saltes comidas, que luego llega el atracón.' },
      { tipo: 'punto', numero: '04', titulo: 'Duerme', nota: 'Dormir poco dispara el hambre', texto: 'Cuatro: duerme bien. Dormir poco aumenta el hambre al día siguiente.' },
      { tipo: 'dato', etiqueta: 'Un déficit pequeño', valor: '300-500', unidad: 'kcal, no más', nota: 'Se aguanta mucho mejor', texto: 'Y no recortes de golpe: con un déficit pequeño se aguanta mucho mejor.' },
      { tipo: 'app', etiqueta: 'Calorías para bajar', captura: 'calculadora', desplazar: 500, texto: 'En la app ves cuántas calorías te tocan para bajar sin pasar hambre.' },
      CTA,
    ],
  },

  // ---------------- Cuarta tanda ----------------
  {
    id: '16-proteina-sin-batidos',
    titulo: 'Cómo llegar a tu proteína sin batidos',
    fondo: 'tiron',
    descripcion: 'Si entrenas, apunta a 1,6-2,2 g de proteína por kilo y repártela en 25-40 g por comida. Huevos, yogur griego o skyr, queso fresco batido, pollo, pavo, pescado, atún y legumbres. El batido es comida en polvo: solo si no llegas.\n\nMira la proteína de cada comida, gratis en ultimatefitnessuf.com (enlace en la bio).\n\n¿Cuál es tu fuente de proteína favorita?',
    hashtags: '#gym #gymtok #proteina #comidaproteica #dieta #ganarmusculo #nutriciondeportiva #comidafit #fitness #ultimatefitness',
    frases: [
      { tipo: 'portada', objeto: 'plato', eyebrow: 'Proteína', titulo: ['Proteína', 'sin batidos'], texto: '¿No llegas a tu proteína sin batidos? Te lo pongo fácil.' },
      { tipo: 'dato', etiqueta: 'Lo que necesitas', valor: '1,6-2,2', unidad: 'g por kilo al día', nota: 'Con 70 kg: unos 120 gramos', texto: 'Si entrenas, apunta a entre 1,6 y 2,2 gramos por kilo de peso al día.' },
      { tipo: 'punto', numero: 'El truco', titulo: 'Repártela', nota: '25 a 40 g en cada comida', texto: 'El truco es repartirla: entre veinticinco y cuarenta gramos en cada comida.' },
      { tipo: 'lista', etiqueta: 'Desayuno', items: [{ titulo: 'Huevos', nota: '3 huevos ≈ 19 g' }, { titulo: 'Yogur griego o skyr', nota: '1 tarrina ≈ 15 g' }, { titulo: 'Queso fresco batido', nota: '250 g ≈ 20 g' }], texto: 'En el desayuno: huevos, yogur griego o queso fresco batido.' },
      { tipo: 'lista', etiqueta: 'Comida y cena', items: [{ titulo: 'Pollo o pavo', nota: '150 g ≈ 35 g' }, { titulo: 'Pescado o atún', nota: '1 lata de atún ≈ 20 g' }, { titulo: 'Legumbres', nota: '1 plato ≈ 18 g' }], texto: 'En la comida y la cena: pollo, pavo, pescado, atún o legumbres.' },
      { tipo: 'punto', numero: '¿Y el batido?', titulo: 'Solo si no llegas', nota: 'Es comida en polvo, no magia', texto: 'El batido es solo comida en polvo: úsalo si con esto no llegas.' },
      { tipo: 'app', etiqueta: 'Tu proteína', captura: 'dieta_larga', desplazar: 900, texto: 'En la app ves la proteína de cada comida y del día.' },
      CTA,
    ],
  },
  {
    id: '17-musculo-sin-engordar',
    titulo: '¿Ganar músculo sin engordar? Volumen limpio',
    fondo: 'empuje',
    descripcion: 'Superávit pequeño (200-300 kcal), subir entre medio kilo y un kilo al mes, entrenar progresando y proteína alta. Comer de todo no te hace crecer más rápido: lo que sobra se guarda como grasa.\n\nCalcula tus calorías para ganar músculo, gratis en ultimatefitnessuf.com (enlace en la bio).\n\n¿Estás en volumen o en definición?',
    hashtags: '#gym #gymtok #volumen #volumenlimpio #ganarmusculo #superavit #hipertrofia #nutricion #fitness #ultimatefitness',
    frases: [
      { tipo: 'portada', objeto: 'bascula', eyebrow: 'Volumen', titulo: ['¿Ganar músculo', 'sin engordar?'], texto: '¿Quieres ganar músculo sin acumular grasa? Haz un volumen limpio.' },
      { tipo: 'dato', etiqueta: 'Superávit', valor: '200-300', unidad: 'kcal al día', nota: 'Sobre tu mantenimiento', texto: 'Come solo entre doscientas y trescientas calorías por encima de tu mantenimiento.' },
      { tipo: 'mito', mito: 'Para crecer hay que comer todo lo que puedas', verdad: 'Más comida no es más músculo', texto: 'Comer de todo no te hace crecer más rápido: lo que sobra se guarda como grasa.' },
      { tipo: 'dato', etiqueta: 'Ritmo ideal', valor: '0,5-1', unidad: 'kg al mes', nota: 'Si subes más rápido, recorta', texto: 'Sube entre medio kilo y un kilo al mes. Si subes más rápido, recorta un poco.' },
      { tipo: 'punto', numero: 'La clave', titulo: 'Progresa', nota: 'Más peso o más repeticiones', texto: 'Y entrena progresando: sin más peso o más repeticiones, el superávit se va a grasa.' },
      { tipo: 'punto', numero: 'Siempre', titulo: 'Proteína alta', nota: '1,6 a 2,2 g por kilo', texto: 'Mantén la proteína alta todos los días.' },
      { tipo: 'app', etiqueta: 'Calorías para subir', captura: 'calculadora', desplazar: 500, texto: 'En la app calculas tus calorías para ganar músculo.' },
      CTA,
    ],
  },
  {
    id: '18-poco-tiempo',
    titulo: '¿No tienes tiempo para entrenar?',
    fondo: 'tiron',
    descripcion: 'Con 45 minutos te sobra: ejercicios básicos, 2-3 series cerca del fallo, superseries y el móvil fuera. Con 2-3 días a la semana ya ves resultados. Y fuera del gym, camina.\n\nTen tu rutina lista para no perder ni un minuto, gratis en ultimatefitnessuf.com (enlace en la bio).\n\n¿Cuánto te dura a ti el entreno?',
    hashtags: '#gym #gymtok #sintiempo #entrenamientorapido #superseries #rutinagym #consejosgym #entrenamiento #fitness #ultimatefitness',
    frases: [
      { tipo: 'portada', objeto: 'mancuerna', eyebrow: 'Sin tiempo', titulo: ['¿No tienes', 'tiempo?'], texto: '¿No tienes tiempo para entrenar? Con cuarenta y cinco minutos te sobra.' },
      { tipo: 'dato', etiqueta: 'Por sesión', valor: '45', unidad: 'minutos', nota: 'Bien aprovechados', texto: 'Cuarenta y cinco minutos bien aprovechados valen más que dos horas mirando el móvil.' },
      { tipo: 'lista', etiqueta: 'Prioriza', items: [{ titulo: 'Básicos', nota: 'Sentadilla, press, remo' }, { titulo: '2-3 series', nota: 'Por ejercicio, cerca del fallo' }, { titulo: 'Sin móvil', nota: 'Entre series, nada de scroll' }], texto: 'Prioriza los ejercicios básicos y haz dos o tres series por ejercicio, cerca del fallo.' },
      { tipo: 'punto', numero: 'El truco', titulo: 'Superseries', nota: 'Dos músculos distintos seguidos', texto: 'Usa superseries: alterna dos ejercicios de músculos distintos y descansa al final.' },
      { tipo: 'dato', etiqueta: 'A la semana', valor: '2-3', unidad: 'días', nota: 'Ya dan resultados', texto: 'Con dos o tres días a la semana ya puedes ver resultados.' },
      { tipo: 'punto', numero: 'Fuera del gym', titulo: 'Camina', nota: 'Los pasos del día suman', texto: 'Y fuera del gym, camina: los pasos del día suman más de lo que crees.' },
      { tipo: 'app', etiqueta: 'Tu rutina', captura: 'rutina', desplazar: 1150, texto: 'En la app tienes tu rutina lista para no perder ni un minuto.' },
      CTA,
    ],
  },
  {
    id: '19-brazos-no-crecen',
    titulo: '¿Por qué no crecen tus brazos?',
    fondo: 'empuje',
    descripcion: 'El tríceps es unos dos tercios del brazo. Rango completo, menos ego y sin balancearte, 6-10 series a la semana para bíceps y tríceps, y come suficiente.\n\nAñade tus ejercicios de brazo a tu rutina, gratis en ultimatefitnessuf.com (enlace en la bio).\n\n¿Cuál de las cuatro fallabas?',
    hashtags: '#gym #gymtok #brazos #biceps #triceps #hipertrofia #ganarmusculo #consejosgym #fitness #ultimatefitness',
    frases: [
      { tipo: 'portada', objeto: 'mancuerna', eyebrow: 'Brazos', titulo: ['¿Por qué no', 'crecen tus brazos?'], texto: '¿Entrenas brazo y no crece? Probablemente falla una de estas cosas.' },
      { tipo: 'dato', etiqueta: 'El tríceps es', valor: '2/3', unidad: 'de tu brazo', nota: 'Y casi todos entrenan solo bíceps', texto: 'El tríceps es unos dos tercios del brazo, y la mayoría solo entrena bíceps.' },
      { tipo: 'punto', numero: '01', titulo: 'Rango completo', nota: 'Estira abajo, aprieta arriba', texto: 'Uno: usa el rango completo. Baja del todo y sube del todo, sin rebotes.' },
      { tipo: 'punto', numero: '02', titulo: 'Menos ego', nota: 'Sin balancear el cuerpo', texto: 'Dos: baja el peso. Si balanceas el cuerpo, el bíceps no trabaja.' },
      { tipo: 'dato', etiqueta: '03 · Volumen', valor: '6-10', unidad: 'series a la semana', nota: 'Para bíceps y para tríceps', texto: 'Tres: haz entre seis y diez series a la semana para cada uno.' },
      { tipo: 'punto', numero: '04', titulo: 'Come suficiente', nota: 'Sin calorías no hay crecimiento', texto: 'Cuatro: come suficiente. Sin calorías, el brazo no crece.' },
      { tipo: 'app', etiqueta: 'Añade ejercicios', captura: 'rutinas_3_anadidos', desplazar: 300, texto: 'En la app añades ejercicios de bíceps y tríceps a tu rutina en segundos.' },
      CTA,
    ],
  },
  {
    id: '20-cenar-carbohidratos',
    titulo: '¿Cenar carbohidratos engorda?',
    fondo: 'tiron',
    descripcion: 'Tu cuerpo no mira el reloj: cuentan las calorías del día. Con las mismas calorías, da igual que el arroz sea a mediodía o por la noche, y si entrenas por la tarde te ayuda a recuperar. Lo que sí engorda es comer de más, a cualquier hora.\n\nOrganiza tus comidas y ve tus calorías del día, gratis en ultimatefitnessuf.com (enlace en la bio).\n\n¿Tú cenas carbohidratos?',
    hashtags: '#gym #gymtok #carbohidratos #mitosdelgym #cena #dieta #perdergrasa #nutricion #fitness #ultimatefitness',
    frases: [
      { tipo: 'portada', objeto: 'plato', eyebrow: 'Mito', titulo: ['¿Cenar carbos', 'engorda?'], texto: '¿Cenar carbohidratos engorda? Vamos a desmontar este mito.' },
      { tipo: 'mito', mito: 'Los carbohidratos por la noche se convierten en grasa', verdad: 'Cuenta el total del día', texto: 'Tu cuerpo no mira el reloj: lo que cuenta son las calorías del día entero.' },
      { tipo: 'punto', numero: 'Ejemplo', titulo: 'Mismas calorías', nota: 'Mismo resultado, a la hora que sea', texto: 'Si comes lo mismo en total, da igual que el arroz sea a mediodía o por la noche.' },
      { tipo: 'punto', numero: 'Incluso', titulo: 'Te ayudan', nota: 'A recuperar si entrenas por la tarde', texto: 'Y si entrenas por la tarde, cenar carbohidratos te ayuda a recuperar.' },
      { tipo: 'punto', negativo: true, numero: 'Lo que sí engorda', titulo: 'Comer de más', nota: 'Como el picoteo después de cenar', texto: 'Lo que sí engorda es comer de más, a cualquier hora, como picar después de cenar.' },
      { tipo: 'plato', etiqueta: 'Una buena cena', texto: 'Una buena cena: medio plato de verdura, proteína y una ración de carbohidratos.' },
      { tipo: 'app', etiqueta: 'Tus comidas', captura: 'dieta_larga', desplazar: 900, texto: 'En la app organizas tus comidas y ves las calorías del día.' },
      CTA,
    ],
  },
];
