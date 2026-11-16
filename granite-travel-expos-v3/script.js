/* =========================================================
   Granite Travel Trade Expos — V3 "The World, in Your City"
   ========================================================= */
(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const compact = () => innerWidth <= 760;
  const RAD = Math.PI / 180;

  /* ================= DATA ================= */
  const CITIES = [
    ["lon", "London", "ON", "2027-04-05", "-04:00", 42.98, -81.25, "spring", "ontario"],
    ["kw", "Kitchener-Waterloo", "ON", "2027-04-06", "-04:00", 43.45, -80.49, "spring", "ontario", "Kitchener"],
    ["bar", "Barrie", "ON", "2027-04-07", "-04:00", 44.39, -79.69, "spring", "ontario"],
    ["osh", "Oshawa", "ON", "2027-04-08", "-04:00", 43.9, -78.86, "spring", "ontario"],
    ["stj", "St. John's", "NL", "2027-05-31", "-02:30", 47.56, -52.71, "spring", "atlantic"],
    ["hal", "Halifax", "NS", "2027-06-02", "-03:00", 44.65, -63.57, "spring", "atlantic"],
    ["mon", "Moncton", "NB", "2027-06-03", "-03:00", 46.09, -64.78, "spring", "atlantic"],
    ["win", "Winnipeg", "MB", "2027-10-05", "-05:00", 49.9, -97.14, "fall", "west"],
    ["rd", "Red Deer", "AB", "2027-10-06", "-06:00", 52.27, -113.81, "fall", "west"],
    ["kel", "Kelowna", "BC", "2027-10-07", "-07:00", 49.89, -119.5, "fall", "west"],
    ["ott", "Ottawa", "ON", "2027-11-01", "-04:00", 45.42, -75.7, "fall", "ontario"],
    ["kin", "Kingston", "ON", "2027-11-02", "-04:00", 44.23, -76.48, "fall", "ontario"],
    ["mar", "Markham", "ON", "2027-11-03", "-04:00", 43.86, -79.34, "fall", "ontario"],
    ["ham", "Hamilton", "ON", "2027-11-04", "-04:00", 43.26, -79.87, "fall", "ontario"],
  ].map(([id, n, p, d, tz, lat, lon, s, r, short], i) => ({ id, n, p, d, tz, lat, lon, s, r, short: short || n, i, start: new Date(`${d}T16:00:00${tz}`), end: new Date(`${d}T20:00:00${tz}`) }));
  const nextExpo = () => CITIES.find(c => c.end > new Date()) || CITIES[CITIES.length - 1];
  const ORIGINS = [
    ["Jamaica", 18.1, -77.3, "Jamaica Tourist Board · Couples Resorts · Sandals & Beaches"],
    ["Mexico", 20.6, -87.1, "Hoteles Xcaret · Los Cabos · Puerto Vallarta · The Palace Company · Karisma"],
    ["Dominican Republic", 18.6, -68.4, "Bahia Principe · Lopesan Costa Bávaro · Princess Hotels & Resorts"],
    ["The Bahamas", 25.05, -77.35, "Bahamas Ministry of Tourism · Nassau & Paradise Island"],
    ["Barbados", 13.1, -59.6, "Barbados Tourism"],
    ["Cayman Islands", 19.3, -81.4, "Cayman Islands Department of Tourism"],
    ["St. Kitts", 17.3, -62.7, "St. Kitts Tourism Authority"],
    ["St. Maarten", 18.04, -63.05, "St. Maarten Tourism Bureau"],
    ["St. Vincent & the Grenadines", 13.25, -61.2, "St. Vincent and the Grenadines Tourism"],
    ["Bermuda", 32.3, -64.8, "BermudAir"],
    ["Florida, USA", 28.5, -81.4, "Visit Orlando · Visit Florida Keys · The Palm Beaches · Fort Myers · Brightline"],
    ["Chicago, USA", 41.9, -87.6, "Choose Chicago"],
    ["South Carolina, USA", 33.7, -78.9, "Visit Myrtle Beach"],
    ["Spain", 40.4, -3.7, "Iberostar · Catalonia · Palladium · Iryo · The Spanish Touch"],
    ["Azores, Portugal", 37.74, -25.67, "SATA Azores Airlines"],
    ["United Kingdom", 51.5, -0.12, "Great Western Railway · Explore Worldwide · Trafalgar"],
    ["Switzerland", 46.9, 7.4, "Globus · Uniworld Boutique River Cruises"],
    ["Finnish Lapland", 68.4, 27.4, "Kakslauttanen & Utsjoki Arctic Resorts"],
    ["Uganda", 0.35, 32.6, "Ngoni Safaris Uganda"],
    ["Tanzania", -3.4, 36.7, "Mkuki Adventures"],
    ["Dubai, UAE", 25.2, 55.3, "Dubai Tourism"],
    ["Australia", -33.9, 151.2, "Tourism Australia"],
    ["China", 39.9, 116.4, "Wendy Wu Tours"],
  ].map(([n, lat, lon, ex]) => ({ n, lat, lon, ex }));
  const VIDEOS = [
    ["zp0zezI4tuI", "Jose Cervera", "Director of Sales · BlueBay Hotels & Resorts"],
    ["xg_gZBNSCDA", "Nicole Perez", "Director of Sales N.A. · Princess Hotels & Resorts"],
    ["KSQx12RlJkE", "Herbert Byaruhanga", "Managing Director · Bird Uganda Safaris"],
    ["WwtXEpUUTTE", "Luis Chaverri", "Business Development · Amstar DMC"],
    ["PEZIhQZDFyU", "Gavin Jimenez", "Business Development · Sirenis Hotels & Resorts"],
  ];
  const QUOTES = [
    ["I would highly recommend these shows for suppliers — the smaller shows allow for better connections. Our time together was not rushed as happens at the bigger shows. A win, win.", "Pam Bassett", "BDM Canada, Oasis Hotels & Resorts"],
    ["One of the best planned events I have been to post-COVID. I look forward to attending the next Granite Travel Trade Expo.", "Karen K.", "Travel Consultant, Victoria BC"],
    ["The time to talk with qualified travel agents — in cities we normally would not visit — was a big bonus. Great job to Brad and his team.", "Nieves Ricardo", "Cuba Tourist Board"],
    ["All the events were perfectly organized. The attendees were high-quality travel advisors representing real business for us suppliers.", "Karina Fuentes", "BDM, Catalonia Hotels & Resorts"],
  ];

  /* ================= I18N ================= */
  const LOC = { en: "en-CA", es: "es-MX", fr: "fr-CA" };
  const T = {
    es: {
      "nav.world": "Mundo", "nav.sides": "Lados", "nav.tour": "Gira", "nav.voices": "Voces", "nav.price": "Exponer", "nav.adv": "Agentes", "nav.gallery": "Galería", "nav.contact": "Contacto",
      "cta.exhibit": "Exponer 2027", "cta.exhibit2": "Exponer en 2027", "cta.adv": "Soy agente de viajes",
      "hero.label": "(01) Primavera y otoño 2027 — 14 ciudades canadienses", "hero.t1": "El mundo,", "hero.t2": "en tu ciudad.",
      "hero.lead": "Granite Travel Trade Expos lleva destinos, resorts, navieras y operadores de más de veinte países directamente a los mejores agentes de viaje en los mercados secundarios más influyentes de Canadá.",
      "hero.hint": "Arrastra para girar · pasa sobre un origen rojo", "hero.s1": "países y territorios exponiendo", "hero.s2": "expositores globales en 2026", "hero.s3": "agentes en una sola serie", "hero.s4": "ciudades en la gira 2027",
      "k.label": "(02) Boutique por diseño", "k.l1": "No somos", "k.l2": "los más grandes.", "k.l3": "A propósito.", "k.p": "Cuando los proveedores llegan a la comunidad del agente, se nota. Se agradece. Y se convierte.",
      "b.1": "Conversaciones cara a cara", "b.1t": "Tiempo individual y sin prisas en tu mesa — no un discurso de tres minutos en un pasillo lleno.", "b.2": "Mejor formación de producto", "b.2t": "Presentaciones estructuradas ante una sala sentada y atenta de agentes.", "b.3": "Relaciones más profundas", "b.3t": "Las cenas de networking convierten primeras reuniones en socios de venta a largo plazo.", "b.4": "Impulso real de ventas", "b.4t": "Los agentes salen con conocimiento que pueden reservar a la mañana siguiente.",
      "sd.label": "(03) Dos lados, una sala", "sd.title": '¿De qué lado <em>estás?</em>', "sd.aTag": "Para expositores", "sd.aT": "Conoce a los agentes que realmente te venden.", "sd.a1": "Acceso directo a agentes locales comprometidos", "sd.a2": "Señalización impresa a color", "sd.a3": "Participación en la cena de networking", "sd.a4": "Logo en el sitio · mesa vestida de 6–8 pies", "sd.aC": "Arma tu gira",
      "sd.bTag": "Para agentes de viaje", "sd.bT": "Los mejores proveedores del mundo, a poca distancia.", "sd.b1": "Asistencia gratuita — la cena va por nuestra cuenta", "sd.b2": "Mastercard de $20 para los primeros 50 agentes", "sd.b3": "Formación de producto de más de 80 marcas", "sd.b4": "Sorteos de premios cada noche", "sd.bC": "Avísame", "sd.l": "Expositores", "sd.r": "Agentes",
      "t.label": "(04) La gira 2027", "t.title": 'Catorce ciudades. <em>Dos temporadas.</em>', "t.p": "Mercados seleccionados estratégicamente donde los agentes venden activamente — y donde los proveedores rara vez tienen la sala para ellos solos.", "t.hint": "Desplázate — la gira se mueve de lado →",
      "e.label": "(05) Una velada", "e.title": 'Arrastra a través <em>de la noche.</em>', "e.a1": "Presentaciones de proveedores", "e.a1t": "Sesiones moderadas con video — cada proveedor tiene la sala para contar su historia.", "e.s1": "Presentaciones", "e.s2": "Feria", "e.s3": "Cena",
      "v.label": "(06) Voces desde la feria", "v.title": 'Desliza las <em>pruebas.</em>', "v.p": "Cinco expositores en video, cuatro por escrito. Lanza una tarjeta para ver la siguiente — toca un video para verlo ahí mismo.",
      "p.label": "(07) Registro de expositores 2027", "p.title": 'Más escalas, <em>menor tarifa.</em>', "p.lead": "Toca las ciudades para armar tu gira y mira bajar el ecualizador. 4–8 expos ahorran 10%, 9–11 ahorran 15%, 12–14 ahorran 20% — desde $1,116 CAD por expo.",
      "p.sp": "Primavera", "p.fa": "Otoño", "p.all": "Las 14", "p.clr": "Borrar", "p.ex": "Solo exhibición", "p.pr": "Presentación + exhibición", "p.wait": "Lista de espera", "p.total": "Total (CAD)", "p.n": "Expos", "p.tier": "Descuento", "p.per": "Por expo", "p.save": "Ahorras", "p.dep": "Depósito 50%", "p.hst": "Incluir 13% HST", "p.cta": "Registrar estas expos", "p.fine": "Depósito del 50% al registrarte · saldo 90 días antes de cada serie · patrocinios exclusivos por categoría a solicitud.",
      "a.label": "(08) Llamado a todos los agentes", "a.title": 'Asistencia gratis. <em>Raspa el beneficio.</em>', "a.p": "Aprende de las marcas que vendes, conoce a sus líderes de ventas, cena por nuestra cuenta — y los primeros 50 agentes en cada expo se llevan una tarjeta de regalo.", "a.opens": "El registro de agentes abre 5 semanas antes de cada expo", "a.ph": "tu@agencia.com", "a.notify": "Avísame", "a.won": "Primeros 50 agentes · cada expo", "a.scr": "Raspa la tarjeta ↑", "a.again": "Reiniciar",
      "pt.label": "(09) Patrocinadores y socios 2026", "pt.s1": "Patrocinador hotelero", "pt.s2": "Patrocinador de tarjetas", "pt.s3": "Socio de experiencia ártica", "pt.hint": "Muévete por el campo — las marcas te abren paso.",
      "g.label": "(10) Granite Productions", "g.title": 'Un archivo de eventos <em>sin fin.</em>', "g.all": "Galerías completas", "g.hint": "Arrastra en cualquier dirección · toca para abrir",
      "pr.label": "(11) En las noticias", "tm.label": "(12) Las personas detrás", "tm.r1": "Director General", "tm.r2": "Director Creativo", "tm.r3": "Maestro de ceremonias y embajador", "tm.r4": "Ventas", "tm.r5": "Consultor de eventos",
      "tm.b1": "Cofundó Quadra Innovations y Granite Productions en 2010 y lanzó Granite Travel Trade Expos en 2023.", "tm.b2": "Más de 20 años en tecnología, de Adobe Acrobat a la fotografía 360° — captura el foto y video de cada expo para los expositores.", "tm.b3": "Más de 30 años en la industria, incluido Director Nacional de Ventas en Canadá para Bahia Principe.", "tm.b4": "Más de 40 años en operadores y hoteles, incluidos 16 años al frente del mercado canadiense de Barceló.", "tm.b5": "Una perspectiva internacional forjada en salud, tecnología, educación, turismo y filantropía.",
      "f.title": 'Construye relaciones. <em>Impulsa tu negocio.</em>', "f.nlk": "Lista de correo", "f.nlh": "Entérate primero de los próximos eventos.", "f.ph": "Correo electrónico", "f.join": "Unirme", "f.sup": "Ser proveedor", "f.agt": "Asistir como agente", "f.top": "Volver arriba ↑",
      "r.label": "Registro de expositores 2027", "r.title": "Asegura tu lugar", "r.s1": "Empresa", "r.s2": "Pago", "r.s3": "Listo", "r.company": "Nombre de la empresa *", "r.contact": "Persona de contacto *", "r.phone": "Teléfono *", "r.country": "País *", "r.cur": "Moneda", "r.amt": "Pagar ahora", "r.dep": "Depósito 50%", "r.full": "Monto total", "r.method": "Método", "r.cc": "Tarjeta +3%", "r.wire": "Transferencia", "r.terms": "Acepto los términos de pago y la política de cancelación.", "r.due": "A pagar hoy", "r.done": "Estás en la gira 2027.", "r.donet": "Este es un prototipo de diseño — en el sitio real tu registro y enlace de pago se enviarían al instante.", "r.back": "Atrás", "r.next": "Continuar",
      _: { months: ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"], season: { spring: "Primavera 2027", fall: "Otoño 2027" }, region: { ontario: "Ontario", atlantic: "Atlántico", west: "Oeste de Canadá" }, away: n => `faltan ${n} días`, cal: "Calendario", add: "+ A mi gira", added: "✓ En mi gira", endT: "Las 14. Ahorra 20%.", endP: "Reserva la gira completa y expón desde $1,116 CAD por expo.", endB: "Reservar las 14", acts: [["Presentaciones de proveedores", "Sesiones moderadas con video — cada proveedor tiene la sala para contar su historia."], ["Feria de proveedores", "Mesas vestidas, señalización impresa, folletos y promociones — conversaciones sin prisa que convierten."], ["Cena ligera y sorteos", "Una cena de networking y premios que envían a cada agente a casa feliz — y leal."]], play: "Ver video", from: "Exponiendo desde", feed: "EN VIVO", opens: (c, d) => `días hasta que abra el registro para ${c} (${d}).`, openNow: c => `¡El registro para ${c} está abierto!`, scrD: p => `${p}% raspado`, won: "¡Premio! Mastercard de $20 para los primeros 50 agentes.", pick: "Elige al menos una ciudad.", waitlist: "Añadido a la lista de presentaciones — con tarifa de exhibición por ahora.", added1: c => `${c} añadida a tu gira`, notify: "Te avisaremos cuando abra el registro.", invalid: "Ingresa un correo válido.", thanks: "¡Gracias! Estás en la lista.", submit: "Enviar registro", sumN: "Expos", sumT: "Total" },
    },
    fr: {
      "nav.world": "Monde", "nav.sides": "Côtés", "nav.tour": "Tournée", "nav.voices": "Voix", "nav.price": "Exposer", "nav.adv": "Conseillers", "nav.gallery": "Galerie", "nav.contact": "Contact",
      "cta.exhibit": "Exposer 2027", "cta.exhibit2": "Exposer en 2027", "cta.adv": "Je suis conseiller en voyages",
      "hero.label": "(01) Printemps et automne 2027 — 14 villes canadiennes", "hero.t1": "Le monde,", "hero.t2": "dans votre ville.",
      "hero.lead": "Les Granite Travel Trade Expos amènent destinations, complexes hôteliers, croisiéristes et voyagistes de plus de vingt pays directement aux meilleurs conseillers en voyages des marchés régionaux les plus influents du Canada.",
      "hero.hint": "Glissez pour tourner · survolez une origine rouge", "hero.s1": "pays et territoires exposants", "hero.s2": "exposants internationaux en 2026", "hero.s3": "conseillers en une seule série", "hero.s4": "villes sur la tournée 2027",
      "k.label": "(02) Boutique par nature", "k.l1": "Pas le", "k.l2": "plus grand.", "k.l3": "C'est voulu.", "k.p": "Quand les fournisseurs viennent dans la communauté des conseillers, ça se remarque. Ça s'apprécie. Et ça se concrétise.",
      "b.1": "Des échanges en personne", "b.1t": "Du temps en tête-à-tête à votre table — pas un pitch de trois minutes dans une allée bondée.", "b.2": "Une meilleure formation produit", "b.2t": "Des présentations structurées devant une salle assise et attentive.", "b.3": "Des relations plus profondes", "b.3t": "Les soupers réseautage transforment une première rencontre en partenariat durable.", "b.4": "Un vrai élan de ventes", "b.4t": "Les conseillers repartent avec des connaissances qu'ils vendent dès le lendemain.",
      "sd.label": "(03) Deux côtés, une salle", "sd.title": 'De quel côté <em>êtes-vous?</em>', "sd.aTag": "Pour les exposants", "sd.aT": "Rencontrez les conseillers qui vous vendent vraiment.", "sd.a1": "Accès direct à des conseillers locaux engagés", "sd.a2": "Affiche imprimée en couleur sur mesure", "sd.a3": "Participation au souper réseautage", "sd.a4": "Logo sur le site · table habillée de 6 à 8 pi", "sd.aC": "Créer ma tournée",
      "sd.bTag": "Pour les conseillers", "sd.bT": "Les meilleurs fournisseurs au monde, à deux pas.", "sd.b1": "Gratuit — le souper est offert", "sd.b2": "Carte Mastercard de 20 $ pour les 50 premiers", "sd.b3": "Formation produit de plus de 80 marques", "sd.b4": "Tirages de prix chaque soir", "sd.bC": "M'aviser", "sd.l": "Exposants", "sd.r": "Conseillers",
      "t.label": "(04) La tournée 2027", "t.title": 'Quatorze villes. <em>Deux saisons.</em>', "t.p": "Des marchés choisis stratégiquement, là où les conseillers vendent activement — et où les fournisseurs ont rarement la salle pour eux seuls.", "t.hint": "Faites défiler — la tournée avance de côté →",
      "e.label": "(05) Une soirée", "e.title": 'Glissez à travers <em>la soirée.</em>', "e.a1": "Présentations des fournisseurs", "e.a1t": "Séances animées avec vidéo — chaque fournisseur a la salle pour raconter son histoire.", "e.s1": "Présentations", "e.s2": "Salon", "e.s3": "Souper",
      "v.label": "(06) Les voix du plancher", "v.title": 'Glissez parmi <em>les preuves.</em>', "v.p": "Cinq exposants en vidéo, quatre par écrit. Lancez une carte pour voir la suivante — touchez une vidéo pour la lire sur place.",
      "p.label": "(07) Inscription des exposants 2027", "p.title": 'Plus d\'escales, <em>tarif plus bas.</em>', "p.lead": "Touchez les villes pour bâtir votre tournée et regardez l'égaliseur baisser. 4 à 8 salons : −10 %, 9 à 11 : −15 %, 12 à 14 : −20 % — dès 1 116 $ CA par salon.",
      "p.sp": "Printemps", "p.fa": "Automne", "p.all": "Les 14", "p.clr": "Effacer", "p.ex": "Exposition seulement", "p.pr": "Présentation + exposition", "p.wait": "Liste d'attente", "p.total": "Total ($ CA)", "p.n": "Salons", "p.tier": "Rabais", "p.per": "Par salon", "p.save": "Économie", "p.dep": "Dépôt 50 %", "p.hst": "Inclure la TVH de 13 %", "p.cta": "Inscrire ces salons", "p.fine": "Dépôt de 50 % à l'inscription · solde 90 jours avant chaque série · commandites exclusives par catégorie sur demande.",
      "a.label": "(08) Avis aux conseillers en voyages", "a.title": 'Entrée gratuite. <em>Grattez l\'avantage.</em>', "a.p": "Apprenez des marques que vous vendez, rencontrez leurs responsables des ventes, soupez à nos frais — et les 50 premiers conseillers à chaque salon repartent avec une carte-cadeau.", "a.opens": "L'inscription des conseillers ouvre 5 semaines avant chaque salon", "a.ph": "vous@agence.com", "a.notify": "M'aviser", "a.won": "50 premiers conseillers · chaque salon", "a.scr": "Grattez la carte ↑", "a.again": "Recommencer",
      "pt.label": "(09) Commanditaires et partenaires 2026", "pt.s1": "Commanditaire hôtelier", "pt.s2": "Commanditaire des cartes-cadeaux", "pt.s3": "Partenaire expérience arctique", "pt.hint": "Traversez le champ — les marques vous font de la place.",
      "g.label": "(10) Granite Productions", "g.title": 'Des archives <em>sans fin.</em>', "g.all": "Toutes les galeries", "g.hint": "Glissez dans tous les sens · touchez pour ouvrir",
      "pr.label": "(11) Dans les médias", "tm.label": "(12) L'équipe derrière", "tm.r1": "Directeur général", "tm.r2": "Directeur de création", "tm.r3": "Animateur et ambassadeur", "tm.r4": "Ventes", "tm.r5": "Conseiller en événements",
      "tm.b1": "Cofondateur de Quadra Innovations et de Granite Productions en 2010, il lance les Granite Travel Trade Expos en 2023.", "tm.b2": "Plus de 20 ans en technologie, d'Adobe Acrobat à la photo 360° — il capte photos et vidéos de chaque salon pour les exposants.", "tm.b3": "Plus de 30 ans dans l'industrie, dont directeur national des ventes au Canada pour Bahia Principe.", "tm.b4": "Plus de 40 ans chez des voyagistes et hôteliers, dont 16 ans à la tête du marché canadien de Barceló.", "tm.b5": "Une perspective internationale forgée en santé, technologie, éducation, tourisme et philanthropie.",
      "f.title": 'Bâtissez des relations. <em>Faites croître vos affaires.</em>', "f.nlk": "Infolettre", "f.nlh": "Soyez les premiers informés des prochains événements.", "f.ph": "Courriel", "f.join": "M'abonner", "f.sup": "Devenir fournisseur", "f.agt": "Participer comme conseiller", "f.top": "Haut de page ↑",
      "r.label": "Inscription des exposants 2027", "r.title": "Réservez votre place", "r.s1": "Entreprise", "r.s2": "Paiement", "r.s3": "Terminé", "r.company": "Nom de l'entreprise *", "r.contact": "Personne-ressource *", "r.phone": "Téléphone *", "r.country": "Pays *", "r.cur": "Devise", "r.amt": "Payer maintenant", "r.dep": "Dépôt 50 %", "r.full": "Montant total", "r.method": "Mode", "r.cc": "Carte +3 %", "r.wire": "Virement", "r.terms": "J'accepte les modalités de paiement et la politique d'annulation.", "r.due": "Dû aujourd'hui", "r.done": "Vous faites partie de la tournée 2027.", "r.donet": "Ceci est un prototype — sur le site réel, votre inscription et votre lien de paiement seraient envoyés instantanément.", "r.back": "Retour", "r.next": "Continuer",
      _: { months: ["JAN", "FÉV", "MAR", "AVR", "MAI", "JUN", "JUL", "AOÛ", "SEP", "OCT", "NOV", "DÉC"], season: { spring: "Printemps 2027", fall: "Automne 2027" }, region: { ontario: "Ontario", atlantic: "Atlantique", west: "Ouest canadien" }, away: n => `dans ${n} jours`, cal: "Calendrier", add: "+ À ma tournée", added: "✓ Dans ma tournée", endT: "Les 14. −20 %.", endP: "Réservez la tournée complète et exposez dès 1 116 $ CA par salon.", endB: "Réserver les 14", acts: [["Présentations des fournisseurs", "Séances animées avec vidéo — chaque fournisseur a la salle pour raconter son histoire."], ["Salon des fournisseurs", "Tables habillées, affiches imprimées, brochures et promos — des échanges sans hâte qui rapportent."], ["Souper léger et tirages", "Un souper réseautage et des prix qui renvoient chaque conseiller chez lui heureux — et fidèle."]], play: "Lire la vidéo", from: "Exposants de", feed: "EN DIRECT", opens: (c, d) => `jours avant l'ouverture des inscriptions pour ${c} (${d}).`, openNow: c => `L'inscription pour ${c} est ouverte!`, scrD: p => `${p} % gratté`, won: "Gagné! Carte Mastercard de 20 $ pour les 50 premiers conseillers.", pick: "Choisissez au moins une ville.", waitlist: "Ajouté à la liste d'attente des présentations — au tarif exposition d'ici là.", added1: c => `${c} ajoutée à votre tournée`, notify: "Nous vous aviserons à l'ouverture des inscriptions.", invalid: "Entrez un courriel valide.", thanks: "Merci! Vous êtes abonné.", submit: "Soumettre l'inscription", sumN: "Salons", sumT: "Total" },
    },
  };
  const EN = { months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"], season: { spring: "Spring 2027", fall: "Fall 2027" }, region: { ontario: "Ontario", atlantic: "Atlantic Canada", west: "Western Canada" }, away: n => `${n} days away`, cal: "Calendar", add: "+ Add to tour", added: "✓ In my tour", endT: "All 14. Save 20%.", endP: "Book the full tour and exhibit from just $1,116 CAD per expo.", endB: "Book all 14", acts: [["Supplier Presentations", "Seated, moderated sessions with video — every supplier owns the room for their story."], ["Supplier Trade Show", "Draped tables, printed signage, brochures and promos — unrushed conversations that convert."], ["Light Dinner & Prize Giveaways", "A networking dinner and prize draws that send every advisor home happy — and loyal."]], play: "Play video", from: "Exhibiting from", feed: "LIVE", opens: (c, d) => `days until advisor registration opens for ${c} (${d}).`, openNow: c => `Registration for ${c} is open now!`, scrD: p => `${p}% scratched`, won: "Winner! $20 Mastercard for the first 50 advisors.", pick: "Pick at least one city first.", waitlist: "Added to the presentation waitlist — priced as Exhibit-only for now.", added1: c => `${c} added to your tour`, notify: "We'll email you the moment registration opens.", invalid: "Please enter a valid email.", thanks: "Thank you — you're on the list.", submit: "Submit registration", sumN: "Expos", sumT: "Total" };
  let lang = "en";
  const D = () => (lang === "en" ? EN : T[lang]._);
  const loc = () => LOC[lang];
  const money = v => new Intl.NumberFormat(loc(), { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 }).format(Math.round(v));
  const dfmt = (d, o) => new Intl.DateTimeFormat(loc(), { timeZone: "UTC", ...o }).format(new Date(d + "T12:00:00Z"));
  $$("[data-i18n]").forEach(el => (el.dataset.en = el.innerHTML));
  $$("[data-i18n-html]").forEach(el => (el.dataset.en = el.innerHTML));
  $$("[data-i18n-ph]").forEach(el => (el.dataset.en = el.placeholder));
  function setLang(l) {
    lang = T[l] ? l : "en";
    document.documentElement.lang = lang === "fr" ? "fr-CA" : lang;
    const d = T[lang] || {};
    $$("[data-i18n]").forEach(el => (el.innerHTML = lang === "en" ? el.dataset.en : d[el.dataset.i18n] ?? el.dataset.en));
    $$("[data-i18n-html]").forEach(el => (el.innerHTML = lang === "en" ? el.dataset.en : d[el.dataset.i18nHtml] ?? el.dataset.en));
    $$("[data-i18n-ph]").forEach(el => (el.placeholder = lang === "en" ? el.dataset.en : d[el.dataset.i18nPh] ?? el.dataset.en));
    $$(".lang button").forEach(b => { const on = b.dataset.lang === lang; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    try { localStorage.setItem("gtte3-lang", lang); } catch (e) {}
    document.dispatchEvent(new Event("lang"));
  }
  $$(".lang button").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));

  let tt;
  const toast = m => { const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 3200); };
  const emailOK = v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
  function confetti(n = 90) {
    if (reduced) return;
    const cols = ["#e2232e", "#0f1115", "#ffffff", "#ff8a8e", "#c9c6bd"];
    for (let i = 0; i < n; i++) {
      const c = document.createElement("i"); c.className = "confetti"; c.style.background = cols[i % 5]; document.body.appendChild(c);
      let x = innerWidth / 2, y = innerHeight / 2, a = Math.random() * Math.PI * 2, sp = 6 + Math.random() * 10, vx = Math.cos(a) * sp, vy = Math.sin(a) * sp - 8, r = 0, life = 0;
      const t = () => { life++; vy += .35; vx *= .985; x += vx; y += vy; r += vx * 2; c.style.transform = `translate(${x}px,${y}px) rotate(${r}deg)`; c.style.opacity = 1 - life / 140; life < 140 ? requestAnimationFrame(t) : c.remove(); };
      requestAnimationFrame(t);
    }
  }

  /* ================= LOADER ================= */
  let lp = 0, done = false;
  const lt = setInterval(() => {
    lp = Math.min(lp + 7 + Math.random() * 14, document.readyState === "complete" ? 100 : 90);
    $("#loaderPct").textContent = String(Math.floor(lp)).padStart(3, "0"); $("#loaderBar").style.width = lp + "%";
    if (lp >= 100) { clearInterval(lt); setTimeout(finish, 350); }
  }, 110);
  function finish() {
    if (done) return; done = true;
    $("#loader").classList.add("done"); document.body.classList.remove("is-loading");
    setTimeout(() => document.body.classList.add("is-ready"), 300);
    setTimeout(() => $("#loader").remove(), 1200);
  }
  setTimeout(() => { clearInterval(lt); finish(); }, 4200);

  /* ================= SCROLL / NAV ================= */
  let lenis = null;
  if (!reduced && window.Lenis) { lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }); const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  const goTo = el => { if (!el) return; lenis ? lenis.scrollTo(el, { offset: -60 }) : el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); };
  document.addEventListener("click", e => { const a = e.target.closest('a[href^="#"]'); if (!a) return; const id = a.getAttribute("href"), el = id === "#top" ? document.body : $(id); if (!el) return; e.preventDefault(); closeMenu(); goTo(el); });
  const nav = $("#nav"), burger = $("#burger"), menu = $("#menu"), dock = $("#dock");
  function closeMenu() { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); menu.setAttribute("aria-hidden", "true"); lenis && lenis.start(); }
  burger.addEventListener("click", () => { const o = !menu.classList.contains("open"); menu.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); menu.setAttribute("aria-hidden", !o); lenis && (o ? lenis.stop() : lenis.start()); });
  const navA = $$(".nav__idx a"), navS = navA.map(a => $(a.getAttribute("href")));

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  $$(".rv").forEach((el, i) => { el.style.setProperty("--d", (i % 4) * 80 + "ms"); io.observe(el); });
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; const el = e.target, to = +el.dataset.to, t0 = performance.now();
    const st = n => { const p = clamp((n - t0) / 1800, 0, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))).toLocaleString("en-CA"); if (p < 1) requestAnimationFrame(st); };
    requestAnimationFrame(st); cio.unobserve(el);
  }), { threshold: .6 });
  $$(".cnt").forEach(el => cio.observe(el));
  const visible = (el, cb, th = 0) => new IntersectionObserver(es => cb(es[0].isIntersecting), { threshold: th }).observe(el);

  /* ================= GLOBE ================= */
  const gWrap = $("#globeWrap"), cv = $("#globe"), ctx = cv.getContext("2d"), tip = $("#globeTip");
  const land = window.GLOBE_LAND || [];
  const LP = new Float32Array((land.length / 2) * 3);
  const vec = (lat, lon) => { const a = lat * RAD, b = lon * RAD; return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)]; };
  for (let i = 0, j = 0; i < land.length; i += 2, j += 3) { const v = vec(land[i] / 10, land[i + 1] / 10); LP[j] = v[0]; LP[j + 1] = v[1]; LP[j + 2] = v[2]; }
  ORIGINS.forEach(o => (o.v = vec(o.lat, o.lon)));
  CITIES.forEach(c => (c.v = vec(c.lat, c.lon)));
  let gW = 0, gH = 0, R = 0, cx = 0, cy = 0, dpr = 1, lam = -62, phi = 32, vLam = 0, vPhi = 0, gDrag = false, lastDrag = 0, gVisible = true, hoverO = null;
  function gSize() { dpr = Math.min(2, devicePixelRatio || 1); gW = gWrap.clientWidth; gH = gWrap.clientHeight; cv.width = gW * dpr; cv.height = gH * dpr; R = Math.min(gW, gH) * .44; cx = gW * (compact() ? .5 : .52); cy = gH * .5; }
  gSize(); addEventListener("resize", gSize); if (window.ResizeObserver) new ResizeObserver(gSize).observe(gWrap);
  let ca, sa, cb, sb;
  const rot = v => { const x = v[0] * ca + v[2] * sa, z1 = -v[0] * sa + v[2] * ca, y = v[1] * cb - z1 * sb, z = v[1] * sb + z1 * cb; return [x, y, z]; };
  const slerp = (a, b, t) => { const d = clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1), w = Math.acos(d); if (w < 1e-4) return a; const s = Math.sin(w), k1 = Math.sin((1 - t) * w) / s, k2 = Math.sin(t * w) / s; return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2]; };
  const arcs = [];
  let feedEl = $("#feed");
  function spawnArc() {
    const o = ORIGINS[Math.floor(Math.random() * ORIGINS.length)], c = CITIES[Math.floor(Math.random() * CITIES.length)];
    const d = Math.acos(clamp(o.v[0] * c.v[0] + o.v[1] * c.v[1] + o.v[2] * c.v[2], -1, 1));
    arcs.push({ o, c, t: 0, h: .08 + d * .16, sp: .006 + Math.random() * .004 });
    feedEl.textContent = `${D().feed} — ${o.n} → ${c.short}, ${c.p}`;
  }
  const ripples = [];
  gWrap.addEventListener("pointerdown", e => { gDrag = true; gWrap.classList.add("drag"); gWrap.setPointerCapture(e.pointerId); tip.hidden = true; let lx = e.clientX, ly = e.clientY;
    const mv = ev => { const dx = ev.clientX - lx, dy = ev.clientY - ly; lx = ev.clientX; ly = ev.clientY; vLam = dx * .28; vPhi = dy * .22; lam -= dx * .28; phi = clamp(phi + dy * .22, -20, 70); };
    const up = () => { gDrag = false; lastDrag = performance.now(); gWrap.classList.remove("drag"); gWrap.removeEventListener("pointermove", mv); gWrap.removeEventListener("pointerup", up); gWrap.removeEventListener("pointercancel", up); };
    gWrap.addEventListener("pointermove", mv); gWrap.addEventListener("pointerup", up); gWrap.addEventListener("pointercancel", up);
  });
  gWrap.addEventListener("pointermove", e => {
    if (gDrag) return;
    const r = gWrap.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
    let best = null, bd = 18;
    ORIGINS.forEach(o => { if (!o.s || o.s[2] < 0) return; const d = Math.hypot(o.s[0] - mx, o.s[1] - my); if (d < bd) { bd = d; best = o; } });
    hoverO = best;
    if (best) { tip.hidden = false; tip.innerHTML = `<b>${best.n}</b><span>${D().from} ${best.n}: ${best.ex}</span>`; tip.style.left = best.s[0] + "px"; tip.style.top = best.s[1] + "px"; }
    else tip.hidden = true;
  });
  gWrap.addEventListener("pointerleave", () => { tip.hidden = true; hoverO = null; });
  visible(gWrap, v => (gVisible = v));
  let spawnT = 0;
  function drawGlobe(now) {
    if (!gVisible) return;
    if (!gDrag) { lam -= vLam *= .94; phi = clamp(phi + (vPhi *= .9), -20, 70); if (!reduced && now - lastDrag > 1500 && !hoverO) lam += .06; }
    ca = Math.cos(-lam * RAD); sa = Math.sin(-lam * RAD); cb = Math.cos(phi * RAD); sb = Math.sin(phi * RAD);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, gW, gH);
    // sphere
    const g = ctx.createRadialGradient(cx - R * .35, cy - R * .4, R * .1, cx, cy, R);
    g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#e4e2db");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(15,17,21,.18)"; ctx.lineWidth = 1; ctx.stroke();
    // land dots (bucketed alpha)
    const sz = Math.max(1.4, R / 210);
    for (let b = 0; b < 4; b++) {
      ctx.fillStyle = `rgba(15,17,21,${.18 + b * .2})`;
      ctx.beginPath();
      for (let j = 0; j < LP.length; j += 3) {
        const x0 = LP[j], y0 = LP[j + 1], z0 = LP[j + 2];
        const x = x0 * ca + z0 * sa, z1 = -x0 * sa + z0 * ca, y = y0 * cb - z1 * sb, z = y0 * sb + z1 * cb;
        if (z <= 0) continue;
        if (Math.min(3, Math.floor(z * 4)) !== b) continue;
        ctx.rect(cx + x * R - sz / 2, cy - y * R - sz / 2, sz, sz);
      }
      ctx.fill();
    }
    // origins
    ORIGINS.forEach(o => {
      const p = rot(o.v); o.s = [cx + p[0] * R, cy - p[1] * R, p[2]];
      if (p[2] <= 0) return;
      ctx.strokeStyle = o === hoverO ? "#e2232e" : "rgba(226,35,46,.75)"; ctx.lineWidth = o === hoverO ? 2.5 : 1.5;
      ctx.beginPath(); ctx.arc(o.s[0], o.s[1], o === hoverO ? 8 : 4.5, 0, Math.PI * 2); ctx.stroke();
    });
    // cities
    const pulse = (Math.sin(now / 400) + 1) / 2;
    CITIES.forEach(c => {
      const p = rot(c.v); if (p[2] <= 0) return; const x = cx + p[0] * R, y = cy - p[1] * R;
      ctx.fillStyle = "#e2232e"; ctx.fillRect(x - 3, y - 3, 6, 6);
      ctx.strokeStyle = `rgba(226,35,46,${.5 - pulse * .4})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, 6 + pulse * 6, 0, Math.PI * 2); ctx.stroke();
    });
    // arcs
    if (!reduced && now - spawnT > 650 && arcs.length < 9) { spawnArc(); spawnT = now; }
    for (let k = arcs.length - 1; k >= 0; k--) {
      const a = arcs[k]; a.t += a.sp;
      const head = Math.min(1, a.t), tail = clamp(a.t - .45, 0, 1);
      if (tail >= 1) { arcs.splice(k, 1); continue; }
      const N = 36; let started = false;
      ctx.lineWidth = 1.8; ctx.strokeStyle = "#e2232e"; ctx.beginPath();
      let hx = 0, hy = 0, hv = false;
      for (let i = 0; i <= N; i++) {
        const t = tail + (head - tail) * (i / N), v = slerp(a.o.v, a.c.v, t), lift = 1 + a.h * Math.sin(Math.PI * t), p = rot(v);
        const X = p[0] * lift, Y = p[1] * lift, vis = p[2] > 0 || (X * X + Y * Y) > 1;
        const sx = cx + X * R, sy = cy - Y * R;
        if (vis) { started ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy); started = true; } else started = false;
        if (i === N) { hx = sx; hy = sy; hv = vis; }
      }
      ctx.globalAlpha = .9; ctx.stroke(); ctx.globalAlpha = 1;
      if (head < 1 && hv) { ctx.fillStyle = "#e2232e"; ctx.beginPath(); ctx.arc(hx, hy, 3.2, 0, Math.PI * 2); ctx.fill(); }
      if (a.t >= 1 && !a.landed) { a.landed = true; ripples.push({ c: a.c, r: 0 }); }
    }
    for (let k = ripples.length - 1; k >= 0; k--) {
      const rp = ripples[k]; rp.r += .8; const p = rot(rp.c.v);
      if (rp.r > 26) { ripples.splice(k, 1); continue; }
      if (p[2] > 0) { ctx.strokeStyle = `rgba(226,35,46,${1 - rp.r / 26})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx + p[0] * R, cy - p[1] * R, rp.r, 0, Math.PI * 2); ctx.stroke(); }
    }
  }

  /* ================= KINETIC ================= */
  const kin = $("#kinetic"), kls = $$(".kl"), kP = $("#kP");
  const easeO = t => 1 - Math.pow(1 - t, 3);
  function updKinetic() {
    const r = kin.getBoundingClientRect(), p = clamp(-r.top / (r.height - innerHeight), 0, 1);
    kls.forEach((el, i) => { const q = clamp((p - i * .17) / .38, 0, 1); const caps = compact() ? [50, 40, 36] : [63, 63, 40]; el.style.setProperty("--w", (62 + caps[i] * easeO(q)).toFixed(1)); el.style.transform = compact() ? "" : `translateX(${(1 - easeO(q)) * (i % 2 ? 6 : -6)}vw)`; });
    kP.style.setProperty("--o", clamp((p - .62) / .2, 0, 1).toFixed(2));
  }

  /* rows hover image */
  const rImg = $("#rowsImg"), rImgEl = $("#rowsImgEl");
  if (fine) {
    let mx = 0, my = 0, x = 0, y = 0, on = false;
    $$(".row").forEach(r => { r.addEventListener("pointerenter", () => { rImgEl.src = r.dataset.img; rImg.classList.add("on"); on = true; }); r.addEventListener("pointerleave", () => { rImg.classList.remove("on"); on = false; }); });
    addEventListener("pointermove", e => { mx = e.clientX + 180; my = e.clientY; }, { passive: true });
    (function l() { x = lerp(x, mx, .15); y = lerp(y, my, .15); if (on || rImg.classList.contains("on")) { rImg.style.left = x + "px"; rImg.style.top = y + "px"; } requestAnimationFrame(l); })();
  }

  /* ================= SPLIT ================= */
  const split = $("#split"), sh = $("#splitHandle");
  let sx = 50, sDrag = false, hinted = false;
  const setX = v => { sx = clamp(v, 4, 96); split.style.setProperty("--x", sx + "%"); sh.setAttribute("aria-valuenow", Math.round(sx)); };
  const fromEv = e => { const r = split.getBoundingClientRect(); setX(((e.clientX - r.left) / r.width) * 100); };
  split.addEventListener("pointerdown", e => { if (e.target.closest("a")) return; sDrag = true; split.classList.add("drag"); split.setPointerCapture(e.pointerId); fromEv(e); hinted = true; });
  split.addEventListener("pointermove", e => { if (sDrag) fromEv(e); });
  const sUp = () => { sDrag = false; split.classList.remove("drag"); };
  split.addEventListener("pointerup", sUp); split.addEventListener("pointercancel", sUp);
  sh.addEventListener("keydown", e => { if (e.key === "ArrowLeft") { setX(sx - 5); e.preventDefault(); } if (e.key === "ArrowRight") { setX(sx + 5); e.preventDefault(); } });
  visible(split, v => {
    if (!v || hinted || reduced) return; hinted = true;
    const t0 = performance.now(), key = [50, 30, 70, 50];
    const run = n => { const p = clamp((n - t0) / 2600, 0, 1), seg = Math.min(2, Math.floor(p * 3)), lp2 = p * 3 - seg, e2 = lp2 < .5 ? 2 * lp2 * lp2 : 1 - Math.pow(-2 * lp2 + 2, 2) / 2; if (!sDrag) setX(lerp(key[seg], key[seg + 1], e2)); if (p < 1) requestAnimationFrame(run); };
    requestAnimationFrame(run);
  }, .5);

  /* ================= TOUR ================= */
  const tourSec = $("#tour"), track = $("#tourTrack"), ruler = $("#ruler");
  const sel = new Set();
  function buildTour() {
    $$(".tcard:not(.tcard--intro)", track).forEach(c => c.remove());
    track.insertAdjacentHTML("beforeend", CITIES.map(c => {
      const dd = dfmt(c.d, { day: "2-digit" }), mm = c.d.slice(5, 7), wk = dfmt(c.d, { weekday: "long" }), mon = dfmt(c.d, { month: "long" });
      return `<article class="tcard" data-id="${c.id}">
        <div class="tcard__top mono"><span>${String(c.i + 1).padStart(2, "0")} / 14</span><span class="tcard__season">${D().season[c.s]}</span></div>
        <h3 class="tcard__city" data-max="${c.short.length <= 6 ? 125 : c.short.length <= 8 ? 105 : 84}">${c.short}<span class="tcard__prov">${c.p}</span></h3>
        <div><div class="tcard__date"><b>${dd}.${mm}</b><span class="mono"><span>${wk}</span><span>${mon} 2027</span></span></div>
        <p class="mono" style="color:rgba(255,255,255,.5);margin:14px 0 16px">${D().region[c.r]} · ${D().away(Math.max(0, Math.ceil((c.start - new Date()) / 864e5)))} · 4–8 PM</p>
        <div class="tcard__acts"><button data-cal="${c.id}">${D().cal} ↓</button><button data-add="${c.id}" class="${sel.has(c.id) ? "on" : ""}">${sel.has(c.id) ? D().added : D().add}</button></div></div>
      </article>`;
    }).join("") + `<article class="tcard tcard__end"><h3 class="h2">${D().endT}</h3><p style="color:rgba(255,255,255,.65);max-width:32ch">${D().endP}</p><button class="btn btn--red" id="bookAll"><span>${D().endB}</span><i class="ar"></i></button></article>`);
    ruler.innerHTML = D().months.map(m => `<span>${m}</span>`).join("") + CITIES.map(c => { const doy = (new Date(c.d + "T12:00:00Z") - new Date("2027-01-01T00:00:00Z")) / 864e5; return `<i data-id="${c.id}" style="left:${(doy / 365) * 100}%"></i>`; }).join("") + `<b id="rulerBar"></b>`;
    $$("[data-cal]", track).forEach(b => b.addEventListener("click", () => ics(CITIES.find(c => c.id === b.dataset.cal))));
    $$("[data-add]", track).forEach(b => b.addEventListener("click", () => { const id = b.dataset.add; sel.has(id) ? sel.delete(id) : (sel.add(id), toast(D().added1(CITIES.find(c => c.id === id).short))); syncSel(); }));
    $("#bookAll").addEventListener("click", () => { CITIES.forEach(c => sel.add(c.id)); syncSel(); goTo($("#price")); });
    sizeTour();
  }
  function ics(c) {
    const f = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const s = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Granite Travel Trade Expos//EN", "BEGIN:VEVENT", `UID:gtte3-${c.id}@granitetravelexpos.com`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(c.start)}`, `DTEND:${f(c.end)}`, `SUMMARY:Granite Travel Trade Expo — ${c.n}, ${c.p}`, `LOCATION:${c.n}, ${c.p}, Canada`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([s], { type: "text/calendar" })); a.download = `granite-expo-${c.id}-2027.ics`; document.body.appendChild(a); a.click(); a.remove();
  }
  function sizeTour() { tourSec.style.height = compact() ? "" : `${track.scrollWidth - innerWidth + innerHeight}px`; }
  addEventListener("resize", sizeTour);
  function tourWidths() {
    const vw = innerWidth, mid = vw / 2;
    $$(".tcard", track).forEach(c => { const r = c.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid) / (vw * .6); const city = $(".tcard__city", c); if (city) { const mx = +city.dataset.max || 125; city.style.setProperty("--w", (62 + (mx - 62) * (1 - clamp(d, 0, 1))).toFixed(1)); } });
  }
  function updTour() {
    if (compact()) { tourWidths(); return; }
    const r = tourSec.getBoundingClientRect(), total = r.height - innerHeight, p = clamp(-r.top / total, 0, 1);
    track.style.transform = `translate3d(${-p * (track.scrollWidth - innerWidth + parseFloat(getComputedStyle(track).paddingLeft))}px,0,0)`;
    const bar = $("#rulerBar"); if (bar) bar.style.width = p * 100 + "%";
    const passed = Math.floor(p * 15.2);
    $$("i", ruler).forEach((m, i) => m.classList.toggle("on", i < passed));
    tourWidths();
  }
  track.addEventListener("scroll", tourWidths, { passive: true });

  /* ================= EVENING SCRUBBER ================= */
  const stImgs = $$(".stage__img"), sTrack = $("#scrubTrack"), knob = $("#scrubKnob");
  let et = 16, eAuto = true, eVisible = false, eAct = -1;
  function setTime(t) {
    et = clamp(t, 16, 20); const p = (et - 16) / 4;
    knob.style.left = p * 100 + "%"; $("#scrubFill").style.width = p * 100 + "%"; knob.setAttribute("aria-valuenow", et.toFixed(2));
    const h = Math.floor(et), m = Math.floor((et - h) * 60), mm = String(m).padStart(2, "0");
    const lbl = lang === "en" ? `${h - 12}:${mm}` : `${h}:${mm}`;
    $("#scrubLbl").textContent = lbl; $("#stTime").textContent = lang === "en" ? `${lbl} PM` : lbl;
    const act = et < 18 ? 0 : et < 19.5 ? 1 : 2;
    if (act !== eAct) { eAct = act; stImgs.forEach((im, i) => im.classList.toggle("on", i === act)); $("#stTitle").textContent = D().acts[act][0]; $("#stText").textContent = D().acts[act][1]; }
  }
  const tFromEv = e => { const r = sTrack.getBoundingClientRect(); setTime(16 + clamp((e.clientX - r.left) / r.width, 0, 1) * 4); };
  sTrack.addEventListener("pointerdown", e => { eAuto = false; sTrack.setPointerCapture(e.pointerId); tFromEv(e); const mv = ev => tFromEv(ev), up = () => { sTrack.removeEventListener("pointermove", mv); sTrack.removeEventListener("pointerup", up); }; sTrack.addEventListener("pointermove", mv); sTrack.addEventListener("pointerup", up); });
  knob.addEventListener("keydown", e => { if (e.key === "ArrowRight") { eAuto = false; setTime(et + .25); e.preventDefault(); } if (e.key === "ArrowLeft") { eAuto = false; setTime(et - .25); e.preventDefault(); } });
  visible($("#stage"), v => (eVisible = v), .3);
  setTime(16);

  /* ================= VOICES DECK ================= */
  const deck = $("#deck");
  const items = [];
  VIDEOS.forEach((v, i) => { items.push({ type: "v", v }); if (QUOTES[i]) items.push({ type: "q", q: QUOTES[i] }); });
  let order = items.map((_, i) => i);
  function renderDeck() {
    deck.innerHTML = items.map((it, i) => it.type === "v"
      ? `<div class="dcard" data-i="${i}"><img src="images/yt-${it.v[0]}.jpg" alt="" draggable="false"><button class="dcard__play" data-play="${it.v[0]}"><i>▶</i>${D().play}</button><div class="dcard__meta"><b>${it.v[1]}</b><span>${it.v[2]}</span></div></div>`
      : `<div class="dcard dcard--quote" data-i="${i}"><span class="q">“</span><blockquote>${it.q[0]}</blockquote><footer><b>${it.q[1]}</b><span>${it.q[2]}</span></footer></div>`).join("");
    $$(".dcard", deck).forEach(bindCard);
    layoutDeck(true);
  }
  function layoutDeck(instant) {
    order.forEach((idx, k) => {
      const c = $(`.dcard[data-i="${idx}"]`, deck); if (!c) return;
      if (instant) c.style.transition = "none";
      c.style.zIndex = items.length - k;
      c.style.transform = k > 3 ? `translateY(60px) scale(.8)` : `translateY(${k * 16}px) scale(${1 - k * .05}) rotate(${k ? (k % 2 ? 3 : -3) : 0}deg)`;
      c.style.opacity = k > 3 ? 0 : 1;
      if (instant) { void c.offsetWidth; c.style.transition = ""; }
      if (k !== 0) stopVideo(c);
    });
    $("#dCount").textContent = `${String(order[0] + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
  }
  function stopVideo(c) { const f = $("iframe", c); if (f) { f.remove(); $(".dcard__close", c)?.remove(); } }
  function fling(dir) {
    const top = $(`.dcard[data-i="${order[0]}"]`, deck); stopVideo(top);
    top.style.transform = `translate(${dir * innerWidth * .8}px, -40px) rotate(${dir * 30}deg)`; top.style.opacity = 0;
    setTimeout(() => { order.push(order.shift()); layoutDeck(false); }, 380);
  }
  function back() { order.unshift(order.pop()); layoutDeck(false); }
  function bindCard(c) {
    let down = false, x0, y0, dx = 0, dy = 0;
    c.addEventListener("pointerdown", e => { if (+c.dataset.i !== order[0] || e.target.closest("iframe, .dcard__close")) return; down = true; x0 = e.clientX; y0 = e.clientY; dx = dy = 0; c.setPointerCapture(e.pointerId); c.classList.add("drag"); });
    c.addEventListener("pointermove", e => { if (!down) return; dx = e.clientX - x0; dy = e.clientY - y0; c.style.transform = `translate(${dx}px, ${dy * .4}px) rotate(${dx * .06}deg)`; });
    const up = e => {
      if (!down) return; down = false; c.classList.remove("drag");
      if (Math.abs(dx) > 110) { fling(Math.sign(dx)); return; }
      layoutDeck(false);
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) { const pb = e.target.closest("[data-play]") || (items[+c.dataset.i].type === "v" ? $("[data-play]", c) : null); if (pb) play(c, pb.dataset.play); }
    };
    c.addEventListener("pointerup", up); c.addEventListener("pointercancel", up);
  }
  function play(c, id) {
    if ($("iframe", c)) return;
    c.insertAdjacentHTML("beforeend", `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="Video testimonial" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe><button class="dcard__close" aria-label="Close video">✕</button>`);
    $(".dcard__close", c).addEventListener("click", ev => { ev.stopPropagation(); stopVideo(c); });
  }
  $("#dNext").addEventListener("click", () => fling(1));
  $("#dPrev").addEventListener("click", back);
  deck.setAttribute("tabindex", "0");
  deck.addEventListener("keydown", e => { if (e.key === "ArrowRight") fling(1); if (e.key === "ArrowLeft") back(); if (e.key === "Enter") { const c = $(`.dcard[data-i="${order[0]}"]`, deck), it = items[order[0]]; if (it.type === "v") play(c, it.v[0]); } });

  /* ================= PRICE EQUALIZER ================= */
  const bars = $("#eqBars"), cityGrid = $("#eqCities"), odo = $("#odo");
  bars.innerHTML = CITIES.map((c, k) => `<i data-c="${c.short.slice(0, 3).toUpperCase()}" style="--k:${k}"></i>`).join("");
  function renderCities() {
    cityGrid.innerHTML = CITIES.map(c => `<button class="ct" data-id="${c.id}" aria-pressed="${sel.has(c.id)}"><em></em><b>${c.short}</b><small>${c.p} · ${dfmt(c.d, { month: "short", day: "numeric" })}</small></button>`).join("");
    $$(".ct", cityGrid).forEach(b => b.addEventListener("click", () => { sel.has(b.dataset.id) ? sel.delete(b.dataset.id) : sel.add(b.dataset.id); syncSel(); }));
  }
  $$("[data-pick]").forEach(b => b.addEventListener("click", () => { const k = b.dataset.pick; if (k === "none") sel.clear(); else CITIES.filter(c => k === "all" || c.s === k).forEach(c => sel.add(c.id)); syncSel(); }));
  $$('input[name="pkg"]').forEach(r => r.addEventListener("change", () => { if (r.checked && r.value === "pr") toast(D().waitlist); }));
  $("#hst").addEventListener("change", calc);
  let C = {};
  function setOdo(str) {
    odo.setAttribute("aria-label", str);
    const chars = [...str];
    if (odo.dataset.len !== String(chars.length) || odo.dataset.mask !== chars.map(ch => (/\d/.test(ch) ? "d" : ch)).join("")) {
      odo.innerHTML = chars.map(ch => /\d/.test(ch) ? `<span class="odo__d"><span class="odo__s">${"0123456789".split("").map(n => `<span>${n}</span>`).join("")}</span></span>` : `<span class="odo__c">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
      odo.dataset.len = chars.length; odo.dataset.mask = chars.map(ch => (/\d/.test(ch) ? "d" : ch)).join("");
      void odo.offsetWidth;
    }
    let k = 0; $$(".odo__d, .odo__c", odo).forEach((el, i) => { const ch = chars[i]; if (el.classList.contains("odo__d")) $(".odo__s", el).style.transform = `translateY(${-(+ch)}em)`; k++; });
  }
  function calc() {
    const list = CITIES.filter(c => sel.has(c.id)), n = list.length, pct = n >= 12 ? .2 : n >= 9 ? .15 : n >= 4 ? .1 : 0;
    const base = n * 1395, disc = base * pct, sub = base - disc, tax = $("#hst").checked ? sub * .13 : 0, total = sub + tax;
    C = { list, n, pct, base, disc, sub, tax, total, dep: total / 2 };
    setOdo(money(total));
    $("#sN").textContent = n; $("#sPct").textContent = pct ? `−${Math.round(pct * 100)}%` : "—"; $("#sPer").textContent = n ? money(sub / n) : "—"; $("#sSave").textContent = money(disc); $("#sDep").textContent = money(total / 2);
    $("#regOpen").disabled = !n;
    const tier = pct === .2 ? "t3" : pct === .15 ? "t2" : pct === .1 ? "t1" : "";
    $$("i", bars).forEach((b, i) => { const on = sel.has(CITIES[i].id); b.className = on ? `on ${tier}` : ""; b.style.setProperty("--h", on ? `${100 - pct * 250}%` : "6%"); });
  }
  function syncSel() {
    $$(".ct", cityGrid).forEach(b => b.setAttribute("aria-pressed", sel.has(b.dataset.id)));
    $$("[data-add]", track).forEach(b => { const on = sel.has(b.dataset.add); b.classList.toggle("on", on); b.textContent = on ? D().added : D().add; });
    calc();
  }

  /* registration drawer */
  const drawer = $("#drawer"), drForm = $("#drForm");
  let step = 1, lastFocus;
  $("#regOpen").addEventListener("click", () => {
    if (!C.n) { toast(D().pick); return; }
    lastFocus = document.activeElement; step = 1; drRender(); drawer.hidden = false; lenis && lenis.stop(); setTimeout(() => $("#rCo").focus(), 80);
  });
  const due = () => { let v = drForm.amt.value === "full" ? C.total : C.dep; if (drForm.pm.value === "cc") v *= 1.03; return v; };
  function drRender() {
    $$(".dr__p", drForm).forEach(p => p.classList.toggle("on", +p.dataset.step === step));
    $$("#drSteps > span").forEach((s, i) => { s.classList.toggle("on", i + 1 === step); s.classList.toggle("done", i + 1 < step); });
    $("#drFoot").style.display = step === 3 ? "none" : "";
    $("#drBack").style.visibility = step === 1 ? "hidden" : "visible";
    $("#drNextTxt").textContent = step === 2 ? D().submit : (lang === "en" ? "Continue" : T[lang]["r.next"]);
    $("#drSum").innerHTML = `<div><span>${D().sumN}</span><b>${C.n} — ${C.list.map(c => c.short).join(", ")}</b></div><div><span>${D().sumT}</span><b>${money(C.total)} CAD</b></div>`;
    $("#rDue").textContent = money(due()) + " " + drForm.cur.value + (drForm.cur.value === "USD" ? "*" : "");
  }
  drForm.addEventListener("change", drRender);
  $("#drNext").addEventListener("click", () => {
    if (step === 1) { let ok = true; $$('[data-step="1"] [required]', drForm).forEach(i => { const bad = !i.value.trim() || (i.type === "email" && !emailOK(i.value)); i.closest(".f").classList.toggle("err", bad); if (bad && ok) { i.focus(); ok = false; } }); if (ok) { step = 2; drRender(); } return; }
    if (step === 2) { const t = $("#rTerms"); t.closest(".chk").classList.toggle("err", !t.checked); if (!t.checked) return; step = 3; drRender(); confetti(); }
  });
  $("#drBack").addEventListener("click", () => { if (step > 1) { step--; drRender(); } });
  const closeDrawer = () => { drawer.hidden = true; lenis && lenis.start(); lastFocus && lastFocus.focus(); };
  $$("[data-close]", drawer).forEach(x => x.addEventListener("click", closeDrawer));

  /* ================= ADVISORS ================= */
  function renderAdv() {
    const c = nextExpo(), open = new Date(c.start - 35 * 864e5), now = new Date(), days = Math.max(0, Math.ceil((open - now) / 864e5));
    const ds = new Intl.DateTimeFormat(loc(), { month: "long", day: "numeric", year: "numeric" }).format(open);
    $("#advDays").textContent = now < open ? String(days).padStart(3, "0") : "✓";
    $("#advTxt").textContent = now < open ? D().opens(`${c.short}, ${c.p}`, ds) : D().openNow(`${c.short}, ${c.p}`);
  }
  $("#notify").addEventListener("submit", e => { e.preventDefault(); const v = $("#nEmail").value.trim(); if (!emailOK(v)) { toast(D().invalid); return; } $("#nEmail").value = ""; toast(D().notify); });
  $("#nl").addEventListener("submit", e => { e.preventDefault(); const v = $("#nlEmail").value.trim(), ok = emailOK(v); $("#nlMsg").textContent = ok ? D().thanks : D().invalid; $("#nlMsg").style.color = ok ? "" : "#ff6b72"; if (ok) $("#nlEmail").value = ""; });

  // scratch card
  const sc = $("#scratchCard"), scv = $("#scratchCv"), sctx = scv.getContext("2d");
  let scratched = false, scDown = false, scLast = null, scCount = 0;
  function paintScratch() {
    const w = sc.clientWidth, h = sc.clientHeight, d = Math.min(2, devicePixelRatio || 1);
    scv.width = w * d; scv.height = h * d; sctx.setTransform(d, 0, 0, d, 0, 0);
    sctx.globalCompositeOperation = "source-over";
    const g = sctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#c9c7c1"); g.addColorStop(.5, "#efeeea"); g.addColorStop(1, "#b5b2ab");
    sctx.fillStyle = g; sctx.fillRect(0, 0, w, h);
    sctx.fillStyle = "rgba(15,17,21,.08)";
    for (let y = 0; y < h; y += 26) for (let x = (y / 26) % 2 ? 0 : 13; x < w; x += 26) sctx.fillRect(x, y, 3, 3);
    sctx.fillStyle = "#0f1115"; sctx.textAlign = "center";
    sctx.font = `900 ${Math.round(w * .11)}px Archivo, sans-serif`; sctx.fillText("SCRATCH", w / 2, h / 2);
    sctx.font = `400 ${Math.round(w * .028)}px "Fragment Mono", monospace`; sctx.fillText("GRANITE TRAVEL TRADE EXPOS · 2027", w / 2, h / 2 + w * .06);
    sc.classList.remove("revealed"); scratched = false; $("#scratchPct").textContent = T[lang]?.["a.scr"] || "Scratch the card ↑";
  }
  function scratchAt(e) {
    const r = scv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    sctx.globalCompositeOperation = "destination-out"; sctx.lineCap = "round"; sctx.lineWidth = Math.max(36, r.width * .09);
    sctx.beginPath(); if (scLast) sctx.moveTo(scLast[0], scLast[1]); else sctx.moveTo(x - .1, y); sctx.lineTo(x, y); sctx.stroke(); scLast = [x, y];
    if (++scCount % 8 === 0) checkScratch();
  }
  function checkScratch() {
    if (scratched) return;
    const data = sctx.getImageData(0, 0, scv.width, scv.height).data; let clear = 0, tot = 0;
    for (let i = 3; i < data.length; i += 4 * 40) { tot++; if (data[i] < 40) clear++; }
    const p = Math.round(clear / tot * 100); $("#scratchPct").textContent = D().scrD(p);
    if (p > 45) { scratched = true; sc.classList.add("revealed"); $("#scratchPct").textContent = D().won; confetti(60); }
  }
  sc.addEventListener("pointerdown", e => { e.preventDefault(); scDown = true; scLast = null; sc.setPointerCapture(e.pointerId); scratchAt(e); });
  sc.addEventListener("pointermove", e => { if (scDown || (fine && e.pointerType === "mouse")) scratchAt(e); });
  sc.addEventListener("pointerup", () => { scDown = false; scLast = null; checkScratch(); });
  sc.addEventListener("pointerleave", () => { scLast = null; });
  $("#scratchReset").addEventListener("click", paintScratch);

  /* ================= MAGNET FIELD ================= */
  const LOGOS = ["Sandals.jpg", "RIU_Hotels.jpg", "MSC-Cruises.jpg", "iberostar.jpg", "WestJet-Vacations.jpg", "Jamaica.jpg", "Barcelo-Hotel-Group.jpg", "Celebrity-Cruises.jpg", "Hilton.jpg", "Palladium-hotel-group.jpg", "Collette.jpg", "Bahamas.jpg", "Barbados.jpg", "Cayman-Islands.jpg", "Dubai.jpg", "Tourism-Australia.jpg", "Trafalgar-Tours.jpg", "Globus.jpg", "Holland-America.jpg", "Rocky-Mountaineer.jpg", "Visit-Orlando.jpg", "Catalonia.jpg", "sunwing.jpg", "Transat.jpg", "Couples-Resorts.jpg", "Oasis-Hotels-Resorts.jpg", "Sirenis.jpg", "The-Palace-Company.jpg", "Karisma-Hotels-and-Resorts.jpg", "Uniworld-Boutique-River-Cruises.jpg", "Quark_Expeditions.jpg", "Coconut-Bay-Beach-Resort.jpg"];
  const field = $("#field");
  field.innerHTML = LOGOS.map(f => `<div class="ftile"><img src="images/partners/${f}" alt="${f.replace(/\.\w+$/, "").replace(/[-_]/g, " ")}" loading="lazy"></div>`).join("");
  const tiles = $$(".ftile", field).map(t => ({ el: $("img", t), t, x: 0, y: 0, s: 1 }));
  let fp = null, fVisible = false;
  field.addEventListener("pointermove", e => { const r = field.getBoundingClientRect(); fp = [e.clientX - r.left, e.clientY - r.top]; });
  field.addEventListener("pointerdown", e => { const r = field.getBoundingClientRect(); fp = [e.clientX - r.left, e.clientY - r.top]; });
  field.addEventListener("pointerleave", () => (fp = null));
  visible(field, v => (fVisible = v));
  function updField() {
    if (!fVisible) return;
    const RR = Math.max(160, field.clientWidth * .16);
    tiles.forEach(o => {
      let tx = 0, ty = 0, ts = 1;
      if (fp) { const cxT = o.t.offsetLeft + o.t.offsetWidth / 2, cyT = o.t.offsetTop + o.t.offsetHeight / 2, dx = cxT - fp[0], dy = cyT - fp[1], d = Math.hypot(dx, dy); if (d < RR) { const f = Math.pow(1 - d / RR, 2); tx = (dx / (d || 1)) * f * 54; ty = (dy / (d || 1)) * f * 54; ts = 1 + f * .25; } }
      o.x = lerp(o.x, tx, .14); o.y = lerp(o.y, ty, .14); o.s = lerp(o.s, ts, .14);
      o.el.style.transform = `translate(${o.x.toFixed(1)}px, ${o.y.toFixed(1)}px) scale(${o.s.toFixed(3)})`;
    });
  }

  /* ================= INFINITE CANVAS ================= */
  const PHOTOS = [["DSC_4665.jpg", "Spring 2025 · Halifax"], ["DSC_1908.jpg", "Fall 2025 · Ottawa"], ["DSC_4933.jpg", "Fall 2025 · Hamilton"], ["CAA-event.jpg", "CAA National Conference"], ["DSC_5482.jpg", "Fall 2025 · Hamilton"], ["st-kitts-event.jpg", "St. Kitts Tourism"], ["travelpulse-rca-2024.jpg", "TravelPulse Readers' Choice Awards"], ["virtual-show.jpg", "Virtual Travel & Leisure Show"]];
  const RECTS = [[0, 0, 380, 260], [400, 0, 420, 320], [840, 0, 360, 240], [0, 280, 380, 300], [400, 340, 300, 240], [720, 260, 480, 320], [0, 600, 560, 300], [580, 600, 620, 300]];
  const canvasEl = $("#canvas"), plane = $("#plane");
  let CW = 1220, CH = 920, cs = 1, ox = 0, oy = 0, cvx = -.35, cvy = -.18, cDrag = false, cMoved = 0, cVisible = false;
  function buildCanvas() {
    cs = compact() ? .62 : innerWidth < 1200 ? .85 : 1;
    let html = "";
    for (let gy = -1; gy <= 1; gy++) for (let gx = -1; gx <= 1; gx++) RECTS.forEach((r, i) => {
      const [f, cap] = PHOTOS[(i + (gx + gy + 3) * 3) % PHOTOS.length];
      html += `<button class="ctile" data-img="${f}" data-cap="${cap}" style="left:${(r[0] + (gx + 1) * CW) * cs}px;top:${(r[1] + (gy + 1) * CH) * cs}px;width:${r[2] * cs}px;height:${r[3] * cs}px"><img src="images/${f}" alt="${cap}" loading="lazy" draggable="false"><span>${cap}</span></button>`;
    });
    plane.innerHTML = html;
  }
  canvasEl.addEventListener("pointerdown", e => { cDrag = true; cMoved = 0; canvasEl.classList.add("drag"); canvasEl.setPointerCapture(e.pointerId); let lx = e.clientX, ly = e.clientY;
    const mv = ev => { const dx = ev.clientX - lx, dy = ev.clientY - ly; lx = ev.clientX; ly = ev.clientY; cMoved += Math.abs(dx) + Math.abs(dy); ox += dx; oy += dy; cvx = dx; cvy = dy; };
    const up = ev => { cDrag = false; canvasEl.classList.remove("drag"); canvasEl.removeEventListener("pointermove", mv); canvasEl.removeEventListener("pointerup", up);
      if (cMoved < 6) { const t = document.elementFromPoint(ev.clientX, ev.clientY)?.closest(".ctile"); if (t) openLb(t.dataset.img, t.dataset.cap); } };
    canvasEl.addEventListener("pointermove", mv); canvasEl.addEventListener("pointerup", up);
  });
  visible(canvasEl, v => (cVisible = v));
  function updCanvas() {
    if (!cVisible) return;
    if (!cDrag) { cvx = lerp(cvx, -.35, .03); cvy = lerp(cvy, -.18, .03); if (!reduced) { ox += cvx; oy += cvy; } }
    const W = CW * cs, H = CH * cs, x = ((ox % W) + W) % W - W, y = ((oy % H) + H) % H - H;
    plane.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }
  const lb = $("#lb");
  function openLb(f, cap) { lastFocus = document.activeElement; $("#lbImg").src = `images/${f}`; $("#lbImg").alt = cap; $("#lbCap").textContent = cap; lb.hidden = false; lenis && lenis.stop(); $(".lb__x").focus(); }
  const closeLb = () => { lb.hidden = true; lenis && lenis.start(); lastFocus && lastFocus.focus(); };
  lb.addEventListener("click", e => { if (e.target === lb || e.target.closest("[data-close]")) closeLb(); });
  document.addEventListener("keydown", e => { if (e.key !== "Escape") return; if (!lb.hidden) closeLb(); if (!drawer.hidden) closeDrawer(); closeMenu(); });

  /* ================= PRESS / TEAM ================= */
  const pf = $("#pressFloat"), pImg = $("#pressImg");
  if (fine) {
    let x = 0, y = 0, mx = 0, my = 0;
    $$("#pressList a").forEach(a => { a.addEventListener("pointerenter", () => { pImg.src = a.dataset.img; pf.classList.add("on"); }); a.addEventListener("pointerleave", () => pf.classList.remove("on")); });
    addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function l() { x = lerp(x, mx, .16); y = lerp(y, my, .16); if (pf.classList.contains("on")) { pf.style.left = x + "px"; pf.style.top = y + "px"; } requestAnimationFrame(l); })();
  }
  $$(".team__list li").forEach(li => $("button", li).addEventListener("click", () => { const o = !li.classList.contains("open"); $$(".team__list li").forEach(x => { x.classList.remove("open"); $("button", x).setAttribute("aria-expanded", "false"); }); li.classList.toggle("open", o); $("button", li).setAttribute("aria-expanded", o); }));

  /* ================= WORDMARK ================= */
  const word = $("#word");
  word.innerHTML = "GRANITE".split("").map(ch => `<span aria-hidden="true">${ch}</span>`).join("");
  const letters = $$("span", word);
  let wp = null, wVisible = false;
  const finalSec = $("#contact");
  finalSec.addEventListener("pointermove", e => (wp = e.clientX));
  finalSec.addEventListener("pointerleave", () => (wp = null));
  visible(word, v => (wVisible = v));
  function updWord(now) {
    if (!wVisible) return;
    letters.forEach((l, i) => {
      let w;
      if (wp !== null && fine) { const r = l.getBoundingClientRect(), d = (r.left + r.width / 2 - wp) / 160; w = 62 + 63 * Math.exp(-d * d); }
      else w = reduced ? 90 : 76 + 40 * (Math.sin(now / 700 + i * .8) + 1) / 2;
      l.style.setProperty("--w", w.toFixed(1));
    });
  }

  /* ================= CURSOR / MAGNET ================= */
  if (fine && !reduced) {
    const cur = $("#cursor"), ct = $("#cursorTxt"); let mx = 0, my = 0, x = 0, y = 0;
    addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; cur.classList.add("on"); }, { passive: true });
    (function l() { x = lerp(x, mx, .22); y = lerp(y, my, .22); cur.style.transform = `translate3d(${x}px,${y}px,0)`; requestAnimationFrame(l); })();
    document.addEventListener("pointerover", e => {
      const l = e.target.closest("[data-cursor]");
      if (l && !e.target.closest("a, button:not(.ctile)")) { cur.className = "cursor on lab"; ct.textContent = l.dataset.cursor; return; }
      cur.className = "cursor on" + (e.target.closest("a, button, input, label, select") ? " link" : "");
    });
    $$(".magnet").forEach(el => { el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`; }); el.addEventListener("pointerleave", () => (el.style.transform = "")); });
  }

  /* ================= LOOPS ================= */
  let lastY = 0;
  function onScroll() {
    const y = scrollY, vh = innerHeight, max = document.documentElement.scrollHeight - vh;
    nav.classList.toggle("hide", y > lastY && y > vh * .8 && !menu.classList.contains("open")); lastY = y;
    dock.classList.toggle("on", y > vh * .8 && y < max - 300);
    updKinetic(); updTour();
    let ci = -1, best = -Infinity;
    navS.forEach((s, i) => { if (!s) return; const r = s.getBoundingClientRect(); if (r.top < vh * .4 && r.bottom > vh * .3 && r.top > best) { best = r.top; ci = i; } });
    navA.forEach((a, i) => a.classList.toggle("cur", i === ci));
  }
  lenis ? lenis.on("scroll", onScroll) : addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", () => { buildCanvas(); onScroll(); paintScratch(); });
  (function frame(now) {
    drawGlobe(now); updField(); updCanvas(); updWord(now);
    if (eAuto && eVisible && !reduced) { let t = et + .006; if (t > 20) t = 16; setTime(t); }
    requestAnimationFrame(frame);
  })(performance.now());

  /* ================= INIT ================= */
  document.addEventListener("lang", () => { buildTour(); renderCities(); syncSel(); renderDeck(); renderAdv(); eAct = -1; setTime(et); if (!drawer.hidden) drRender(); if (!scratched) $("#scratchPct").textContent = T[lang]?.["a.scr"] || "Scratch the card ↑"; onScroll(); });
  buildCanvas(); renderCities(); buildTour(); renderDeck(); calc(); renderAdv();
  let saved = "en"; try { saved = localStorage.getItem("gtte3-lang") || "en"; } catch (e) {}
  setLang(saved);
  addEventListener("load", () => { gSize(); sizeTour(); paintScratch(); onScroll(); });
  requestAnimationFrame(() => { paintScratch(); onScroll(); });
  if (document.fonts) document.fonts.ready.then(() => { sizeTour(); paintScratch(); onScroll(); });
})();
