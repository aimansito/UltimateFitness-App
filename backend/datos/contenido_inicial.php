<?php

/**
 * Contenido inicial de Ultimate Fitness: alimentos, ejercicios, platos, rutinas y dietas.
 * Lo carga el comando `php bin/console app:cargar-contenido` (se puede ejecutar varias veces: no duplica).
 *
 * - Alimentos: valores por 100 g de porción comestible, de referencia estándar (BEDCA / USDA, redondeados).
 *   Cereales y pasta en seco; carnes y pescados en crudo salvo que el nombre diga otra cosa.
 * - Platos: ingredientes en gramos; las calorías y macros se calculan a partir de los alimentos.
 * - Rutinas: día 1 = lunes … 7 = domingo. Repeticiones 0 = ejercicio por tiempo (se indica en las notas).
 * - Dietas: cada comida rota por su lista de platos a lo largo de la semana.
 */

return [

    // nombre => [tipo, kcal, proteínas, hidratos, grasas, precio €/kg, descripción]
    'alimentos' => [
        // Frutas
        'Aguacate' => ['fruta', 160, 2.0, 8.5, 14.7, 6.0, 'Fruta rica en grasas monoinsaturadas y fibra.'],
        'Pera' => ['fruta', 57, 0.4, 15.2, 0.1, 2.2, 'Fruta jugosa con buen aporte de fibra.'],
        'Kiwi' => ['fruta', 61, 1.1, 14.7, 0.5, 3.5, 'Muy rico en vitamina C.'],
        'Uvas' => ['fruta', 69, 0.7, 18.1, 0.2, 3.0, 'Fruta dulce, fuente rápida de energía.'],
        'Piña' => ['fruta', 50, 0.5, 13.1, 0.1, 2.0, 'Fruta tropical refrescante.'],
        'Mango' => ['fruta', 60, 0.8, 15.0, 0.4, 3.5, 'Fruta tropical rica en vitamina A.'],
        'Sandía' => ['fruta', 30, 0.6, 7.6, 0.2, 1.0, 'Fruta muy hidratante y baja en calorías.'],
        'Frambuesas' => ['fruta', 52, 1.2, 11.9, 0.7, 14.0, 'Frutos rojos con mucha fibra y poco azúcar.'],
        // Verduras
        'Coliflor' => ['verdura', 25, 1.9, 5.0, 0.3, 2.0, 'Crucífera versátil y saciante.'],
        'Judías verdes' => ['verdura', 31, 1.8, 7.0, 0.2, 3.0, 'Verdura baja en calorías con fibra.'],
        'Espárragos verdes' => ['verdura', 20, 2.2, 3.9, 0.1, 6.0, 'Ideales a la plancha como guarnición.'],
        'Pepino' => ['verdura', 15, 0.7, 3.6, 0.1, 1.5, 'Muy hidratante, perfecto en crudo.'],
        'Berenjena' => ['verdura', 25, 1.0, 5.9, 0.2, 2.0, 'Base de pistos y asados.'],
        'Calabaza' => ['verdura', 26, 1.0, 6.5, 0.1, 1.5, 'Perfecta para cremas suaves.'],
        'Rúcula' => ['verdura', 25, 2.6, 3.7, 0.7, 12.0, 'Hoja verde de sabor intenso.'],
        'Puerro' => ['verdura', 61, 1.5, 14.2, 0.3, 2.5, 'Aporta sabor a cremas y guisos.'],
        'Tomate triturado' => ['verdura', 32, 1.6, 7.0, 0.3, 1.8, 'Tomate natural triturado, sin azúcar añadido.'],
        'Maíz dulce' => ['verdura', 86, 3.3, 19.0, 1.4, 4.0, 'Maíz en grano cocido, escurrido.'],
        // Proteínas
        'Ternera magra' => ['proteina', 137, 21.5, 0, 5.0, 14.0, 'Carne de ternera con un 5 % de grasa, en crudo.'],
        'Muslo de pollo sin piel' => ['proteina', 120, 19.7, 0, 4.1, 7.0, 'Contramuslo deshuesado y sin piel, en crudo.'],
        'Bacalao fresco' => ['proteina', 82, 18.0, 0, 0.7, 14.0, 'Pescado blanco muy magro.'],
        'Gambas peladas' => ['proteina', 85, 20.0, 0.2, 0.5, 15.0, 'Marisco muy proteico y bajo en grasa.'],
        'Atún fresco' => ['proteina', 109, 24.4, 0, 0.5, 18.0, 'Lomo de atún en crudo.'],
        'Caballa' => ['proteina', 205, 18.6, 0, 13.9, 8.0, 'Pescado azul rico en omega 3.'],
        'Jamón serrano' => ['proteina', 241, 30.5, 0, 13.0, 22.0, 'Jamón curado, mejor quitando la grasa visible.'],
        // Lácteos y bebidas vegetales
        'Skyr natural' => ['lacteo', 63, 11.0, 4.0, 0.2, 6.0, 'Lácteo islandés muy alto en proteína.'],
        'Kéfir' => ['lacteo', 61, 3.4, 4.7, 3.2, 3.5, 'Leche fermentada con probióticos.'],
        'Mozzarella fresca light' => ['lacteo', 165, 18.0, 1.5, 10.0, 10.0, 'Mozzarella con la mitad de grasa.'],
        'Queso curado' => ['lacteo', 410, 29.0, 0.5, 33.0, 24.0, 'Queso de oveja curado; mejor en raciones pequeñas.'],
        'Bebida de soja sin azúcar' => ['bebida', 33, 3.3, 0.5, 1.8, 1.6, 'Alternativa vegetal a la leche con proteína.'],
        // Cereales y derivados
        'Pasta blanca' => ['cereal', 358, 12.5, 72.0, 1.5, 1.8, 'Pasta de trigo duro, en seco.'],
        'Pan blanco de barra' => ['cereal', 266, 8.9, 51.0, 1.6, 3.0, 'Pan común de barra.'],
        'Tortilla de trigo integral' => ['cereal', 290, 9.0, 47.0, 7.0, 6.0, 'Tortilla para wraps.'],
        // Legumbres
        'Alubias blancas cocidas' => ['legumbre', 110, 7.0, 19.0, 0.5, 3.0, 'Alubias de bote, escurridas y enjuagadas.'],
        'Hummus' => ['legumbre', 166, 7.9, 14.3, 9.6, 8.0, 'Crema de garbanzos con tahini.'],
        // Grasas, semillas y otros
        'Aceitunas verdes' => ['grasa', 145, 1.0, 3.8, 15.3, 6.0, 'Fuente de grasa monoinsaturada.'],
        'Semillas de chía' => ['fruto_seco', 486, 16.5, 42.1, 30.7, 12.0, 'Ricas en fibra y omega 3.'],
        'Semillas de lino' => ['fruto_seco', 534, 18.3, 28.9, 42.2, 6.0, 'Mejor molidas para aprovechar el omega 3.'],
        'Mantequilla' => ['grasa', 717, 0.9, 0.1, 81.1, 10.0, 'Grasa láctea; usar con moderación.'],
        'Chocolate negro 85 %' => ['azucar', 598, 9.0, 19.0, 50.0, 18.0, 'Con poco azúcar; una onza es suficiente.'],
    ],

    // nombre => [tipo, grupo muscular, nivel, descripción]
    'ejercicios' => [
        'Flexiones' => ['compuesto', 'pecho', 'principiante', 'Manos algo más abiertas que los hombros, cuerpo recto de cabeza a talones. Baja el pecho casi hasta el suelo y empuja. Si cuesta, apoya las rodillas.'],
        'Flexiones en Pica' => ['compuesto', 'hombros', 'intermedio', 'Desde la posición de flexión, sube la cadera formando una V invertida y baja la cabeza hacia el suelo flexionando los codos. Trabaja los hombros sin material.'],
        'Sentadilla Goblet' => ['compuesto', 'piernas', 'principiante', 'Sujeta una mancuerna o kettlebell pegada al pecho. Baja con la espalda recta y las rodillas en la línea de los pies hasta romper el paralelo.'],
        'Sentadilla con Peso Corporal' => ['compuesto', 'piernas', 'principiante', 'Pies a la anchura de los hombros, brazos al frente. Baja controlando como si te sentaras y sube empujando con todo el pie.'],
        'Zancadas hacia Atrás' => ['compuesto', 'piernas', 'principiante', 'Da un paso largo hacia atrás y baja hasta que la rodilla trasera casi toque el suelo. Vuelve empujando con la pierna delantera. Alterna piernas.'],
        'Puente de Glúteos' => ['aislamiento', 'gluteos', 'principiante', 'Tumbado boca arriba con las rodillas flexionadas, eleva la cadera apretando glúteos hasta alinear rodillas, cadera y hombros. Mantén un segundo arriba.'],
        'Dominadas Supinas' => ['compuesto', 'espalda', 'intermedio', 'Agarre con las palmas hacia ti, a la anchura de los hombros. Sube hasta pasar la barbilla de la barra; implica más el bíceps que la dominada prona.'],
        'Remo con Barra' => ['compuesto', 'espalda', 'intermedio', 'Inclina el tronco unos 45 grados con la espalda neutra y lleva la barra al abdomen juntando las escápulas.'],
        'Press de Banca Inclinado con Barra' => ['compuesto', 'pecho', 'intermedio', 'Banco a 30 grados. Baja la barra a la parte alta del pecho y empuja sin despegar los glúteos del banco.'],
        'Superman' => ['aislamiento', 'espalda', 'principiante', 'Boca abajo, eleva a la vez brazos y piernas unos centímetros activando la zona lumbar y los glúteos. Baja despacio.'],
        'Bird Dog' => ['core', 'core', 'principiante', 'En cuadrupedia, extiende a la vez un brazo y la pierna contraria sin mover la cadera. Vuelve y cambia de lado.'],
        'Gato-Camello' => ['core', 'espalda', 'principiante', 'En cuadrupedia, alterna redondear la espalda hacia arriba y arquearla hacia abajo de forma lenta y controlada. Moviliza toda la columna.'],
        'Rotaciones Torácicas en Cuadrupedia' => ['core', 'espalda', 'principiante', 'En cuadrupedia, con una mano detrás de la cabeza, gira el tronco abriendo el codo hacia el techo. Mejora la movilidad de la espalda alta.'],
        'Movilidad de Cadera 90/90' => ['aislamiento', 'cadera', 'principiante', 'Sentado con ambas piernas flexionadas a 90 grados, gira las rodillas de un lado a otro manteniendo el tronco erguido.'],
        'Carrera Continua' => ['cardio', 'cardio', 'principiante', 'Correr a un ritmo en el que puedas mantener una conversación. Zancada corta y cadencia ligera.'],
        'Bicicleta Estática' => ['cardio', 'cardio', 'principiante', 'Ajusta el sillín a la altura de la cadera. Mantén una cadencia constante con resistencia moderada.'],
        'Remo Ergómetro' => ['cardio', 'fullbody', 'principiante', 'Empuja primero con las piernas, después inclina el tronco y termina tirando con los brazos. Vuelve en orden inverso.'],
        'Caminata Inclinada en Cinta' => ['cardio', 'cardio', 'principiante', 'Camina a paso rápido con la cinta inclinada entre un 8 y un 12 %, sin agarrarte a las barras.'],
    ],

    // nombre => [tipo de comida, dificultad, minutos, vegetariano, descripción, instrucciones, [alimento => gramos]]
    'platos' => [
        // Desayunos
        'Porridge de avena con frutos rojos y chía' => ['desayuno', 'facil', 10, true,
            'Desayuno saciante con hidratos de absorción lenta y fibra.',
            "1. Calienta la leche y añade la avena.\n2. Cocina 4-5 minutos removiendo hasta que espese.\n3. Sirve con los arándanos y la chía por encima.",
            ['Avena' => 60, 'Leche Semidesnatada' => 250, 'Arándanos' => 80, 'Semillas de chía' => 10]],
        'Tortilla de claras con espinacas y pan de centeno' => ['desayuno', 'facil', 10, true,
            'Desayuno alto en proteína y bajo en grasa.',
            "1. Saltea las espinacas con el aceite un minuto.\n2. Añade las claras batidas y cuaja a fuego medio.\n3. Acompaña con el pan de centeno tostado.",
            ['Claras de Huevo' => 200, 'Espinacas' => 60, 'Pan de centeno' => 60, 'Aceite de Oliva' => 5]],
        'Skyr con avena, nueces y fresas' => ['desayuno', 'facil', 5, true,
            'Bol rápido con mucha proteína y grasas saludables.',
            "1. Sirve el skyr en un bol.\n2. Añade la avena, las nueces troceadas y las fresas.\n3. Termina con un hilo de miel.",
            ['Skyr natural' => 250, 'Avena' => 30, 'Nueces' => 15, 'Fresas' => 100, 'Miel' => 10]],
        'Tostadas con tomate, aceite y jamón serrano' => ['desayuno', 'facil', 5, false,
            'El desayuno mediterráneo de siempre, equilibrado.',
            "1. Tuesta el pan.\n2. Ralla el tomate por encima y añade el aceite.\n3. Coloca el jamón sin la grasa visible.",
            ['Pan Integral' => 80, 'Tomate' => 100, 'Jamón serrano' => 40, 'Aceite de Oliva' => 5]],
        'Tortitas de avena y plátano' => ['desayuno', 'media', 15, true,
            'Tortitas sin harina refinada, ideales antes de entrenar.',
            "1. Tritura la avena, el plátano, el huevo y las claras.\n2. Haz tortitas pequeñas en una sartén antiadherente.\n3. Sirve con la miel.",
            ['Avena' => 50, 'Plátano' => 100, 'Huevo' => 60, 'Claras de Huevo' => 100, 'Miel' => 10]],
        'Batido de kéfir, mango y avena' => ['desayuno', 'facil', 5, true,
            'Batido cremoso con probióticos, perfecto para llevar.',
            "1. Pon todos los ingredientes en la batidora.\n2. Tritura hasta que quede homogéneo.",
            ['Kéfir' => 250, 'Mango' => 120, 'Avena' => 30]],

        // Media mañana
        'Yogur griego light con kiwi' => ['media_manana', 'facil', 2, true,
            'Tentempié ligero con proteína y vitamina C.',
            "1. Pela y trocea el kiwi.\n2. Mézclalo con el yogur.",
            ['Yogur Griego Light' => 170, 'Kiwi' => 150]],
        'Manzana con almendras' => ['media_manana', 'facil', 1, true,
            'Combinación sencilla de fibra y grasas saludables.',
            "1. Lava la manzana.\n2. Acompáñala con un puñado de almendras.",
            ['Manzana' => 180, 'Almendras' => 25]],
        'Tortitas de arroz con crema de cacahuete y plátano' => ['media_manana', 'facil', 3, true,
            'Energía rápida y duradera antes de entrenar.',
            "1. Unta la crema de cacahuete en las tortitas.\n2. Añade el plátano en rodajas.",
            ['Tortitas de Arroz' => 30, 'Crema de Cacahuete' => 20, 'Plátano' => 100]],
        'Queso fresco batido con frambuesas' => ['media_manana', 'facil', 2, true,
            'Mucha proteína y muy pocas calorías.',
            "1. Sirve el queso batido.\n2. Añade las frambuesas por encima.",
            ['Queso Fresco Batido 0%' => 250, 'Frambuesas' => 100]],
        'Bocadillo integral de pavo y mozzarella' => ['media_manana', 'facil', 5, false,
            'Bocadillo pequeño y proteico para media mañana.',
            "1. Abre el pan y añade el tomate en rodajas.\n2. Coloca el pavo y la mozzarella.",
            ['Pan Integral' => 50, 'Pechuga de Pavo' => 50, 'Mozzarella fresca light' => 30, 'Tomate' => 50]],

        // Almuerzos
        'Lentejas estofadas con verduras' => ['almuerzo', 'media', 35, true,
            'Guiso de cuchara completo, rico en hierro y fibra.',
            "1. Sofríe la cebolla, el pimiento y la zanahoria con el aceite.\n2. Añade la patata y cubre con agua o caldo; cuece 15 minutos.\n3. Incorpora las lentejas cocidas y cuece 10 minutos más.",
            ['Lentejas Cocidas' => 300, 'Zanahoria' => 60, 'Pimiento Rojo' => 50, 'Cebolla' => 50, 'Patata Cocida' => 100, 'Aceite de Oliva' => 10]],
        'Pollo a la plancha con arroz basmati y brócoli' => ['almuerzo', 'facil', 20, false,
            'El clásico del gimnasio: proteína magra, hidratos y verdura.',
            "1. Cuece el arroz 12 minutos.\n2. Cuece el brócoli al vapor 5 minutos.\n3. Haz la pechuga a la plancha y sirve con un chorrito de aceite.",
            ['Pechuga de pollo' => 160, 'Arroz Basmati' => 75, 'Brócoli' => 200, 'Aceite de Oliva' => 10]],
        'Salmón al horno con boniato y espárragos' => ['almuerzo', 'media', 30, false,
            'Rico en omega 3 y en hidratos de calidad.',
            "1. Asa el boniato en dados 20 minutos a 200 °C.\n2. Añade el salmón y los espárragos y hornea 12 minutos más.",
            ['Salmón' => 150, 'Boniato' => 250, 'Espárragos verdes' => 120, 'Aceite de Oliva' => 5]],
        'Ternera salteada con verduras y quinoa' => ['almuerzo', 'media', 25, false,
            'Salteado rápido con hierro y proteína completa.',
            "1. Cuece la quinoa 15 minutos y escúrrela.\n2. Saltea la ternera en tiras a fuego fuerte.\n3. Añade el pimiento y el calabacín, saltea 3 minutos y mezcla con la quinoa.",
            ['Ternera magra' => 150, 'Quinoa' => 60, 'Pimiento Rojo' => 80, 'Calabacín' => 120, 'Aceite de Oliva' => 10]],
        'Garbanzos con espinacas y huevo' => ['almuerzo', 'facil', 15, true,
            'Plato vegetariano completo y saciante.',
            "1. Rehoga el ajo laminado con el aceite.\n2. Añade las espinacas y, cuando se reduzcan, los garbanzos.\n3. Sirve con el huevo cocido en cuartos.",
            ['Garbanzos Cocidos' => 250, 'Espinacas' => 150, 'Huevo' => 60, 'Ajo' => 5, 'Aceite de Oliva' => 10]],
        'Pasta integral con atún y tomate' => ['almuerzo', 'facil', 15, false,
            'Plato de hidratos con proteína, fácil de preparar.',
            "1. Cuece la pasta según el envase.\n2. Calienta el tomate triturado con el aceite y el atún escurrido.\n3. Mezcla con la pasta.",
            ['Pasta Integral' => 80, 'Atún en Agua' => 80, 'Tomate triturado' => 150, 'Aceite de Oliva' => 5]],
        'Bacalao con pisto y patata' => ['almuerzo', 'media', 30, false,
            'Pescado blanco con verduras mediterráneas.',
            "1. Haz el pisto pochando cebolla, berenjena, calabacín y tomate con el aceite.\n2. Cocina el bacalao a la plancha o al horno.\n3. Sirve con la patata cocida.",
            ['Bacalao fresco' => 180, 'Berenjena' => 100, 'Calabacín' => 100, 'Tomate triturado' => 100, 'Cebolla' => 50, 'Patata Cocida' => 150, 'Aceite de Oliva' => 10]],
        'Tofu salteado con verduras y arroz integral' => ['almuerzo', 'media', 25, true,
            'Salteado vegetal alto en proteína.',
            "1. Cuece el arroz integral 25 minutos.\n2. Dora el tofu en dados.\n3. Añade el brócoli, la zanahoria y el pimiento, saltea y sirve con el arroz.",
            ['Tofu Firme' => 180, 'Arroz integral' => 70, 'Brócoli' => 120, 'Zanahoria' => 60, 'Pimiento Rojo' => 60, 'Aceite de Oliva' => 10]],
        'Muslo de pollo al horno con patata y ensalada' => ['almuerzo', 'facil', 40, false,
            'Asado sencillo y jugoso.',
            "1. Hornea el pollo y la patata en gajos con el aceite 35 minutos a 200 °C.\n2. Acompaña con lechuga y tomate.",
            ['Muslo de pollo sin piel' => 200, 'Patata Cocida' => 200, 'Lechuga' => 80, 'Tomate' => 100, 'Aceite de Oliva' => 10]],
        'Alubias blancas con verduras' => ['almuerzo', 'facil', 20, true,
            'Legumbre con verduras, ligera y nutritiva.',
            "1. Sofríe el puerro, la zanahoria y el pimiento con el aceite.\n2. Añade las alubias y un poco de caldo; cuece 10 minutos.",
            ['Alubias blancas cocidas' => 300, 'Puerro' => 60, 'Zanahoria' => 60, 'Pimiento Rojo' => 50, 'Aceite de Oliva' => 10]],

        // Meriendas
        'Kéfir con fresas y semillas de lino' => ['merienda', 'facil', 3, true,
            'Merienda ligera, buena para la digestión.',
            "1. Sirve el kéfir.\n2. Añade las fresas troceadas y el lino molido.",
            ['Kéfir' => 200, 'Fresas' => 120, 'Semillas de lino' => 10]],
        'Hummus con zanahoria y pepino' => ['merienda', 'facil', 5, true,
            'Crudités para picar con proteína vegetal.',
            "1. Corta la zanahoria y el pepino en bastones.\n2. Sírvelos con el hummus.",
            ['Hummus' => 60, 'Zanahoria' => 100, 'Pepino' => 100]],
        'Tostada de centeno con queso cottage y tomate' => ['merienda', 'facil', 3, true,
            'Merienda salada con proteína.',
            "1. Tuesta el pan.\n2. Unta el queso cottage y añade el tomate en rodajas.",
            ['Pan de centeno' => 40, 'Queso Cottage' => 100, 'Tomate' => 80]],
        'Skyr con plátano y miel' => ['merienda', 'facil', 2, true,
            'Dulce, cremoso y con mucha proteína.',
            "1. Sirve el skyr.\n2. Añade el plátano en rodajas y la miel.",
            ['Skyr natural' => 200, 'Plátano' => 100, 'Miel' => 10]],

        // Cenas
        'Tortilla de calabacín con ensalada' => ['cena', 'facil', 15, true,
            'Cena ligera y rápida.',
            "1. Pocha el calabacín en láminas con el aceite.\n2. Añade los huevos batidos y cuaja la tortilla.\n3. Acompaña con lechuga y tomate.",
            ['Huevo' => 120, 'Calabacín' => 150, 'Lechuga' => 80, 'Tomate' => 100, 'Aceite de Oliva' => 5]],
        'Gambas al ajillo con espárragos' => ['cena', 'facil', 10, false,
            'Cena proteica con muy pocas calorías.',
            "1. Dora el ajo en el aceite.\n2. Añade las gambas y los espárragos y saltea 3 minutos.",
            ['Gambas peladas' => 200, 'Espárragos verdes' => 150, 'Ajo' => 5, 'Aceite de Oliva' => 10]],
        'Caballa a la plancha con ensalada de tomate y aguacate' => ['cena', 'facil', 10, false,
            'Pescado azul con grasas saludables.',
            "1. Haz la caballa a la plancha por la piel.\n2. Prepara la ensalada con rúcula, tomate y aguacate.",
            ['Caballa' => 150, 'Tomate' => 150, 'Aguacate' => 50, 'Rúcula' => 40]],
        'Crema de calabaza y revuelto de champiñones' => ['cena', 'media', 30, true,
            'Cena reconfortante y ligera.',
            "1. Cuece la calabaza y el puerro y tritúralos con un poco del caldo.\n2. Saltea los champiñones y añade los huevos para hacer un revuelto.",
            ['Calabaza' => 300, 'Puerro' => 50, 'Champiñones' => 150, 'Huevo' => 120, 'Aceite de Oliva' => 10]],
        'Pechuga de pavo con coliflor asada' => ['cena', 'facil', 25, false,
            'Cena magra y saciante.',
            "1. Asa la coliflor en ramilletes con el aceite y especias 20 minutos a 200 °C.\n2. Haz el pavo a la plancha.",
            ['Pechuga de Pavo' => 150, 'Coliflor' => 300, 'Aceite de Oliva' => 10]],
        'Ensalada templada de quinoa, garbanzos y verduras' => ['cena', 'facil', 20, true,
            'Ensalada completa con proteína vegetal.',
            "1. Cuece la quinoa.\n2. Saltea el calabacín y el pimiento.\n3. Mezcla todo con los garbanzos, la rúcula y el aceite.",
            ['Quinoa' => 50, 'Garbanzos Cocidos' => 120, 'Calabacín' => 100, 'Pimiento Rojo' => 60, 'Rúcula' => 30, 'Aceite de Oliva' => 10]],
        'Wrap integral de atún, huevo y verduras' => ['cena', 'facil', 10, false,
            'Cena rápida para llevar.',
            "1. Calienta la tortilla.\n2. Rellena con el atún, el huevo cocido, la lechuga, el tomate y el maíz.\n3. Enrolla y corta por la mitad.",
            ['Tortilla de trigo integral' => 60, 'Atún en Agua' => 80, 'Huevo' => 60, 'Lechuga' => 40, 'Tomate' => 60, 'Maíz dulce' => 30]],
        'Revuelto de tofu con espinacas y pan integral' => ['cena', 'facil', 10, true,
            'Alternativa vegetal al revuelto de huevo.',
            "1. Desmenuza el tofu y saltéalo con el aceite y una pizca de cúrcuma.\n2. Añade las espinacas hasta que se reduzcan.\n3. Acompaña con el pan.",
            ['Tofu Firme' => 200, 'Espinacas' => 100, 'Pan Integral' => 40, 'Aceite de Oliva' => 5]],

        // Post-entreno
        'Batido de whey con plátano y avena' => ['post_entreno', 'facil', 3, true,
            'Recuperación completa: proteína e hidratos.',
            "1. Pon todo en la batidora.\n2. Tritura hasta que no queden grumos.",
            ['Proteína whey vainilla' => 30, 'Plátano' => 120, 'Avena' => 40, 'Leche desnatada' => 250]],
        'Bocadillo de pavo con miel' => ['post_entreno', 'facil', 3, false,
            'Hidratos rápidos y proteína tras entrenar.',
            "1. Abre el pan y unta la miel.\n2. Añade el pavo.",
            ['Pan blanco de barra' => 80, 'Pechuga de Pavo' => 60, 'Miel' => 15]],
    ],

    // nombre => [tipo, minutos, nivel, descripción, días]
    // días: número de día => [concepto, [[ejercicio, series, repeticiones, descanso (s), notas], ...]]; sin ejercicios = descanso
    'rutinas' => [
        'Fullbody principiante · 3 días' => ['gym', 50, 'principiante',
            'Rutina de cuerpo completo para empezar en el gimnasio. Tres días alternos con descanso entre medias. Usa un peso que te permita terminar cada serie con 2-3 repeticiones en reserva y súbelo poco a poco.',
            [
                1 => ['Fullbody A', [
                    ['Sentadilla Goblet', 3, 12, 90, null], ['Press mancuerna plano', 3, 10, 90, null], ['Jalón al pecho', 3, 12, 90, null],
                    ['Puente de Glúteos', 3, 15, 60, null], ['Elevaciones laterales', 3, 12, 60, null], ['Plancha Abdominal', 3, 0, 45, '30 segundos'],
                ]],
                2 => ['Descanso activo', []],
                3 => ['Fullbody B', [
                    ['Peso muerto rumano', 3, 10, 90, null], ['Press de Hombros con Mancuernas', 3, 10, 90, null], ['Remo con mancuerna', 3, 12, 90, 'Por brazo'],
                    ['Zancadas con Mancuernas', 3, 10, 90, 'Por pierna'], ['Curl Alterno con Mancuernas', 2, 12, 60, null], ['Dead Bug', 3, 10, 45, 'Por lado'],
                ]],
                4 => ['Descanso', []],
                5 => ['Fullbody C', [
                    ['Prensa de pierna', 3, 12, 90, null], ['Press de Pecho en Maquina', 3, 12, 90, null], ['Remo en Maquina Sentado', 3, 12, 90, null],
                    ['Hip Thrust con Barra', 3, 12, 90, null], ['Extension en Polea con Cuerda', 2, 12, 60, null], ['Bird Dog', 3, 10, 45, 'Por lado'],
                ]],
                6 => ['Descanso activo', []],
                7 => ['Descanso', []],
            ]],

        'Torso / Pierna · 4 días' => ['gym', 65, 'intermedio',
            'Rutina dividida en torso y pierna, dos veces por semana cada grupo. Lunes y martes, más fuerza (pocas repeticiones); jueves y viernes, más volumen.',
            [
                1 => ['Torso · fuerza', [
                    ['Press banca', 4, 6, 150, null], ['Remo con Barra', 4, 8, 120, null], ['Press Militar con Barra', 3, 8, 120, null],
                    ['Dominadas', 3, 8, 120, 'Con lastre o asistidas según tu nivel'], ['Curl de Biceps con Barra Z', 3, 10, 60, null], ['Extension de Triceps en Polea Alta', 3, 12, 60, null],
                ]],
                2 => ['Pierna · fuerza', [
                    ['Sentadilla', 4, 6, 180, null], ['Peso muerto rumano', 3, 8, 150, null], ['Prensa de pierna', 3, 10, 120, null],
                    ['Curl Femoral Tumbado', 3, 12, 90, null], ['Elevacion de Talones de Pie', 4, 15, 60, null], ['Plancha Abdominal', 3, 0, 45, '45 segundos'],
                ]],
                3 => ['Descanso', []],
                4 => ['Torso · volumen', [
                    ['Press mancuerna inclinado', 4, 10, 90, null], ['Remo en Polea Baja', 4, 12, 90, null], ['Elevaciones laterales', 4, 15, 60, null],
                    ['Cruces en Polea Alta', 3, 15, 60, null], ['Face pull en polea', 3, 15, 60, null], ['Curl martillo', 3, 12, 60, null], ['Press Frances con Mancuerna', 3, 12, 60, null],
                ]],
                5 => ['Pierna · volumen', [
                    ['Sentadilla Bulgara', 3, 10, 90, 'Por pierna'], ['Hip Thrust con Barra', 4, 10, 90, null], ['Extension de Cuadriceps', 3, 15, 60, null],
                    ['Zancada Caminando', 3, 12, 90, 'Pasos por pierna'], ['Elevacion de Talones Sentado', 4, 15, 60, null], ['Rueda Abdominal (Ab Wheel)', 3, 10, 60, null],
                ]],
                6 => ['Descanso activo', []],
                7 => ['Descanso', []],
            ]],

        'Push / Pull / Legs · 6 días' => ['gym', 70, 'avanzado',
            'Empuje, tirón y pierna dos veces por semana. Para personas con experiencia que pueden entrenar seis días y recuperarse bien. Domingo de descanso.',
            [
                1 => ['Empuje A', [
                    ['Press banca', 4, 8, 150, null], ['Press Militar Sentado', 3, 10, 120, null], ['Press mancuerna inclinado', 3, 10, 90, null],
                    ['Elevaciones Laterales en Polea', 4, 15, 60, null], ['Fondos en Paralelas (Pecho)', 3, 10, 90, null], ['Extension en Polea con Cuerda', 3, 12, 60, null],
                ]],
                2 => ['Tirón A', [
                    ['Dominadas Agarre Ancho', 4, 8, 120, null], ['Remo con Barra Pendlay', 4, 8, 120, null], ['Jalon al Pecho Agarre Cerrado', 3, 12, 90, null],
                    ['Face pull en polea', 3, 15, 60, null], ['Curl de Biceps con Barra Z', 3, 10, 60, null], ['Curl Martillo en Polea', 3, 12, 60, null],
                ]],
                3 => ['Pierna A', [
                    ['Sentadilla', 4, 8, 180, null], ['Peso muerto rumano', 4, 8, 150, null], ['Prensa de pierna', 3, 12, 120, null],
                    ['Curl Femoral Tumbado', 3, 12, 90, null], ['Elevacion de Talones de Pie', 4, 15, 60, null], ['Elevacion de Piernas Colgado', 3, 12, 60, null],
                ]],
                4 => ['Empuje B', [
                    ['Press de Banca Inclinado con Barra', 4, 8, 150, null], ['Press de Hombros con Mancuernas', 3, 10, 90, null], ['Cruces en Polea Alta', 3, 15, 60, null],
                    ['Elevaciones laterales', 4, 15, 60, null], ['Press Frances con Mancuerna', 3, 12, 60, null], ['Fondos de Triceps en Banco', 3, 15, 60, null],
                ]],
                5 => ['Tirón B', [
                    ['Peso muerto', 4, 5, 180, null], ['Remo en T con Barra', 4, 10, 120, null], ['Pull-over en Polea Alta', 3, 12, 60, null],
                    ['Pajaros en Polea', 3, 15, 60, null], ['Curl Alterno con Mancuernas', 3, 12, 60, null], ['Curl Concentrado', 2, 12, 60, null],
                ]],
                6 => ['Pierna B', [
                    ['Sentadilla Frontal', 4, 8, 150, null], ['Hip Thrust con Barra', 4, 10, 90, null], ['Sentadilla Bulgara', 3, 10, 90, 'Por pierna'],
                    ['Extension de Cuadriceps', 3, 15, 60, null], ['Elevacion de Talones Sentado', 4, 15, 60, null], ['Russian Twist con Disco', 3, 20, 45, null],
                ]],
                7 => ['Descanso', []],
            ]],

        'Fuerza 5×5 · 3 días' => ['fuerza', 60, 'intermedio',
            'Programa clásico de fuerza con los básicos. Alterna los entrenos A y B cada semana. Sube 2,5 kg cuando completes las 5 series de 5 repeticiones con buena técnica.',
            [
                1 => ['Entreno A', [
                    ['Sentadilla', 5, 5, 180, null], ['Press banca', 5, 5, 180, null], ['Remo con Barra', 5, 5, 180, null],
                ]],
                2 => ['Descanso', []],
                3 => ['Entreno B', [
                    ['Sentadilla', 5, 5, 180, null], ['Press Militar con Barra', 5, 5, 180, null], ['Peso muerto', 1, 5, 240, 'Una serie pesada después de calentar'],
                ]],
                4 => ['Descanso', []],
                5 => ['Entreno A', [
                    ['Sentadilla', 5, 5, 180, null], ['Press banca', 5, 5, 180, null], ['Remo con Barra', 5, 5, 180, null],
                ]],
                6 => ['Descanso', []],
                7 => ['Descanso', []],
            ]],

        'Glúteos y piernas · 4 días' => ['gym', 55, 'intermedio',
            'Rutina centrada en glúteos y piernas con un día de tren superior para mantener el equilibrio.',
            [
                1 => ['Glúteo A', [
                    ['Hip Thrust con Barra', 4, 10, 90, null], ['Sentadilla Sumo', 3, 12, 90, null], ['Patada de Gluteo en Polea', 3, 15, 60, 'Por pierna'],
                    ['Abduccion de Cadera Sentado', 3, 20, 60, null], ['Puente de Glúteos', 3, 20, 45, null],
                ]],
                2 => ['Tren superior', [
                    ['Jalón al pecho', 3, 12, 90, null], ['Press de Hombros con Mancuernas', 3, 12, 90, null], ['Remo con mancuerna', 3, 12, 60, 'Por brazo'],
                    ['Press de Pecho en Maquina', 3, 12, 60, null], ['Plancha Abdominal', 3, 0, 45, '40 segundos'],
                ]],
                3 => ['Descanso', []],
                4 => ['Pierna', [
                    ['Sentadilla Goblet', 4, 12, 90, null], ['Peso muerto rumano', 4, 10, 90, null], ['Zancadas con Mancuernas', 3, 12, 90, 'Por pierna'],
                    ['Extension de Cuadriceps', 3, 15, 60, null], ['Curl Femoral Tumbado', 3, 15, 60, null],
                ]],
                5 => ['Descanso', []],
                6 => ['Glúteo B', [
                    ['Hip Thrust a Una Pierna', 3, 12, 60, 'Por pierna'], ['Step-up a Cajon', 3, 12, 60, 'Por pierna'], ['Peso Muerto Sumo', 3, 10, 120, null],
                    ['Patada de Gluteo a Cuatro Patas', 3, 20, 45, 'Por pierna'], ['Dead Bug', 3, 12, 45, 'Por lado'],
                ]],
                7 => ['Descanso', []],
            ]],

        'Calistenia en casa · 3 días' => ['fuerza', 35, 'principiante',
            'Entrena sin material: solo tu peso corporal, una silla y una mesa firme. Ideal para empezar en casa.',
            [
                1 => ['Día 1', [
                    ['Sentadilla con Peso Corporal', 4, 15, 60, null], ['Flexiones', 4, 10, 60, 'Con rodillas apoyadas si hace falta'], ['Remo invertido', 4, 10, 60, 'Bajo una mesa firme'],
                    ['Zancadas hacia Atrás', 3, 12, 60, 'Por pierna'], ['Plancha Abdominal', 3, 0, 45, '30 segundos'],
                ]],
                2 => ['Descanso', []],
                3 => ['Día 2', [
                    ['Burpees', 4, 10, 60, null], ['Flexiones en Pica', 3, 8, 60, null], ['Sentadilla Bulgara', 3, 10, 60, 'Pie trasero en una silla, por pierna'],
                    ['Fondos de Triceps en Banco', 3, 12, 60, 'Con una silla'], ['Superman', 3, 15, 45, null], ['Mountain Climbers', 3, 0, 45, '30 segundos'],
                ]],
                4 => ['Descanso', []],
                5 => ['Día 3', [
                    ['Squat Jumps', 4, 12, 60, null], ['Flexiones Diamante', 3, 8, 60, null], ['Remo invertido', 4, 10, 60, 'Bajo una mesa firme'],
                    ['Puente de Glúteos', 3, 20, 45, null], ['Hollow Body Hold', 3, 0, 45, '20 segundos'], ['Bird Dog', 3, 10, 45, 'Por lado'],
                ]],
                6 => ['Descanso activo', []],
                7 => ['Descanso', []],
            ]],

        'HIIT quema grasa · 3 días' => ['cardio', 30, 'intermedio',
            'Entrenos cortos de alta intensidad. Haz cada circuito con el descanso indicado y calienta 5 minutos antes.',
            [
                1 => ['Circuito peso corporal', [
                    ['Burpees', 4, 10, 30, null], ['Jumping Jacks', 4, 0, 30, '40 segundos'], ['Mountain Climbers', 4, 0, 30, '30 segundos'],
                    ['Squat Jumps', 4, 12, 30, null], ['High Knees', 4, 0, 60, '30 segundos'],
                ]],
                2 => ['Descanso', []],
                3 => ['Circuito con material', [
                    ['Kettlebell Swing', 5, 15, 30, null], ['Battle Ropes - Ondas', 5, 0, 30, '30 segundos'], ['Box Jump', 4, 8, 45, null],
                    ['Medicine Ball Slam', 4, 12, 45, null], ['Bear Crawl', 3, 0, 60, '20 metros'],
                ]],
                4 => ['Descanso', []],
                5 => ['Intervalos', [
                    ['Sprint Intervalos', 8, 0, 40, '20 segundos a tope, 40 segundos andando'], ['Bicicleta Estática', 1, 0, 0, '10 minutos suaves para volver a la calma'],
                ]],
                6 => ['Descanso activo', []],
                7 => ['Descanso', []],
            ]],

        'Core y movilidad · 2 días' => ['gym', 25, 'principiante',
            'Sesiones cortas para fortalecer el abdomen y la zona lumbar y ganar movilidad. Se pueden combinar con cualquier otra rutina.',
            [
                2 => ['Movilidad y estabilidad', [
                    ['Gato-Camello', 2, 10, 30, null], ['Rotaciones Torácicas en Cuadrupedia', 2, 10, 30, 'Por lado'], ['Movilidad de Cadera 90/90', 2, 8, 30, 'Por lado'],
                    ['Dead Bug', 3, 10, 45, 'Por lado'], ['Bird Dog', 3, 10, 45, 'Por lado'], ['Plancha Abdominal', 3, 0, 45, '30 segundos'],
                ]],
                4 => ['Core', [
                    ['Plancha lateral', 3, 0, 45, '25 segundos por lado'], ['Hollow Body Hold', 3, 0, 45, '20 segundos'], ['Crunch Inverso', 3, 12, 45, null],
                    ['Superman', 3, 12, 45, null], ['Puente de Glúteos', 3, 15, 45, null], ['Movilidad de Cadera 90/90', 2, 8, 30, 'Por lado'],
                ]],
            ]],

        'Iniciación al running 5K · 3 días' => ['cardio', 35, 'principiante',
            'Para pasar de no correr a completar 5 km. Alterna carrera y caminata; cuando te resulte cómodo, alarga los tramos corriendo.',
            [
                1 => ['Intervalos suaves', [
                    ['Skips Running Drill', 2, 0, 30, '20 metros'], ['Carrera Continua', 6, 0, 120, '1 minuto corriendo + 2 minutos caminando'],
                ]],
                2 => ['Descanso', []],
                3 => ['Intervalos y fuerza', [
                    ['Carrera Continua', 5, 0, 60, '2 minutos corriendo + 1 minuto caminando'], ['Sentadilla con Peso Corporal', 2, 15, 45, null], ['Puente de Glúteos', 2, 15, 45, null],
                ]],
                4 => ['Descanso', []],
                5 => ['Descanso', []],
                6 => ['Carrera larga', [
                    ['Carrera Continua', 1, 0, 0, '20-25 minutos a ritmo de conversación'], ['Gato-Camello', 2, 10, 30, 'Para estirar al terminar'],
                ]],
                7 => ['Descanso', []],
            ]],

        'Hipertrofia Weider · 5 días' => ['gym', 60, 'avanzado',
            'Un grupo muscular por día, con mucho volumen. Pensada para ganar masa muscular con buena alimentación y descanso.',
            [
                1 => ['Pecho', [
                    ['Press banca', 4, 8, 120, null], ['Press mancuerna inclinado', 4, 10, 90, null], ['Fondos en Paralelas (Pecho)', 3, 10, 90, null],
                    ['Pec Deck (Contractora)', 3, 15, 60, null], ['Cruces en Polea Alta', 3, 15, 60, null],
                ]],
                2 => ['Espalda', [
                    ['Dominadas', 4, 8, 120, null], ['Remo con Barra', 4, 8, 120, null], ['Jalon al Pecho Agarre Cerrado', 3, 12, 90, null],
                    ['Remo en Polea Baja', 3, 12, 90, null], ['Hiperextensiones Lumbares', 3, 15, 60, null],
                ]],
                3 => ['Pierna', [
                    ['Sentadilla', 4, 8, 180, null], ['Prensa de pierna', 4, 12, 120, null], ['Peso muerto rumano', 3, 10, 120, null],
                    ['Extension de Cuadriceps', 3, 15, 60, null], ['Curl Femoral Tumbado', 3, 12, 60, null], ['Elevacion de Talones de Pie', 4, 15, 60, null],
                ]],
                4 => ['Hombro', [
                    ['Press Militar con Barra', 4, 8, 120, null], ['Elevaciones laterales', 4, 15, 60, null], ['Pajaros en Polea', 4, 15, 60, null],
                    ['Face pull en polea', 3, 15, 60, null], ['Encogimientos de Hombros', 3, 12, 60, null],
                ]],
                5 => ['Brazos y core', [
                    ['Curl de Biceps con Barra Z', 4, 10, 60, null], ['Press Cerrado de Banca', 4, 8, 90, null], ['Curl martillo', 3, 12, 60, null],
                    ['Extension en Polea con Cuerda', 3, 12, 60, null], ['Curl Concentrado', 3, 12, 60, null], ['Extension de Triceps sobre la Cabeza', 3, 12, 60, null],
                    ['Rueda Abdominal (Ab Wheel)', 3, 10, 60, null],
                ]],
                6 => ['Descanso', []],
                7 => ['Descanso', []],
            ]],
    ],

    // nombre => [descripción, [comida => [platos que rotan cada día]]]
    'dietas' => [
        'Definición' => ['Plan para perder grasa conservando el músculo: déficit moderado, mucha proteína y verdura en cada comida. Ajusta las raciones de hidratos según tu hambre y tu actividad.', [
            'desayuno' => ['Tortilla de claras con espinacas y pan de centeno', 'Porridge de avena con frutos rojos y chía', 'Skyr con avena, nueces y fresas'],
            'media_manana' => ['Yogur griego light con kiwi', 'Queso fresco batido con frambuesas', 'Manzana con almendras'],
            'almuerzo' => ['Pollo a la plancha con arroz basmati y brócoli', 'Bacalao con pisto y patata', 'Lentejas estofadas con verduras', 'Ternera salteada con verduras y quinoa', 'Salmón al horno con boniato y espárragos'],
            'merienda' => ['Hummus con zanahoria y pepino', 'Kéfir con fresas y semillas de lino', 'Tostada de centeno con queso cottage y tomate'],
            'cena' => ['Gambas al ajillo con espárragos', 'Pechuga de pavo con coliflor asada', 'Tortilla de calabacín con ensalada', 'Crema de calabaza y revuelto de champiñones'],
        ]],
        'Mantenimiento equilibrado' => ['Plan variado para mantener el peso con energía para entrenar: todos los grupos de alimentos, legumbres varias veces por semana y pescado azul.', [
            'desayuno' => ['Tostadas con tomate, aceite y jamón serrano', 'Porridge de avena con frutos rojos y chía', 'Batido de kéfir, mango y avena', 'Skyr con avena, nueces y fresas'],
            'media_manana' => ['Manzana con almendras', 'Bocadillo integral de pavo y mozzarella', 'Yogur griego light con kiwi'],
            'almuerzo' => ['Lentejas estofadas con verduras', 'Pasta integral con atún y tomate', 'Muslo de pollo al horno con patata y ensalada', 'Salmón al horno con boniato y espárragos', 'Garbanzos con espinacas y huevo', 'Ternera salteada con verduras y quinoa'],
            'merienda' => ['Skyr con plátano y miel', 'Hummus con zanahoria y pepino', 'Kéfir con fresas y semillas de lino'],
            'cena' => ['Caballa a la plancha con ensalada de tomate y aguacate', 'Tortilla de calabacín con ensalada', 'Wrap integral de atún, huevo y verduras', 'Ensalada templada de quinoa, garbanzos y verduras'],
        ]],
        'Volumen limpio' => ['Plan para ganar masa muscular con superávit moderado: cinco comidas más el post-entreno, hidratos alrededor del entrenamiento y proteína repartida durante el día.', [
            'desayuno' => ['Tortitas de avena y plátano', 'Batido de kéfir, mango y avena', 'Tostadas con tomate, aceite y jamón serrano', 'Porridge de avena con frutos rojos y chía'],
            'media_manana' => ['Tortitas de arroz con crema de cacahuete y plátano', 'Bocadillo integral de pavo y mozzarella', 'Manzana con almendras'],
            'almuerzo' => ['Pasta integral con atún y tomate', 'Pollo a la plancha con arroz basmati y brócoli', 'Ternera salteada con verduras y quinoa', 'Salmón al horno con boniato y espárragos', 'Muslo de pollo al horno con patata y ensalada'],
            'merienda' => ['Skyr con plátano y miel', 'Tostada de centeno con queso cottage y tomate'],
            'post_entreno' => ['Batido de whey con plátano y avena', 'Bocadillo de pavo con miel'],
            'cena' => ['Wrap integral de atún, huevo y verduras', 'Caballa a la plancha con ensalada de tomate y aguacate', 'Tofu salteado con verduras y arroz integral', 'Gambas al ajillo con espárragos'],
        ]],
        'Vegetariana' => ['Plan ovolactovegetariano completo: proteína de legumbres, tofu, huevos y lácteos en cada comida principal.', [
            'desayuno' => ['Porridge de avena con frutos rojos y chía', 'Tortitas de avena y plátano', 'Skyr con avena, nueces y fresas', 'Tortilla de claras con espinacas y pan de centeno'],
            'media_manana' => ['Queso fresco batido con frambuesas', 'Manzana con almendras', 'Tortitas de arroz con crema de cacahuete y plátano'],
            'almuerzo' => ['Lentejas estofadas con verduras', 'Tofu salteado con verduras y arroz integral', 'Garbanzos con espinacas y huevo', 'Alubias blancas con verduras'],
            'merienda' => ['Hummus con zanahoria y pepino', 'Kéfir con fresas y semillas de lino', 'Tostada de centeno con queso cottage y tomate'],
            'cena' => ['Revuelto de tofu con espinacas y pan integral', 'Crema de calabaza y revuelto de champiñones', 'Ensalada templada de quinoa, garbanzos y verduras', 'Tortilla de calabacín con ensalada'],
        ]],
        'Mediterránea' => ['Basada en la dieta mediterránea: aceite de oliva, legumbres, pescado, verduras de temporada y fruta a diario.', [
            'desayuno' => ['Tostadas con tomate, aceite y jamón serrano', 'Skyr con avena, nueces y fresas', 'Porridge de avena con frutos rojos y chía'],
            'media_manana' => ['Manzana con almendras', 'Yogur griego light con kiwi'],
            'almuerzo' => ['Garbanzos con espinacas y huevo', 'Bacalao con pisto y patata', 'Lentejas estofadas con verduras', 'Salmón al horno con boniato y espárragos', 'Alubias blancas con verduras', 'Muslo de pollo al horno con patata y ensalada'],
            'merienda' => ['Hummus con zanahoria y pepino', 'Tostada de centeno con queso cottage y tomate'],
            'cena' => ['Caballa a la plancha con ensalada de tomate y aguacate', 'Gambas al ajillo con espárragos', 'Tortilla de calabacín con ensalada', 'Ensalada templada de quinoa, garbanzos y verduras'],
        ]],
        'Alta en proteína' => ['Plan con proteína en todas las comidas para quien entrena fuerza a menudo. Útil tanto para definir como para ganar músculo ajustando los hidratos.', [
            'desayuno' => ['Tortilla de claras con espinacas y pan de centeno', 'Skyr con avena, nueces y fresas', 'Tortitas de avena y plátano'],
            'media_manana' => ['Queso fresco batido con frambuesas', 'Bocadillo integral de pavo y mozzarella', 'Yogur griego light con kiwi'],
            'almuerzo' => ['Pollo a la plancha con arroz basmati y brócoli', 'Ternera salteada con verduras y quinoa', 'Pasta integral con atún y tomate', 'Bacalao con pisto y patata'],
            'merienda' => ['Skyr con plátano y miel', 'Tostada de centeno con queso cottage y tomate'],
            'post_entreno' => ['Batido de whey con plátano y avena'],
            'cena' => ['Pechuga de pavo con coliflor asada', 'Gambas al ajillo con espárragos', 'Wrap integral de atún, huevo y verduras', 'Caballa a la plancha con ensalada de tomate y aguacate'],
        ]],
    ],
];
