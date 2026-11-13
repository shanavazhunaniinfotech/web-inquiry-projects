/* =========================================================
   Granite Travel Trade Expos — V2 "Now Boarding"
   ========================================================= */
(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isCompact = () => innerWidth <= 760;

  /* ================= DATA ================= */
  const CITIES = [
    { id: "lon", n: "London", p: "ON", code: "YXU", d: "2027-04-05", tz: "-04:00", s: "spring", leg: 0, x: 455, y: 432, l: [0, 26, "middle"] },
    { id: "kw", n: "Kitchener-Waterloo", short: "Kitchener", p: "ON", code: "YKF", d: "2027-04-06", tz: "-04:00", s: "spring", leg: 0, x: 488, y: 382, l: [-16, 5, "end"] },
    { id: "bar", n: "Barrie", p: "ON", code: "YLK", d: "2027-04-07", tz: "-04:00", s: "spring", leg: 0, x: 532, y: 322, l: [0, -18, "middle"] },
    { id: "osh", n: "Oshawa", p: "ON", code: "YOO", d: "2027-04-08", tz: "-04:00", s: "spring", leg: 0, x: 618, y: 378, l: [0, 28, "middle"] },
    { id: "stj", n: "St. John's", p: "NL", code: "YYT", d: "2027-05-31", tz: "-02:30", s: "spring", leg: 1, x: 935, y: 196, l: [0, -18, "middle"] },
    { id: "hal", n: "Halifax", p: "NS", code: "YHZ", d: "2027-06-02", tz: "-03:00", s: "spring", leg: 1, x: 850, y: 322, l: [16, 5, "start"] },
    { id: "mon", n: "Moncton", p: "NB", code: "YQM", d: "2027-06-03", tz: "-03:00", s: "spring", leg: 1, x: 815, y: 248, l: [0, -18, "middle"] },
    { id: "win", n: "Winnipeg", p: "MB", code: "YWG", d: "2027-10-05", tz: "-05:00", s: "fall", leg: 2, x: 362, y: 196, l: [0, -18, "middle"] },
    { id: "rd", n: "Red Deer", p: "AB", code: "YQF", d: "2027-10-06", tz: "-06:00", s: "fall", leg: 2, x: 168, y: 118, l: [0, -18, "middle"] },
    { id: "kel", n: "Kelowna", p: "BC", code: "YLW", d: "2027-10-07", tz: "-07:00", s: "fall", leg: 2, x: 82, y: 222, l: [0, 28, "middle"] },
    { id: "ott", n: "Ottawa", p: "ON", code: "YOW", d: "2027-11-01", tz: "-04:00", s: "fall", leg: 3, x: 702, y: 276, l: [0, -18, "middle"] },
    { id: "kin", n: "Kingston", p: "ON", code: "YGK", d: "2027-11-02", tz: "-04:00", s: "fall", leg: 3, x: 690, y: 345, l: [0, 28, "middle"] },
    { id: "mar", n: "Markham", p: "ON", code: "YKZ", d: "2027-11-03", tz: "-04:00", s: "fall", leg: 3, x: 572, y: 398, l: [-14, 5, "end"] },
    { id: "ham", n: "Hamilton", p: "ON", code: "YHM", d: "2027-11-04", tz: "-04:00", s: "fall", leg: 3, x: 526, y: 452, l: [0, 28, "middle"] },
  ];
  CITIES.forEach((c, i) => { c.i = i; c.start = new Date(`${c.d}T16:00:00${c.tz}`); c.end = new Date(`${c.d}T20:00:00${c.tz}`); c.flight = "GT" + (101 + i); });
  const nextExpo = () => CITIES.find(c => c.end > new Date()) || CITIES[CITIES.length - 1];
  const VIDEOS = { zp0zezI4tuI: "Jose Cervera · BlueBay Hotels & Resorts", xg_gZBNSCDA: "Nicole Perez · Princess Hotels & Resorts", KSQx12RlJkE: "Herbert Byaruhanga · Bird Uganda Safaris", WwtXEpUUTTE: "Luis Chaverri · Amstar DMC", PEZIhQZDFyU: "Gavin Jimenez · Sirenis Hotels & Resorts" };
  const QUOTES = [
    ["I would highly recommend these shows for suppliers — the smaller shows allow for better connections with the travel agents. Our time together was not rushed as happens at the bigger shows. A win, win.", "Pam Bassett", "BDM Canada, Oasis Hotels & Resorts"],
    ["This was one of the best planned events I have been to post-COVID, and I look forward to attending the next Granite Travel Trade Expo.", "Karen K.", "Travel Consultant, Victoria BC"],
    ["What was really important to us was the time to talk with qualified travel agents — in cities we normally would not have a chance to visit. Great job to Brad and his team.", "Nieves Ricardo", "Cuba Tourist Board"],
    ["All the events were perfectly organized. The venues were well known and well located, and the attendees were high-quality travel advisors representing real business for suppliers.", "Karina Fuentes", "BDM, Catalonia Hotels & Resorts"],
  ];

  /* ================= I18N ================= */
  const LOC = { en: "en-CA", es: "es-MX", fr: "fr-CA" };
  const T = {
    es: {
      "nav.route": "Ruta", "nav.why": "Por qué Granite", "nav.voices": "Testimonios", "nav.exhibit": "Exponer", "nav.agents": "Agentes", "nav.gallery": "Galería", "nav.contact": "Contacto",
      "cta.pass": "Obtén tu pase", "cta.exhibitor": "Pase de abordar expositor", "cta.advisor": "Soy agente de viajes",
      "hero.kicker": "Abordando ahora · Primavera y otoño 2027", "hero.l1": "El comercio turístico de Canadá", "hero.l2": "aterriza en",
      "hero.lead": "Expos boutique que llevan destinos, resorts, navieras y operadores de todo el mundo directamente a los mejores agentes de viaje en los mercados secundarios más influyentes de Canadá.",
      "b.time": "Fecha", "b.dest": "Destino", "b.flight": "Vuelo", "b.gate": "Puerta", "b.status": "Estado", "b.local": "Toronto", "b.next": "Próxima salida",
      "route.kicker": "La ruta 2027", "route.stops": "escalas", "route.hint": "Desplázate para volar la gira ↓",
      "st.k1": "Destinos", "st.v1": "ciudades canadienses", "st.k2": "Agentes a bordo", "st.v2": "en una sola serie", "st.k3": "Expositores", "st.v3": "marcas globales en 2026", "st.k4": "Tiempo de vuelo", "st.v4": "cara a cara en cada expo",
      "pp.kicker": "Boutique por diseño · Potente por impacto", "pp.title": 'No somos la feria más grande del país. <span class="hl">Ese es el punto.</span>',
      "pp.lede": "Cuando los proveedores llegan a la comunidad del agente, se nota. Se agradece. Y se convierte. Hojea el pasaporte.",
      "pp.holder": "Titular", "pp.type": "Tipo", "pp.typev": "Proveedor turístico global", "pp.valid": "Válido", "pp.issued": "Emitido por",
      "pp.p1": "Conversaciones significativas, cara a cara", "pp.p1t": "Tiempo individual y sin prisas en tu mesa — no un discurso de tres minutos en un pasillo lleno.",
      "pp.p2": "Mejor formación de producto", "pp.p2t": "Presentaciones estructuradas ante una sala sentada y atenta de agentes.",
      "pp.p3": "Relaciones más profundas", "pp.p3t": "Las cenas de networking convierten primeras reuniones en socios de venta a largo plazo.",
      "pp.p4": "Impulso real de ventas", "pp.p4t": "Los agentes salen con conocimiento que pueden reservar a la mañana siguiente.",
      "pp.lim": "Limitado por diseño", "pp.l1": "Espacios de presentación limitados", "pp.l2": "Espacio de expositores limitado por mercado", "pp.l3": "Patrocinios exclusivos por categoría a solicitud", "pp.early": "Asegura tu lugar pronto",
      "ck.kicker": "El itinerario de esta noche", "ck.title": 'Una velada. <span class="hl">Tres actos.</span>',
      "ck.a1": "Presentaciones de proveedores", "ck.a1t": "Sesiones moderadas con video. Cada proveedor tiene la sala.", "ck.a2": "Feria de proveedores", "ck.a2t": "Mesas vestidas, señalización, folletos y promociones — conversaciones sin prisa.", "ck.a3": "Cena ligera y sorteos", "ck.a3t": "Una cena de networking y premios que envían a cada agente feliz a casa.",
      "cb.kicker": "Entretenimiento a bordo", "cb.title": 'Asientos de ventana con <span class="hl">las mejores vistas.</span>', "cb.lede": "Cinco expositores, cinco clips grabados en la feria. Sube una persiana — toca para ver.", "cb.pa": "Anuncio a los pasajeros",
      "tk.kicker": "Registro de expositores 2027", "tk.title": 'Imprime tu <span class="hl">pase de abordar.</span>', "tk.lede": "Elige tus escalas y mira bajar tu tarifa. El estatus de viajero frecuente se activa solo — Platino expone desde $1,116 CAD por expo.",
      "tk.brand": "Nombre en el pase", "tk.brandph": "Tu marca", "tk.class": "Clase", "tk.c1": "Expositor", "tk.c1t": "Mesa, señalización, cena, logo web", "tk.c2": "Presentador", "tk.wait": "Lista de espera", "tk.c2t": "Agotado · únete a la lista",
      "tk.stops": "Elige tus escalas", "tk.sp": "Primavera", "tk.fa": "Otoño", "tk.all": "Las 14", "tk.clr": "Borrar", "tk.status": "Estatus de viajero frecuente", "tk.hst": "Agregar 13% HST (facturación en Canadá)",
      "tk.bp": "Pase de abordar · Expositor", "tk.pax": "Pasajero", "tk.from": "Desde", "tk.to": "Hasta", "tk.stopsS": "Escalas", "tk.classS": "Clase", "tk.statusS": "Estatus", "tk.dates": "Fechas", "tk.base": "Tarifa base", "tk.disc": "Descuento por estatus", "tk.tax": "HST",
      "tk.total": "Total CAD", "tk.per": "por expo", "tk.dep": "Depósito 50%", "tk.tear": "← arrastra para cortar y registrarte", "tk.checkin": "Check-in y registro",
      "tk.fine": "El 50% restante vence 90 días antes de cada serie. Cada espacio: señalización a color · acceso directo a agentes locales · cena de networking · logo en el sitio · mesa vestida de 6–8 pies.",
      "ag.kicker": "Llamado a todos los agentes de viaje", "ag.title": 'Tu vuelo es gratis. <span class="hl">Los beneficios son reales.</span>', "ag.lede": "Aprende de las marcas que vendes, conoce a sus líderes de ventas, cena por nuestra cuenta — y quizás llévate un premio.",
      "ag.p1": "Tarjeta Mastercard de regalo para los primeros 50 agentes en cada expo", "ag.p2": "Destinos, resorts, navieras y operadores", "ag.free": "Gratis", "ag.p3": "Presentaciones, cena y sorteos incluidos",
      "ag.window": "El registro de agentes abre 5 semanas antes de cada expo", "ag.ph": "tu@agencia.com", "ag.notify": "Avísame", "ag.tag1": "Prioridad · Primeros 50", "ag.tag2": "Tarjeta Mastercard de regalo en cada expo 2027", "ag.hint": "Toma la etiqueta y balancéala",
      "bg.kicker": "Reclamo de equipaje · Patrocinadores 2026", "bg.s1": "Patrocinador hotelero", "bg.s2": "Patrocinador de tarjetas", "bg.s3": "Socio de experiencia ártica", "bg.title": 'Algunas marcas que <span class="hl">viajan con nosotros.</span>', "bg.hint": "Arrastra la banda para girarla",
      "pc.kicker": "Granite Productions · eventos anteriores", "pc.title": 'Postales desde <span class="hl">el camino.</span>', "pc.lede": "Galas, conferencias, lanzamientos y expos — producidos en casa y capturados por nuestro equipo. Arrástralas. Toca para voltear.", "pc.shuffle": "Barajar", "pc.all": "Todas las galerías",
      "nw.title": 'Extra, <span class="hl">extra.</span>', "nw.all": "Todos los comunicados", "nw.read": "Leer artículo",
      "cr.kicker": "Tu tripulación hoy", "cr.title": 'Volado por gente que <span class="hl">vive el turismo.</span>', "cr.r1": "Director General", "cr.r2": "Director Creativo", "cr.r3": "Maestro de ceremonias y embajador", "cr.r4": "Ventas", "cr.r5": "Consultor de eventos",
      "cr.b1": "Cofundó Quadra Innovations y Granite Productions en 2010 y lanzó Granite Travel Trade Expos en 2023.", "cr.b2": "Más de 20 años en tecnología, de Adobe Acrobat a la fotografía 360° — captura el foto y video de cada expo.", "cr.b3": "Más de 30 años en la industria, incluido Director Nacional de Ventas de Bahia Principe en Canadá.", "cr.b4": "Más de 40 años en operadores y hoteles, incluidos 16 años al frente del mercado canadiense de Barceló.", "cr.b5": "Una perspectiva internacional forjada en salud, tecnología, educación, turismo y filantropía.",
      "fn.title": 'Construye relaciones. <span class="hl">Impulsa tu negocio.</span>', "fn.kicker": "Anuncios de abordaje", "fn.h": "Entérate primero de las próximas expos.", "fn.ph": "Correo electrónico", "fn.join": "Unirme", "fn.sup": "Soy proveedor", "fn.agt": "Soy agente", "ft.top": "Volver a la puerta ↑",
      "ci.kicker": "Check-in en línea", "ci.title": "Confirma tu pase de abordar", "ci.s1": "Pasajero", "ci.s2": "Pago", "ci.s3": "Abordar", "ci.company": "Empresa *", "ci.contact": "Contacto *", "ci.phone": "Teléfono *", "ci.city": "Ciudad *", "ci.country": "País *",
      "ci.cur": "Moneda", "ci.amt": "Pagar ahora", "ci.dep": "Depósito 50%", "ci.full": "Monto total", "ci.method": "Método", "ci.cc": "Tarjeta +3%", "ci.wire": "Transferencia", "ci.terms": "Acepto los términos de pago y la política de cancelación.", "ci.due": "A pagar hoy",
      "ci.done": "Pase emitido. Nos vemos en la gira.", "ci.donet": "Este es un prototipo de diseño — en el sitio real tu registro y enlace de pago se enviarían al instante.", "ci.back": "Atrás", "ci.next": "Continuar",
      _: { status: ["EMBARCANDO", "A TIEMPO", "PROGRAMADO"], statusS: ["EMBARQUE", "A TIEMPO", "PROGRAM."], legs: ["Tramo 1 · Primavera · Ontario", "Tramo 2 · Primavera · Atlántico", "Tramo 3 · Otoño · Oeste", "Tramo 4 · Otoño · Ontario"], legText: ["La primavera abre en el sur de Ontario — cuatro noches, cuatro mercados, del 5 al 8 de abril.", "Luego al este, a Atlántico: St. John's, Halifax y Moncton, del 31 de mayo al 3 de junio.", "El otoño despega en el oeste: Winnipeg, Red Deer y Kelowna, del 5 al 7 de octubre.", "Y de regreso a Ontario para cerrar el año: de Ottawa a Hamilton, del 1 al 4 de noviembre."], regions: ["OESTE", "ONTARIO", "ATLÁNTICO"], opens: (c, n, d) => `El registro de agentes para <b>${c}</b> abre el <b>${d}</b>.`, openNow: c => `¡El registro para <b>${c}</b> está abierto!`, days: "DÍAS", tierNone: "SIN ESTATUS", toNext: (n, t, p) => `${n} escala${n > 1 ? "s" : ""} más para ${t} (−${p}%)`, maxed: "Platino desbloqueado — la mejor tarifa.", pick: "Elige al menos una escala para tu pase.", waitlist: "Añadido a la lista de presentadores — con tarifa de expositor por ahora.", notify: "Te avisaremos cuando abra el registro.", invalid: "Ingresa un correo válido.", thanks: "¡Listo! Estás en la lista.", submit: "Emitir pase", final: ["ULTIMA LLAMADA", "PUERTA 2027", "ABORDANDO"], brand: "TU MARCA", ex: "EXPOSITOR", pr: "PRESENTADOR*" },
    },
    fr: {
      "nav.route": "Itinéraire", "nav.why": "Pourquoi Granite", "nav.voices": "Témoignages", "nav.exhibit": "Exposer", "nav.agents": "Conseillers", "nav.gallery": "Galerie", "nav.contact": "Contact",
      "cta.pass": "Votre carte d'embarquement", "cta.exhibitor": "Carte d'embarquement exposant", "cta.advisor": "Je suis conseiller en voyages",
      "hero.kicker": "Embarquement immédiat · Printemps et automne 2027", "hero.l1": "L'industrie du voyage", "hero.l2": "atterrit à",
      "hero.lead": "Des salons-boutiques qui amènent destinations, complexes hôteliers, croisiéristes et voyagistes du monde entier directement aux meilleurs conseillers des marchés régionaux les plus influents du Canada.",
      "b.time": "Date", "b.dest": "Destination", "b.flight": "Vol", "b.gate": "Porte", "b.status": "Statut", "b.local": "Toronto", "b.next": "Prochain départ",
      "route.kicker": "L'itinéraire 2027", "route.stops": "escales", "route.hint": "Faites défiler pour voler la tournée ↓",
      "st.k1": "Destinations", "st.v1": "villes canadiennes choisies", "st.k2": "Conseillers à bord", "st.v2": "en une seule série", "st.k3": "Exposants", "st.v3": "marques internationales en 2026", "st.k4": "Temps de vol", "st.v4": "de rencontres par salon",
      "pp.kicker": "Boutique par nature · Puissant par impact", "pp.title": 'Nous ne sommes pas le plus grand salon au pays. <span class="hl">C\'est voulu.</span>',
      "pp.lede": "Quand les fournisseurs viennent dans la communauté des conseillers, ça se remarque. Ça s'apprécie. Et ça se concrétise. Feuilletez le passeport.",
      "pp.holder": "Titulaire", "pp.type": "Type", "pp.typev": "Fournisseur touristique mondial", "pp.valid": "Valide", "pp.issued": "Délivré par",
      "pp.p1": "Des conversations en personne qui comptent", "pp.p1t": "Du temps en tête-à-tête à votre table — pas un pitch de trois minutes dans une allée bondée.",
      "pp.p2": "Une meilleure formation produit", "pp.p2t": "Des présentations structurées devant une salle assise et attentive.",
      "pp.p3": "Des relations plus profondes", "pp.p3t": "Les soupers réseautage transforment une première rencontre en partenariat durable.",
      "pp.p4": "Un vrai élan de ventes", "pp.p4t": "Les conseillers repartent avec des connaissances qu'ils vendent dès le lendemain.",
      "pp.lim": "Limité par nature", "pp.l1": "Plages de présentation limitées", "pp.l2": "Espaces d'exposition plafonnés par marché", "pp.l3": "Commandites exclusives par catégorie sur demande", "pp.early": "Réservez tôt",
      "ck.kicker": "L'itinéraire de ce soir", "ck.title": 'Une soirée. <span class="hl">Trois actes.</span>',
      "ck.a1": "Présentations des fournisseurs", "ck.a1t": "Séances animées avec vidéo. Chaque fournisseur a la salle.", "ck.a2": "Salon des fournisseurs", "ck.a2t": "Tables habillées, affiches, brochures et promos — des échanges sans hâte.", "ck.a3": "Souper léger et tirages", "ck.a3t": "Un souper réseautage et des prix qui renvoient chaque conseiller heureux.",
      "cb.kicker": "Divertissement à bord", "cb.title": 'Des hublots avec <span class="hl">la plus belle vue.</span>', "cb.lede": "Cinq exposants, cinq capsules tournées sur le plancher. Levez un store — touchez pour regarder.", "cb.pa": "Annonce aux passagers",
      "tk.kicker": "Inscription des exposants 2027", "tk.title": 'Imprimez votre <span class="hl">carte d\'embarquement.</span>', "tk.lede": "Choisissez vos escales et regardez votre tarif baisser. Le statut de grand voyageur s'active seul — Platine expose dès 1 116 $ CA par salon.",
      "tk.brand": "Nom sur la carte", "tk.brandph": "Votre marque", "tk.class": "Classe", "tk.c1": "Exposant", "tk.c1t": "Table, affiche, souper, logo Web", "tk.c2": "Présentateur", "tk.wait": "Liste d'attente", "tk.c2t": "Complet · liste d'attente",
      "tk.stops": "Choisissez vos escales", "tk.sp": "Printemps", "tk.fa": "Automne", "tk.all": "Les 14", "tk.clr": "Effacer", "tk.status": "Statut grand voyageur", "tk.hst": "Ajouter la TVH de 13 % (facturation au Canada)",
      "tk.bp": "Carte d'embarquement · Exposant", "tk.pax": "Passager", "tk.from": "De", "tk.to": "À", "tk.stopsS": "Escales", "tk.classS": "Classe", "tk.statusS": "Statut", "tk.dates": "Dates", "tk.base": "Tarif de base", "tk.disc": "Rabais de statut", "tk.tax": "TVH",
      "tk.total": "Total $ CA", "tk.per": "par salon", "tk.dep": "Dépôt 50 %", "tk.tear": "← glissez pour détacher et vous enregistrer", "tk.checkin": "Enregistrement et inscription",
      "tk.fine": "Le solde de 50 % est dû 90 jours avant chaque série. Chaque espace : affiche couleur · accès direct aux conseillers locaux · souper réseautage · logo sur le site · table habillée de 6 à 8 pi.",
      "ag.kicker": "Avis à tous les conseillers en voyages", "ag.title": 'Votre vol est gratuit. <span class="hl">Les avantages sont réels.</span>', "ag.lede": "Apprenez des marques que vous vendez, rencontrez leurs responsables des ventes, soupez à nos frais — et repartez peut-être avec un prix.",
      "ag.p1": "Carte-cadeau Mastercard pour les 50 premiers conseillers à chaque salon", "ag.p2": "Destinations, complexes hôteliers, croisiéristes et voyagistes", "ag.free": "Gratuit", "ag.p3": "Présentations, souper et tirages inclus",
      "ag.window": "L'inscription des conseillers ouvre 5 semaines avant chaque salon", "ag.ph": "vous@agence.com", "ag.notify": "M'aviser", "ag.tag1": "Priorité · 50 premiers", "ag.tag2": "Carte-cadeau Mastercard à chaque salon 2027", "ag.hint": "Attrapez l'étiquette et faites-la balancer",
      "bg.kicker": "Carrousel à bagages · Commanditaires 2026", "bg.s1": "Commanditaire hôtelier", "bg.s2": "Commanditaire des cartes-cadeaux", "bg.s3": "Partenaire expérience arctique", "bg.title": 'Quelques marques qui <span class="hl">voyagent avec nous.</span>', "bg.hint": "Glissez le carrousel pour le faire tourner",
      "pc.kicker": "Granite Productions · événements passés", "pc.title": 'Cartes postales <span class="hl">de la route.</span>', "pc.lede": "Galas, congrès, lancements et salons — produits à l'interne et captés par notre équipe média. Déplacez-les. Touchez pour retourner.", "pc.shuffle": "Mélanger la pile", "pc.all": "Toutes les galeries",
      "nw.title": 'Dans les <span class="hl">médias.</span>', "nw.all": "Tous les communiqués", "nw.read": "Lire l'article",
      "cr.kicker": "Votre équipage aujourd'hui", "cr.title": 'Piloté par des gens qui <span class="hl">vivent le voyage.</span>', "cr.r1": "Directeur général", "cr.r2": "Directeur de création", "cr.r3": "Animateur et ambassadeur", "cr.r4": "Ventes", "cr.r5": "Conseiller en événements",
      "cr.b1": "Cofondateur de Quadra Innovations et de Granite Productions en 2010, il lance les Granite Travel Trade Expos en 2023.", "cr.b2": "Plus de 20 ans en technologie, d'Adobe Acrobat à la photo 360° — il capte photos et vidéos de chaque salon.", "cr.b3": "Plus de 30 ans dans l'industrie, dont directeur national des ventes de Bahia Principe au Canada.", "cr.b4": "Plus de 40 ans chez des voyagistes et hôteliers, dont 16 ans à la tête du marché canadien de Barceló.", "cr.b5": "Une perspective internationale forgée en santé, technologie, éducation, tourisme et philanthropie.",
      "fn.title": 'Bâtissez des relations. <span class="hl">Faites croître vos affaires.</span>', "fn.kicker": "Annonces d'embarquement", "fn.h": "Soyez les premiers informés des prochains salons.", "fn.ph": "Courriel", "fn.join": "M'abonner", "fn.sup": "Je suis fournisseur", "fn.agt": "Je suis conseiller", "ft.top": "Retour à la porte ↑",
      "ci.kicker": "Enregistrement en ligne", "ci.title": "Confirmez votre carte d'embarquement", "ci.s1": "Passager", "ci.s2": "Paiement", "ci.s3": "Embarquer", "ci.company": "Entreprise *", "ci.contact": "Personne-ressource *", "ci.phone": "Téléphone *", "ci.city": "Ville *", "ci.country": "Pays *",
      "ci.cur": "Devise", "ci.amt": "Payer maintenant", "ci.dep": "Dépôt 50 %", "ci.full": "Montant total", "ci.method": "Mode", "ci.cc": "Carte +3 %", "ci.wire": "Virement", "ci.terms": "J'accepte les modalités de paiement et la politique d'annulation.", "ci.due": "Dû aujourd'hui",
      "ci.done": "Carte émise. À bientôt sur la tournée.", "ci.donet": "Ceci est un prototype — sur le site réel, votre inscription et votre lien de paiement seraient envoyés instantanément.", "ci.back": "Retour", "ci.next": "Continuer",
      _: { status: ["EMBARQUEMENT", "À L'HEURE", "PRÉVU"], statusS: ["EMBARQ.", "À L'HEURE", "PRÉVU"], legs: ["Étape 1 · Printemps · Ontario", "Étape 2 · Printemps · Atlantique", "Étape 3 · Automne · Ouest", "Étape 4 · Automne · Ontario"], legText: ["Le printemps s'ouvre dans le sud de l'Ontario — quatre soirs, quatre marchés, du 5 au 8 avril.", "Puis cap à l'est vers l'Atlantique : St. John's, Halifax et Moncton, du 31 mai au 3 juin.", "L'automne décolle dans l'Ouest : Winnipeg, Red Deer et Kelowna, du 5 au 7 octobre.", "Et retour en Ontario pour finir l'année : d'Ottawa à Hamilton, du 1er au 4 novembre."], regions: ["OUEST", "ONTARIO", "ATLANTIQUE"], opens: (c, n, d) => `L'inscription des conseillers pour <b>${c}</b> ouvre le <b>${d}</b>.`, openNow: c => `L'inscription pour <b>${c}</b> est ouverte!`, days: "JOURS", tierNone: "AUCUN STATUT", toNext: (n, t, p) => `Encore ${n} escale${n > 1 ? "s" : ""} pour ${t} (−${p} %)`, maxed: "Platine débloqué — le meilleur tarif.", pick: "Choisissez au moins une escale.", waitlist: "Ajouté à la liste d'attente des présentateurs — au tarif exposant d'ici là.", notify: "Nous vous aviserons à l'ouverture des inscriptions.", invalid: "Entrez un courriel valide.", thanks: "Merci! Vous êtes abonné.", submit: "Émettre la carte", final: ["DERNIER APPEL", "PORTE 2027", "EMBARQUEMENT"], brand: "VOTRE MARQUE", ex: "EXPOSANT", pr: "PRÉSENTATEUR*" },
    },
  };
  const EN = { status: ["BOARDING", "ON TIME", "SCHEDULED"], statusS: ["BOARDING", "ON TIME", "SCHED."], legs: ["Leg 1 · Spring · Ontario", "Leg 2 · Spring · Atlantic", "Leg 3 · Fall · Western", "Leg 4 · Fall · Ontario"], legText: ["Spring opens in southern Ontario — four nights, four markets, April 5–8.", "Then east to Atlantic Canada: St. John's, Halifax and Moncton, May 31–June 3.", "Fall takes off out west: Winnipeg, Red Deer and Kelowna, October 5–7.", "And home to Ontario to close the year: Ottawa to Hamilton, November 1–4."], regions: ["WEST", "ONTARIO", "ATLANTIC"], opens: (c, n, d) => `Advisor registration for <b>${c}</b> opens on <b>${d}</b>.`, openNow: c => `Registration for <b>${c}</b> is open now!`, days: "DAYS", tierNone: "NO STATUS", toNext: (n, t, p) => `${n} more stop${n > 1 ? "s" : ""} to ${t} (−${p}%)`, maxed: "Platinum unlocked — the best fare there is.", pick: "Pick at least one stop for your pass.", waitlist: "Added to the presenter waitlist — priced as Exhibitor until a slot opens.", notify: "We'll email you the moment registration opens.", invalid: "Please enter a valid email.", thanks: "Thank you — you're on the list.", submit: "Issue boarding pass", final: ["FINAL CALL", "GATE 2027", "NOW BOARDING"], brand: "YOUR BRAND", ex: "EXHIBITOR", pr: "PRESENTER*" };
  let lang = "en";
  const D = () => (lang === "en" ? EN : T[lang]._);
  const loc = () => LOC[lang];
  const money = v => new Intl.NumberFormat(loc(), { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 }).format(Math.round(v));
  const dfmt = (d, o) => new Intl.DateTimeFormat(loc(), { timeZone: "UTC", ...o }).format(new Date(d + "T12:00:00Z"));
  const monDay = d => (dfmt(d, { month: "short" }).replace(".", "").slice(0, 3) + " " + d.slice(8, 10)).toUpperCase();

  $$("[data-i18n]").forEach(el => (el.dataset.en = el.innerHTML));
  $$("[data-i18n-html]").forEach(el => (el.dataset.en = el.innerHTML));
  $$("[data-i18n-ph]").forEach(el => (el.dataset.en = el.placeholder));
  function setLang(l) {
    lang = T[l] ? l : "en";
    document.documentElement.lang = lang === "fr" ? "fr-CA" : lang;
    const dict = T[lang] || {};
    $$("[data-i18n]").forEach(el => (el.innerHTML = lang === "en" ? el.dataset.en : dict[el.dataset.i18n] ?? el.dataset.en));
    $$("[data-i18n-html]").forEach(el => (el.innerHTML = lang === "en" ? el.dataset.en : dict[el.dataset.i18nHtml] ?? el.dataset.en));
    $$("[data-i18n-ph]").forEach(el => (el.placeholder = lang === "en" ? el.dataset.en : dict[el.dataset.i18nPh] ?? el.dataset.en));
    $$(".lang button").forEach(b => { const on = b.dataset.lang === lang; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on); });
    try { localStorage.setItem("gtte2-lang", lang); } catch (e) {}
    document.dispatchEvent(new Event("lang"));
  }
  $$(".lang button").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));

  /* ================= TOAST ================= */
  let tt;
  const toast = m => { const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 3200); };

  /* ================= SPLIT-FLAP ENGINE ================= */
  const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-'/:ÀÉÈÇÑ";
  const pending = new Map();
  function makeFlaps(host, len) {
    host.innerHTML = `<span class="flaps">${"<span class=\"f\"> </span>".repeat(len)}</span>`;
    return $$(".f", host);
  }
  function setFlaps(host, text, len, { stagger = 1, min = 2, max = 7 } = {}) {
    let cells = $$(".f", host);
    if (cells.length !== len) cells = makeFlaps(host, len);
    const str = text.toUpperCase().padEnd(len, " ").slice(0, len);
    host.setAttribute("aria-label", text.trim());
    cells.forEach((cell, i) => {
      const target = str[i];
      if (cell.textContent === target && !pending.has(cell)) return;
      if (reduced) { cell.textContent = target; return; }
      pending.set(cell, { target, steps: min + Math.floor(Math.random() * (max - min)) + Math.floor(i * 0.35 * stagger) });
    });
  }
  setInterval(() => {
    pending.forEach((st, cell) => {
      if (st.steps <= 0) { cell.textContent = st.target === " " ? " " : st.target; pending.delete(cell); }
      else { cell.textContent = CHARS[1 + Math.floor(Math.random() * (CHARS.length - 1))]; st.steps--; }
      const a = cell.classList.contains("fa"); cell.classList.toggle("fa", !a); cell.classList.toggle("fb", a);
    });
  }, 55);

  /* ================= LOADER ================= */
  const loaderBoard = $("#loaderBoard");
  makeFlaps(loaderBoard, 8);
  setFlaps(loaderBoard, "GRANITE", 8, { min: 4, max: 10 });
  setTimeout(() => setFlaps(loaderBoard, "BOARDING", 8, { min: 3, max: 8 }), 1100);
  let loaded = false;
  const finish = () => {
    if (loaded) return; loaded = true;
    $("#loader").classList.add("is-done");
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
    setTimeout(() => $("#loader").remove(), 1100);
    startBoard();
  };
  window.addEventListener("load", () => setTimeout(finish, reduced ? 0 : 1900));
  setTimeout(finish, 4200);

  /* ================= SMOOTH SCROLL ================= */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const goTo = el => { if (!el) return; lenis ? lenis.scrollTo(el, { offset: -20 }) : el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); };
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute("href"); const el = id === "#top" ? document.body : $(id); if (!el) return;
    e.preventDefault(); closeMenu(); goTo(el);
  });

  /* ================= NAV / MENU ================= */
  const nav = $("#nav"), burger = $("#burger"), menu = $("#menu"), dock = $("#dock");
  function closeMenu() { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); menu.setAttribute("aria-hidden", "true"); lenis && lenis.start(); }
  burger.addEventListener("click", () => {
    const o = !menu.classList.contains("open");
    menu.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); menu.setAttribute("aria-hidden", !o);
    lenis && (o ? lenis.stop() : lenis.start());
  });
  const navLinks = $$(".nav__links a"), navSecs = navLinks.map(a => $(a.getAttribute("href")));

  /* ================= REVEALS / COUNTERS ================= */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: .14, rootMargin: "0px 0px -5% 0px" });
  $$(".rv").forEach(el => { const s = [...el.parentElement.children].filter(c => c.classList.contains("rv")); el.style.setProperty("--d", Math.min(s.indexOf(el), 6) * 90 + "ms"); io.observe(el); });
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; const el = e.target, to = +el.dataset.to, t0 = performance.now();
    const st = n => { const p = clamp((n - t0) / 1800, 0, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))).toLocaleString("en-CA"); if (p < 1) requestAnimationFrame(st); };
    requestAnimationFrame(st); cio.unobserve(el);
  }), { threshold: .6 });
  $$(".cnt").forEach(el => cio.observe(el));

  /* ================= HERO BOARD ================= */
  const rowsEl = $("#boardRows"), ROWS = 6;
  let page = 0, compactMode = isCompact(), boardTimer;
  function boardOrder() { const i = nextExpo().i; return [...CITIES.slice(i), ...CITIES.slice(0, i)]; }
  function buildRows() {
    compactMode = isCompact();
    const L = compactMode ? { dest: 11, st: 9 } : { dest: 15, st: 12 };
    rowsEl.innerHTML = Array.from({ length: ROWS }, () => `<div class="board__row" role="row"><span class="c-date" role="cell"></span><span class="c-dest" role="cell"></span><span class="c-flight" role="cell"></span><span class="c-code" role="cell"></span><span class="c-status" role="cell"></span></div>`).join("");
    $$(".board__row", rowsEl).forEach(r => { makeFlaps($(".c-date", r), 6); makeFlaps($(".c-dest", r), L.dest); makeFlaps($(".c-flight", r), 5); makeFlaps($(".c-code", r), 3); makeFlaps($(".c-status", r), L.st); });
    rowsEl.dataset.dest = L.dest; rowsEl.dataset.st = L.st;
  }
  function renderBoard() {
    const list = boardOrder(), pages = Math.ceil(list.length / ROWS), first = nextExpo();
    page %= pages;
    const slice = list.slice(page * ROWS, page * ROWS + ROWS);
    const L = { dest: +rowsEl.dataset.dest, st: +rowsEl.dataset.st };
    $$(".board__row", rowsEl).forEach((r, i) => {
      const c = slice[i];
      const st = !c ? "" : (compactMode ? D().statusS : D().status)[c === first ? 0 : c.s === "spring" ? 1 : 2];
      r.classList.toggle("is-boarding", !!c && c === first);
      setFlaps($(".c-date", r), c ? monDay(c.d) : "", 6);
      setFlaps($(".c-dest", r), c ? `${(c.short || c.n)}${compactMode ? "" : " " + c.p}` : "", L.dest);
      setFlaps($(".c-flight", r), c ? c.flight : "", 5);
      setFlaps($(".c-code", r), c ? c.code : "", 3);
      setFlaps($(".c-status", r), st, L.st);
    });
    $("#boardPage").textContent = `${page + 1}/${pages}`;
  }
  function startBoard() {
    renderBoard();
    clearInterval(boardTimer);
    if (!reduced) boardTimer = setInterval(() => { page++; renderBoard(); }, 7000);
  }
  buildRows();
  addEventListener("resize", () => { if (isCompact() !== compactMode) { buildRows(); renderBoard(); } });

  const heroWord = $("#heroWord");
  let hw = 0;
  makeFlaps(heroWord, 10);
  const heroWordTick = () => { const c = CITIES[hw % CITIES.length]; setFlaps(heroWord, c.short || c.n, 10, { stagger: .6 }); hw++; };
  setTimeout(heroWordTick, 1500);
  if (!reduced) setInterval(heroWordTick, 3200);

  function tickClock() {
    $("#clock").textContent = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date());
    const ms = Math.max(0, nextExpo().start - new Date());
    $("#nextIn").textContent = `${Math.floor(ms / 864e5)}D ${String(Math.floor(ms / 36e5) % 24).padStart(2, "0")}H ${String(Math.floor(ms / 6e4) % 60).padStart(2, "0")}M`;
  }
  tickClock(); setInterval(tickClock, 1000);
  const stripHTML = CITIES.map(c => `<span>✈ ${c.flight} · ${c.code} ${(c.short || c.n).toUpperCase()}, ${c.p} · ${c.d.replace(/-/g, ".")}</span>`).join("");
  $("#strip").innerHTML = stripHTML + stripHTML;

  /* ================= ROUTE (scroll-flown) ================= */
  const rsvg = $("#routeSvg"), routeSec = $("#route");
  let routeLen = 0, cum = [], routePath, routeDone, plane, rCur = -1;
  const routeCity = $("#routeCity");
  makeFlaps(routeCity, 11);
  function buildRoute() {
    const pts = CITIES.map(c => [c.x, c.y]);
    const segs = pts.map((p, i) => {
      if (!i) return `M${p[0]},${p[1]}`;
      const q = pts[i - 1], dx = p[0] - q[0], dy = p[1] - q[1], dist = Math.hypot(dx, dy), k = (i % 2 ? 1 : -1) * Math.min(.3, 60 / dist + .12);
      return `Q${((q[0] + p[0]) / 2 - dy * k).toFixed(1)},${((q[1] + p[1]) / 2 + dx * k).toFixed(1)} ${p[0]},${p[1]}`;
    });
    const d = segs.join(" ");
    const rings = [90, 180, 270, 360, 450].map(r => `<circle class="r-ring" cx="520" cy="320" r="${r}"/>`).join("");
    const grid = Array.from({ length: 11 }, (_, i) => `<line class="r-grid" x1="${i * 100}" y1="0" x2="${i * 100}" y2="560"/>`).join("") + Array.from({ length: 6 }, (_, i) => `<line class="r-grid" x1="0" y1="${i * 112}" x2="1000" y2="${i * 112}"/>`).join("");
    const R = D().regions;
    const cities = CITIES.map(c => {
      const [dx, dy, a] = c.l, rot = ((c.i * 37) % 30) - 15;
      return `<g class="r-city" data-i="${c.i}">
        <g class="r-stamp" style="--r:${rot}deg"><circle cx="${c.x}" cy="${c.y}" r="17"/><circle cx="${c.x}" cy="${c.y}" r="13" stroke-dasharray="3 3"/></g>
        <circle class="dot" cx="${c.x}" cy="${c.y}" r="6"/>
        <text x="${c.x + dx}" y="${c.y + dy}" text-anchor="${a}">${c.short || c.n}</text>
        <text class="code" x="${c.x + dx}" y="${c.y + dy + (dy < 0 ? -14 : 13)}" text-anchor="${a}">${c.code}</text>
      </g>`;
    }).join("");
    rsvg.innerHTML = `${grid}${rings}
      <text class="r-region" x="70" y="60">${R[0]}</text><text class="r-region" x="430" y="530">${R[1]}</text><text class="r-region" x="820" y="440">${R[2]}</text>
      <path class="r-route" id="rPath" d="${d}"/><path class="r-done" id="rDone" d="${d}"/>${cities}
      <g class="r-plane" id="rPlane"><path transform="translate(-17,-17) scale(1.42)" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></g>`;
    routePath = $("#rPath"); routeDone = $("#rDone"); plane = $("#rPlane");
    routeLen = routePath.getTotalLength();
    cum = [0];
    const tmp = document.createElementNS("http://www.w3.org/2000/svg", "path");
    rsvg.appendChild(tmp);
    for (let i = 1; i < segs.length; i++) { tmp.setAttribute("d", segs.slice(0, i + 1).join(" ")); cum.push(tmp.getTotalLength()); }
    tmp.remove();
    routeDone.style.strokeDasharray = routeLen;
    rCur = -1; updateRoute(true);
  }
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  function updateRoute(force) {
    if (!routePath) return;
    const r = routeSec.getBoundingClientRect(), total = r.height - innerHeight;
    const p = clamp(-r.top / total, 0, 1);
    const sF = p * (CITIES.length - 1) * 1.04, s = Math.min(CITIES.length - 2, Math.floor(sF)), t = clamp(sF - s, 0, 1), e = ease(t);
    const len = cum[s] + e * (cum[s + 1] - cum[s]);
    const pt = routePath.getPointAtLength(len), pt2 = routePath.getPointAtLength(Math.min(routeLen, len + 2)), pt0 = routePath.getPointAtLength(Math.max(0, len - 2));
    const ang = Math.atan2(pt2.y - pt0.y, pt2.x - pt0.x) * 180 / Math.PI + 90;
    plane.setAttribute("transform", `translate(${pt.x},${pt.y}) rotate(${ang})`);
    routeDone.style.strokeDashoffset = routeLen - len;
    if (isCompact()) {
      const vx = clamp(pt.x - 260, 0, 480), vy = clamp(pt.y - 200, 40, 160);
      rsvg.setAttribute("viewBox", `${vx.toFixed(1)} ${vy.toFixed(1)} 520 400`);
    } else if (rsvg.getAttribute("viewBox") !== "0 0 1000 560") rsvg.setAttribute("viewBox", "0 0 1000 560");
    $("#routeBar").style.transform = `scaleX(${p})`;
    const cur = sF >= CITIES.length - 1 ? CITIES.length - 1 : (t > .9 ? s + 1 : s);
    if (cur !== rCur || force) {
      rCur = cur;
      const c = CITIES[cur];
      $$(".r-city", rsvg).forEach(g => g.classList.toggle("on", +g.dataset.i <= cur));
      setFlaps(routeCity, c.short || c.n, 11, { stagger: .5 });
      $("#routeDate").textContent = dfmt(c.d, { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();
      $("#routeCode").textContent = `${c.code} · ${c.flight}`;
      $("#stopNum").textContent = String(cur + 1).padStart(2, "0");
      $("#legName").textContent = D().legs[c.leg];
      $("#legText").textContent = D().legText[c.leg];
    }
  }

  /* ================= PASSPORT ================= */
  const pages = $$(".page"), book = $("#book");
  let flippedN = 0;
  function layoutPages() {
    pages.forEach((pg, i) => { pg.classList.toggle("flipped", i < flippedN); pg.style.zIndex = i < flippedN ? i + 1 : pages.length - i + 10; });
    pages.forEach(pg => pg.classList.remove("stamped"));
    if (pages[flippedN]) { void pages[flippedN].offsetWidth; pages[flippedN].classList.add("stamped"); }
    $("#bookPage").textContent = `${flippedN + 1} / ${pages.length + 1}`;
  }
  function flip(dir) {
    const n = clamp(flippedN + dir, 0, pages.length); if (n === flippedN) return;
    const pg = pages[dir > 0 ? flippedN : n];
    pg.style.zIndex = 50;
    flippedN = n;
    pg.classList.toggle("flipped", dir > 0);
    setTimeout(layoutPages, 550);
  }
  $("#bookNext").addEventListener("click", () => flip(1));
  $("#bookPrev").addEventListener("click", () => flip(-1));
  let bx = 0, bMoved = 0, bDown = false;
  book.addEventListener("pointerdown", e => { if (e.target.closest("a")) return; bDown = true; bx = e.clientX; bMoved = 0; });
  addEventListener("pointermove", e => { if (bDown) bMoved = e.clientX - bx; });
  addEventListener("pointerup", e => {
    if (!bDown) return; bDown = false;
    if (Math.abs(bMoved) > 40) flip(bMoved < 0 ? 1 : -1);
    else if (Math.abs(bMoved) < 6) { const r = book.getBoundingClientRect(); flip(e.clientX > r.left + r.width / 2 ? 1 : -1); }
  });
  book.setAttribute("tabindex", "0");
  book.addEventListener("keydown", e => { if (e.key === "ArrowRight") flip(1); if (e.key === "ArrowLeft") flip(-1); });
  layoutPages();
  function buildMobilePassport() {
    const m = $("#passportM"); m.innerHTML = "";
    const id = document.createElement("div"); id.className = "page__face"; id.appendChild($(".idpage").cloneNode(true)); m.appendChild(id);
    pages.forEach(pg => $$(".page__face", pg).forEach(f => { const c = f.cloneNode(true); c.classList.remove("page__back"); c.removeAttribute("style"); m.appendChild(c); }));
    $$("[id]", m).forEach(el => el.removeAttribute("id"));
    m.removeAttribute("aria-hidden");
  }

  /* ================= CLOCK ================= */
  const clockSec = $("#evening"), ticks = $("#ticks");
  ticks.innerHTML = Array.from({ length: 60 }, (_, i) => { const a = i * 6 * Math.PI / 180, big = i % 5 === 0, r1 = big ? 160 : 168; return `<line class="cf-tick${big ? " big" : ""}" x1="${200 + Math.sin(a) * r1}" y1="${200 - Math.cos(a) * r1}" x2="${200 + Math.sin(a) * 178}" y2="${200 - Math.cos(a) * 178}"/>`; }).join("")
    + Array.from({ length: 12 }, (_, i) => { const h = i + 1, a = h * 30 * Math.PI / 180; return `<text class="cf-num" x="${200 + Math.sin(a) * 136}" y="${206 + -Math.cos(a) * 136}" text-anchor="middle">${h}</text>`; }).join("");
  const acts = $$(".act");
  function updateClock() {
    const r = clockSec.getBoundingClientRect(), p = clamp(-r.top / (r.height - innerHeight), 0, 1);
    const time = 16 + p * 4, h = time % 12, m = (time * 60) % 60;
    $("#hourHand").style.transform = `rotate(${h * 30}deg)`;
    $("#minHand").style.transform = `rotate(${(time - 16) * 360}deg)`;
    const a0 = 120 * Math.PI / 180, a1 = h * 30 * Math.PI / 180, R = 150;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    $("#arcFill").setAttribute("d", p <= 0 ? "" : `M200,200 L${200 + Math.sin(a0) * R},${200 - Math.cos(a0) * R} A${R},${R} 0 ${large} 1 ${200 + Math.sin(a1) * R},${200 - Math.cos(a1) * R} Z`);
    const hh = Math.floor(time), mm = Math.floor(m);
    $("#clockDigital").textContent = lang === "en" ? `${hh - 12}:${String(mm).padStart(2, "0")} PM` : `${hh}:${String(mm).padStart(2, "0")}`;
    acts.forEach(a => { const f = +a.dataset.from, to = +a.dataset.to; a.classList.toggle("on", time >= f && (time < to || (to === 20 && time >= 20))); a.classList.toggle("done", time >= to && to !== 20); });
  }

  /* ================= WINDOWS (drag) ================= */
  const fus = $("#fuselage"), wTrack = $("#windows"), wins = $$(".win");
  let wx = 0, wT = 0, wDrag = false, wSX = 0, wST = 0, wMoved = 0, wVel = 0, wLast = 0;
  const wB = () => Math.min(0, fus.clientWidth - wTrack.scrollWidth);
  fus.addEventListener("pointerdown", e => { wDrag = true; wSX = wLast = e.clientX; wST = wT; wMoved = 0; wVel = 0; fus.classList.add("drag"); });
  addEventListener("pointermove", e => { if (!wDrag) return; const dx = e.clientX - wSX; wMoved = Math.max(wMoved, Math.abs(dx)); wVel = e.clientX - wLast; wLast = e.clientX; let t = wST + dx; const mn = wB(); if (t > 0) t *= .35; if (t < mn) t = mn + (t - mn) * .35; wT = t; });
  addEventListener("pointerup", () => { if (!wDrag) return; wDrag = false; fus.classList.remove("drag"); wT = clamp(wT + wVel * 14, wB(), 0); });
  fus.addEventListener("click", e => { if (wMoved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  (function wl() { wx = lerp(wx, wT, reduced ? 1 : .12); wTrack.style.transform = `translate3d(${wx}px,0,0)`; requestAnimationFrame(wl); })();
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { wins.forEach((w, i) => setTimeout(() => w.classList.add("open"), 300 + i * 220)); o.disconnect(); } }, { threshold: .4 }).observe(fus);

  /* ================= VIDEO MODAL ================= */
  const vModal = $("#vModal"); let lastFocus;
  function openVideo(id) {
    lastFocus = document.activeElement;
    $("#vTitle").textContent = VIDEOS[id] || "";
    $("#vFrame").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="${VIDEOS[id] || "Testimonial"}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    vModal.hidden = false; lenis && lenis.stop(); $("[data-close]", $(".seatback__bar")).focus();
  }
  function closeModal(m) { m.hidden = true; if (m === vModal) $("#vFrame").innerHTML = ""; if (m === ciModal) resetStub(); lenis && lenis.start(); lastFocus && lastFocus.focus(); }
  $$("[data-video]").forEach(b => b.addEventListener("click", () => openVideo(b.dataset.video)));
  $$(".modal").forEach(m => $$("[data-close]", m).forEach(x => x.addEventListener("click", () => closeModal(m))));
  document.addEventListener("keydown", e => { if (e.key === "Escape") { $$(".modal").forEach(m => !m.hidden && closeModal(m)); closeMenu(); } });

  /* ================= PA TYPEWRITER ================= */
  const paText = $("#paText"), paWho = $("#paWho"), paNav = $("#paNav");
  paNav.innerHTML = QUOTES.map((_, i) => `<button aria-label="Announcement ${i + 1}">${i + 1}</button>`).join("");
  let qi = -1, typeT, paStarted = false;
  function showQuote(i) {
    clearTimeout(typeT); qi = i;
    $$("button", paNav).forEach((b, k) => b.classList.toggle("on", k === i));
    const [q, who, role] = QUOTES[i]; let n = 0;
    paWho.innerHTML = "";
    const step = () => {
      n += reduced ? q.length : 2;
      paText.innerHTML = `“${q.slice(0, n)}${n >= q.length ? "”" : ""}<span class="caret"></span>`;
      if (n < q.length) typeT = setTimeout(step, 24);
      else { paWho.innerHTML = `<b>${who}</b> · ${role}`; typeT = setTimeout(() => showQuote((qi + 1) % QUOTES.length), 6500); }
    };
    step();
  }
  $$("button", paNav).forEach((b, i) => b.addEventListener("click", () => showQuote(i)));
  new IntersectionObserver(es => { if (es[0].isIntersecting && !paStarted) { paStarted = true; showQuote(0); } }, { threshold: .4 }).observe($("#pa"));

  /* ================= TICKET BUILDER ================= */
  const sel = new Set(), stopsEl = $("#stops"), brand = $("#brand");
  let last = { base: 0, disc: 0, tax: 0, total: 0, dep: 0 }, calc = {};
  function renderStops() {
    const legs = D().legs;
    stopsEl.innerHTML = [0, 1, 2, 3].map(l => `<div><div class="stops__leg">${legs[l]}</div><div class="stops__row">${CITIES.filter(c => c.leg === l).map(c => `<button type="button" class="stop" data-id="${c.id}" aria-pressed="${sel.has(c.id)}"><b>${c.code}</b><span>${c.short || c.n}</span><small>${monDay(c.d)}</small></button>`).join("")}</div></div>`).join("");
    $$(".stop", stopsEl).forEach(b => b.addEventListener("click", () => { sel.has(b.dataset.id) ? sel.delete(b.dataset.id) : sel.add(b.dataset.id); b.setAttribute("aria-pressed", sel.has(b.dataset.id)); update(); }));
  }
  $$("[data-pick]").forEach(b => b.addEventListener("click", () => { const k = b.dataset.pick; if (k === "none") sel.clear(); else CITIES.filter(c => k === "all" || c.s === k).forEach(c => sel.add(c.id)); renderStops(); update(); }));
  $$('input[name="cls"]').forEach(r => r.addEventListener("change", () => { if (r.checked && r.value === "pr") toast(D().waitlist); update(); }));
  $("#hst").addEventListener("change", update);
  brand.addEventListener("input", update);
  const anim = (el, a, b, f) => { if (reduced || a === b) { el.textContent = f(b); return; } const t0 = performance.now(); const r = n => { const p = clamp((n - t0) / 600, 0, 1); el.textContent = f(lerp(a, b, 1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(r); }; requestAnimationFrame(r); };
  function barcode(seed) {
    let h = 2166136261; for (const ch of seed) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    let x = 0, out = "";
    while (x < 120) { h = Math.imul(h ^ (h >>> 13), 1274126177); const w = 1 + ((h >>> 0) % 3), g = 1 + ((h >>> 5) % 2); out += `<rect x="${x}" y="0" width="${w}" height="40"/>`; x += w + g; }
    $("#barcode").innerHTML = out;
  }
  function update() {
    const list = CITIES.filter(c => sel.has(c.id)), n = list.length;
    const pct = n >= 12 ? .2 : n >= 9 ? .15 : n >= 4 ? .1 : 0;
    const base = n * 1395, disc = base * pct, sub = base - disc, tax = $("#hst").checked ? sub * .13 : 0, total = sub + tax, dep = total / 2;
    calc = { n, pct, base, disc, sub, tax, total, dep, list };
    const name = brand.value.trim() || D().brand;
    $("#pName").textContent = name; $("#ppHolder").textContent = name;
    $("#pFrom").textContent = n ? list[0].code : "———"; $("#pFromC").textContent = n ? list[0].short || list[0].n : "—";
    $("#pTo").textContent = n ? list[n - 1].code : "———"; $("#pToC").textContent = n ? list[n - 1].short || list[n - 1].n : "—";
    $("#pCodes").innerHTML = list.map(c => `<span>${c.code}</span>`).join("");
    $("#pStops").textContent = n;
    $("#pClass").textContent = $('input[name="cls"]:checked').value === "pr" ? D().pr : D().ex;
    const tier = n >= 12 ? "PLATINUM" : n >= 9 ? "GOLD" : n >= 4 ? "SILVER" : D().tierNone;
    $("#pTier").textContent = tier;
    $("#pDates").textContent = n ? (n === 1 ? monDay(list[0].d) : `${monDay(list[0].d)}–${monDay(list[n - 1].d)}`) : "—";
    anim($("#fBase"), last.base, base, money); anim($("#fDisc"), last.disc, disc, v => "−" + money(v)); anim($("#fTax"), last.tax, tax, money);
    anim($("#fTotal"), last.total, total, money); anim($("#fDep"), last.dep, dep, money);
    $("#fPer").textContent = n ? money(sub / n) : "—";
    last = { base, disc, tax, total, dep };
    $(".pass__plane").style.setProperty("--pp", `${8 + (n / 14) * 84}%`);
    $("#ffFill").style.width = `${(n / 14) * 100}%`;
    $$(".ff__track span").forEach(s => s.classList.toggle("on", n >= +s.dataset.t));
    const nxt = n < 4 ? [4 - n, "SILVER", 10] : n < 9 ? [9 - n, "GOLD", 15] : n < 12 ? [12 - n, "PLATINUM", 20] : null;
    $("#ffMsg").textContent = nxt ? D().toNext(...nxt) : D().maxed;
    $("#checkin").disabled = !n;
    barcode(name + list.map(c => c.code).join(""));
  }

  // tear the stub
  const stub = $("#stub");
  let sDown = false, sX = 0, sY = 0, sDX = 0;
  stub.addEventListener("pointerdown", e => { sDown = true; sX = e.clientX; sY = e.clientY; sDX = 0; stub.setPointerCapture(e.pointerId); stub.style.transition = "none"; });
  stub.addEventListener("pointermove", e => { if (!sDown) return; sDX = Math.hypot(e.clientX - sX, e.clientY - sY); const dx = e.clientX - sX, dy = e.clientY - sY; stub.style.transform = `translate(${dx * .5}px, ${dy * .5}px) rotate(${clamp(dx * .06, -14, 14)}deg)`; });
  const sUp = () => {
    if (!sDown) return; sDown = false; stub.style.transition = ""; stub.style.transform = "";
    if (sDX > 90) { if (!calc.n) { toast(D().pick); return; } stub.classList.add("torn"); setTimeout(openCheckin, 450); }
    else if (sDX < 6 && !calc.n) toast(D().pick);
  };
  stub.addEventListener("pointerup", sUp); stub.addEventListener("pointercancel", sUp);
  function resetStub() { stub.classList.remove("torn"); }
  $("#checkin").addEventListener("click", openCheckin);

  /* ================= CHECK-IN MODAL ================= */
  const ciModal = $("#ciModal"), ciForm = $("#ciForm");
  let ciStep = 1;
  function openCheckin() {
    if (!calc.n) { toast(D().pick); return; }
    lastFocus = document.activeElement;
    if (brand.value.trim()) $("#cCompany").value = brand.value.trim();
    ciStep = 1; ciRender(); ciModal.hidden = false; lenis && lenis.stop();
    setTimeout(() => ($("#cCompany").value ? $("#cContact") : $("#cCompany")).focus(), 60);
  }
  const due = () => { let v = ciForm.amt.value === "full" ? calc.total : calc.dep; if (ciForm.pm.value === "cc") v *= 1.03; return v; };
  function ciRender() {
    $$(".ci__panel", ciForm).forEach(p => p.classList.toggle("is-on", +p.dataset.step === ciStep));
    $$("#ciSteps > span").forEach((s, i) => { s.classList.toggle("is-on", i + 1 === ciStep); s.classList.toggle("done", i + 1 < ciStep); });
    $("#ciFoot").style.display = ciStep === 3 ? "none" : "";
    $("#ciBack").style.visibility = ciStep === 1 ? "hidden" : "visible";
    $("#ciNextTxt").textContent = ciStep === 2 ? D().submit : (lang === "en" ? "Continue" : T[lang]["ci.next"]);
    $("#cDue").textContent = money(due()) + " " + ciForm.cur.value + (ciForm.cur.value === "USD" ? "*" : "");
  }
  ciForm.addEventListener("change", ciRender);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const emailOK = v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
  $("#ciNext").addEventListener("click", () => {
    if (ciStep === 1) {
      let ok = true;
      $$('[data-step="1"] [required]', ciForm).forEach(i => { const bad = !i.value.trim() || (i.type === "email" && !emailOK(i.value)); i.closest(".fld").classList.toggle("err", bad); if (bad && ok) { i.focus(); ok = false; } });
      if (!ok) return; ciStep = 2; ciRender(); return;
    }
    if (ciStep === 2) {
      const t = $("#cTerms"); t.closest(".ci__terms").classList.toggle("err", !t.checked); if (!t.checked) return;
      $("#printed").innerHTML = `<span>GTTE 2027 · ${esc($("#pClass").textContent)}</span><b>${calc.list[0].code} ✈ ${calc.list[calc.n - 1].code}</b><span>${esc($("#cCompany").value.toUpperCase())}</span><span>${calc.n} STOPS · ${$("#pTier").textContent}</span><span>${money(calc.total)} CAD</span><div class="bc"></div>`;
      ciStep = 3; ciRender(); confetti();
    }
  });
  $("#ciBack").addEventListener("click", () => { if (ciStep > 1) { ciStep--; ciRender(); } });
  function confetti() {
    if (reduced) return;
    const cols = ["#ffb81c", "#e2232e", "#ffffff", "#15171b", "#4fd18b"];
    for (let i = 0; i < 90; i++) {
      const c = document.createElement("i"); c.className = "confetti"; c.style.background = cols[i % 5]; document.body.appendChild(c);
      let x = innerWidth / 2, y = innerHeight / 2, a = Math.random() * Math.PI * 2, sp = 6 + Math.random() * 10, vx = Math.cos(a) * sp, vy = Math.sin(a) * sp - 8, r = 0, life = 0;
      const t = () => { life++; vy += .35; vx *= .985; x += vx; y += vy; r += vx * 2; c.style.transform = `translate(${x}px,${y}px) rotate(${r}deg)`; c.style.opacity = 1 - life / 140; life < 140 ? requestAnimationFrame(t) : c.remove(); };
      requestAnimationFrame(t);
    }
  }

  /* ================= AGENTS ================= */
  const opensFlap = $("#opensFlap");
  makeFlaps(opensFlap, 3);
  function renderOpens() {
    const c = nextExpo(), open = new Date(c.start - 35 * 864e5), now = new Date(), days = Math.max(0, Math.ceil((open - now) / 864e5));
    const city = `${c.short || c.n}, ${c.p}`, ds = new Intl.DateTimeFormat(loc(), { month: "long", day: "numeric", year: "numeric" }).format(open);
    setFlaps(opensFlap, String(days).padStart(3, "0"), 3, { min: 5, max: 12 });
    $("#opensTxt").innerHTML = now < open ? `<b>${D().days}</b> — ` + D().opens(city, days, ds) : D().openNow(city);
  }
  $("#notify").addEventListener("submit", e => { e.preventDefault(); const v = $("#nEmail").value.trim(); if (!emailOK(v)) { toast(D().invalid); return; } $("#nEmail").value = ""; toast(D().notify); });
  $("#announce").addEventListener("submit", e => { e.preventDefault(); const v = $("#aEmail").value.trim(), ok = emailOK(v); $("#aMsg").textContent = ok ? D().thanks : D().invalid; $("#aMsg").style.color = ok ? "" : "var(--red)"; if (ok) $("#aEmail").value = ""; });

  // luggage tag pendulum
  const rig = $("#tagrig"), tag = $("#tag"), strPath = $("#stringPath"), strSvg = $("#tagString");
  let th = 0, om = 0, tDrag = false, tagVisible = false, lastTh = 0;
  const PIVOT_Y = 10, HOLE = 157;
  function tagGeom() { const w = rig.clientWidth, h = rig.clientHeight; strSvg.setAttribute("viewBox", `0 0 ${w} ${h}`); return w / 2; }
  let cx = tagGeom();
  addEventListener("resize", () => (cx = tagGeom()));
  tag.addEventListener("pointerdown", e => { tDrag = true; tag.setPointerCapture(e.pointerId); tag.style.cursor = "grabbing"; });
  tag.addEventListener("pointermove", e => {
    if (!tDrag) return; const r = rig.getBoundingClientRect(); const dx = e.clientX - (r.left + cx), dy = e.clientY - (r.top + PIVOT_Y);
    const nt = clamp(Math.atan2(-dx, Math.max(dy, 40)), -1.25, 1.25); om = nt - th; th = nt;
  });
  const tUp = () => { tDrag = false; tag.style.cursor = ""; };
  tag.addEventListener("pointerup", tUp); tag.addEventListener("pointercancel", tUp);
  tag.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); om += .09; } });
  let pmx = null;
  rig.addEventListener("pointermove", e => { if (tDrag || !fine) { pmx = e.clientX; return; } if (pmx !== null) om += clamp((e.clientX - pmx) * -.0009, -.02, .02); pmx = e.clientX; });
  rig.addEventListener("pointerleave", () => (pmx = null));
  new IntersectionObserver(es => { tagVisible = es[0].isIntersecting; if (tagVisible && !reduced && Math.abs(om) < .01) om = .06; }, { threshold: .3 }).observe(rig);
  (function tl() {
    if (tagVisible) {
      if (!tDrag && !reduced) { om += -.0065 * Math.sin(th); om *= .988; th += om; }
      tag.style.transform = `rotate(${th}rad)`;
      const hx = cx - HOLE * Math.sin(th), hy = PIVOT_Y + HOLE * Math.cos(th);
      strPath.setAttribute("d", `M${cx},9 Q${(cx + hx) / 2 + th * 18},${(9 + hy) / 2} ${hx},${hy}`);
      lastTh = th;
    }
    requestAnimationFrame(tl);
  })();

  /* ================= BAGGAGE BELT ================= */
  const LOGOS = ["Sandals.jpg", "RIU_Hotels.jpg", "MSC-Cruises.jpg", "iberostar.jpg", "WestJet-Vacations.jpg", "Jamaica.jpg", "Barcelo-Hotel-Group.jpg", "Celebrity-Cruises.jpg", "Hilton.jpg", "Palladium-hotel-group.jpg", "Collette.jpg", "Bahamas.jpg", "Barbados.jpg", "Cayman-Islands.jpg", "Dubai.jpg", "Tourism-Australia.jpg", "Trafalgar-Tours.jpg", "Globus.jpg", "Holland-America.jpg", "Rocky-Mountaineer.jpg", "Visit-Orlando.jpg", "Catalonia.jpg", "sunwing.jpg", "Transat.jpg", "Couples-Resorts.jpg", "Oasis-Hotels-Resorts.jpg", "Sirenis.jpg", "The-Palace-Company.jpg"].filter((_, i) => i % 2 === 0);
  const beltStage = $("#beltStage"), belt = $("#belt");
  beltStage.insertAdjacentHTML("beforeend", LOGOS.map(f => `<div class="bag"><div class="bag__in"><img src="images/partners/${f}" alt="${f.replace(/\.\w+$/, "").replace(/[-_]/g, " ")}" loading="lazy" draggable="false"></div></div>`).join(""));
  const bags = $$(".bag", beltStage);
  let bs = 0, bv = .7, bDrag2 = false, bX = 0, bLastX = 0, beltVisible = false;
  function bagPos(s, w, h) {
    const rr = h / 2 - h * .11, half = (w - h) / 2, P = 4 * half + 2 * Math.PI * rr;
    s = ((s % P) + P) % P;
    if (s < 2 * half) return [w / 2 - half + s, h / 2 - rr];
    s -= 2 * half;
    if (s < Math.PI * rr) { const a = -Math.PI / 2 + s / rr; return [w / 2 + half + Math.cos(a) * rr, h / 2 + Math.sin(a) * rr]; }
    s -= Math.PI * rr;
    if (s < 2 * half) return [w / 2 + half - s, h / 2 + rr];
    s -= 2 * half; const a = Math.PI / 2 + s / rr; return [w / 2 - half + Math.cos(a) * rr, h / 2 + Math.sin(a) * rr];
  }
  belt.addEventListener("pointerdown", e => { bDrag2 = true; bX = bLastX = e.clientX; belt.classList.add("drag"); belt.setPointerCapture(e.pointerId); });
  belt.addEventListener("pointermove", e => { if (!bDrag2) return; const d = e.clientX - bLastX; bLastX = e.clientX; bs += d * 1.4; bv = clamp(d * .5, -14, 14); });
  const bUp = () => { bDrag2 = false; belt.classList.remove("drag"); };
  belt.addEventListener("pointerup", bUp); belt.addEventListener("pointercancel", bUp);
  new IntersectionObserver(es => (beltVisible = es[0].isIntersecting)).observe(belt);
  (function bl() {
    if (beltVisible) {
      const w = beltStage.clientWidth, h = beltStage.clientHeight, rr = h / 2 - h * .11, P = 4 * ((w - h) / 2) + 2 * Math.PI * rr;
      if (!bDrag2 && !reduced) { bs += bv; bv = lerp(bv, Math.sign(bv || 1) * .7, .02); }
      bags.forEach((b, i) => { const [x, y] = bagPos(bs + (i * P) / bags.length, w, h); b.style.transform = `translate3d(${x}px, ${y}px, 0)`; });
    }
    requestAnimationFrame(bl);
  })();

  /* ================= POSTCARDS ================= */
  const CARDS = [
    ["DSC_4665.jpg", "Halifax", "Standing room only for the supplier presentations. What a crowd!", "YHZ", "SPRING 2025"],
    ["DSC_1908.jpg", "Ottawa", "Every table busy all evening — real conversations, real bookings.", "YOW", "FALL 2025"],
    ["DSC_4933.jpg", "Hamilton", "Presenting under the wings of a vintage bomber. Unforgettable.", "YHM", "FALL 2025"],
    ["DSC_5482.jpg", "The Hangar", "Jamaica's booth beneath the aircraft — the most photographed table.", "YHM", "FALL 2025"],
    ["CAA-event.jpg", "CAA", "A national conference for the Canadian Automobile Association, produced by Granite.", "CAA", "CONFERENCE"],
    ["st-kitts-event.jpg", "St. Kitts", "An intimate St. Kitts Tourism evening, styled to the last detail.", "SKB", "EXPERIENCE"],
    ["travelpulse-rca-2024.jpg", "Gala Night", "TravelPulse Canada Readers' Choice Awards — the industry's big night.", "TPC", "AWARDS 2024"],
    ["virtual-show.jpg", "Online", "Our Virtual Travel & Leisure Show hosted 125+ international destinations.", "WEB", "VIRTUAL"],
  ];
  const pile = $("#pile");
  pile.innerHTML = CARDS.map(([img, place, note, code, cap]) => `<div class="card" tabindex="0" aria-label="Postcard: ${place}. Press Enter to flip.">
      <div class="card__in">
        <div class="card__f"><img src="images/${img}" alt="${place}" loading="lazy" draggable="false"><b><small>Greetings from</small>${place}</b></div>
        <div class="card__b"><p>${note}</p><div><span class="pstamp">${code}</span><span class="lines"><i></i><i></i><span>GRANITE PRODUCTIONS · ${cap}</span></span></div></div>
      </div></div>`).join("");
  const cards = $$(".card", pile);
  let zTop = 10;
  const state = cards.map(() => ({ x: 0, y: 0, r: 0 }));
  const place = (i, el) => { const s = state[i]; el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)`; };
  function scatter(initial) {
    const W = pile.clientWidth, H = pile.clientHeight, cw = cards[0].offsetWidth, ch = cards[0].offsetHeight;
    cards.forEach((c, i) => {
      const col = i % 4, row = Math.floor(i / 4);
      let bx = initial ? (col + .5) / 4 * (W - cw) : Math.random() * (W - cw), by = initial ? (row ? .62 : .1) * (H - ch) + (col % 2) * 40 : Math.random() * (H - ch);
      if (initial && isCompact()) { bx = (i % 2 ? .85 : .15) * (W - cw); by = (i / (cards.length - 1)) * (H - ch); }
      state[i] = { x: clamp(bx + (Math.random() - .5) * 60, 0, W - cw), y: clamp(by + (Math.random() - .5) * 40, 0, H - ch), r: (Math.random() - .5) * 22 };
      place(i, c);
    });
  }
  cards.forEach((c, i) => {
    let down = false, sx, sy, ox, oy, moved, lx;
    c.addEventListener("pointerdown", e => { down = true; moved = 0; sx = lx = e.clientX; sy = e.clientY; ox = state[i].x; oy = state[i].y; c.setPointerCapture(e.pointerId); c.classList.add("drag"); c.style.zIndex = ++zTop; });
    c.addEventListener("pointermove", e => {
      if (!down) return; const dx = e.clientX - sx, dy = e.clientY - sy; moved = Math.max(moved, Math.hypot(dx, dy));
      const W = pile.clientWidth, H = pile.clientHeight;
      state[i].x = clamp(ox + dx, -40, W - c.offsetWidth + 40); state[i].y = clamp(oy + dy, -40, H - c.offsetHeight + 40);
      state[i].r = clamp((e.clientX - lx) * .8, -18, 18); lx = e.clientX; place(i, c);
    });
    const up = () => { if (!down) return; down = false; c.classList.remove("drag"); if (moved < 6) c.classList.toggle("flipped"); state[i].r = (Math.random() - .5) * 16; place(i, c); };
    c.addEventListener("pointerup", up); c.addEventListener("pointercancel", up);
    c.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); c.classList.toggle("flipped"); } });
  });
  $("#shuffle").addEventListener("click", () => { cards.forEach(c => c.classList.remove("flipped")); scatter(false); });
  addEventListener("resize", () => scatter(true));

  /* ================= NEWS TICKER / CREW ================= */
  const heads = ["Travel Press — Granite opens advisor registration for Fall 2026 events", "Travelweek — Registration opens for Fall 2026 series", "OpenJaw — Registration now open for the Fall 2026 series", "PAX News — Granite opens registration for fall 2026", "Granite Travel Trade Expos host 1,500 agents in a single series", "2027: 14 cities, Spring & Fall"];
  $("#ticker").innerHTML = [...heads, ...heads].map(h => `<span>${h}</span>`).join("");
  $$(".badge").forEach(b => b.addEventListener("click", () => { if (!fine) b.classList.toggle("flip"); }));

  /* ================= FINAL BOARD ================= */
  const fb = $("#finalBoard"); let fi = 0, fbVisible = false;
  makeFlaps(fb, 12);
  new IntersectionObserver(es => (fbVisible = es[0].isIntersecting)).observe(fb);
  setInterval(() => { if (fbVisible || fi === 0) { setFlaps(fb, D().final[fi % 3], 12, { stagger: .6 }); fi++; } }, 3500);

  /* ================= CURSOR / MAGNET ================= */
  if (fine && !reduced) {
    const cur = $("#cursor"), lab = $("#cursorLabel"); let mx = 0, my = 0, x = 0, y = 0;
    addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; cur.classList.add("on"); }, { passive: true });
    (function cl() { x = lerp(x, mx, .22); y = lerp(y, my, .22); cur.style.transform = `translate3d(${x}px,${y}px,0)`; requestAnimationFrame(cl); })();
    document.addEventListener("pointerover", e => {
      const w = e.target.closest(".win"), l = e.target.closest("[data-cursor]");
      if (w) { cur.className = "cursor on lab"; lab.textContent = "Play"; return; }
      if (l) { cur.className = "cursor on lab"; lab.textContent = l.dataset.cursor; return; }
      cur.className = "cursor on" + (e.target.closest("a, button, input, label, select") ? " link" : "");
    });
    $$(".magnet").forEach(el => {
      el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`; });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  /* ================= SCROLL LOOP ================= */
  let lastY = 0;
  const heroImg = $(".hero__bg img");
  function onScroll() {
    const y = scrollY, vh = innerHeight, max = document.documentElement.scrollHeight - vh;
    nav.classList.toggle("hide", y > lastY && y > vh && !menu.classList.contains("open"));
    lastY = y;
    dock.classList.toggle("on", y > vh * .8 && y < max - 300);
    if (!reduced && y < vh * 1.2) heroImg.style.transform = `scale(1.1) translateY(${y * .25}px)`;
    updateRoute(); updateClock();
    let ci = -1, best = -Infinity;
    navSecs.forEach((s, i) => { if (!s) return; const t = s.getBoundingClientRect().top; if (t < vh * .4 && t > best && s.getBoundingClientRect().bottom > vh * .3) { best = t; ci = i; } });
    navLinks.forEach((a, i) => a.classList.toggle("cur", i === ci));
  }
  lenis ? lenis.on("scroll", onScroll) : addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);

  /* ================= LANGUAGE RE-RENDER / INIT ================= */
  document.addEventListener("lang", () => { renderBoard(); buildRoute(); renderStops(); update(); renderOpens(); updateClock(); fi = 0; setFlaps(fb, D().final[0], 12); buildMobilePassport(); });
  let saved = "en"; try { saved = localStorage.getItem("gtte2-lang") || "en"; } catch (e) {}
  renderStops(); update(); buildRoute(); renderOpens(); buildMobilePassport();
  setLang(saved);
  requestAnimationFrame(() => { scatter(true); onScroll(); });
  addEventListener("load", () => { scatter(true); cx = tagGeom(); onScroll(); });
})();
