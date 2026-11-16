/* =========================================================
   Granite Travel Trade Expos — homepage interactions
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------------- data ---------------- */
  const CITIES = [
    { id: "lon", n: "London", p: "ON", d: "2027-04-05", tz: "-04:00", s: "spring", r: "ontario", lon: -81.25, lat: 42.98, lab: [0, 20, "middle"] },
    { id: "kw", n: "Kitchener-Waterloo", short: "Kitchener", p: "ON", d: "2027-04-06", tz: "-04:00", s: "spring", r: "ontario", lon: -80.49, lat: 43.45, lab: [-8, -10, "end"] },
    { id: "bar", n: "Barrie", p: "ON", d: "2027-04-07", tz: "-04:00", s: "spring", r: "ontario", lon: -79.69, lat: 44.39, lab: [0, -12, "middle"] },
    { id: "osh", n: "Oshawa", p: "ON", d: "2027-04-08", tz: "-04:00", s: "spring", r: "ontario", lon: -78.86, lat: 43.9, lab: [8, -10, "start"] },
    { id: "stj", n: "St. John's", p: "NL", d: "2027-05-31", tz: "-02:30", s: "spring", r: "atlantic", lon: -52.71, lat: 47.56, lab: [0, -14, "end"] },
    { id: "hal", n: "Halifax", p: "NS", d: "2027-06-02", tz: "-03:00", s: "spring", r: "atlantic", lon: -63.57, lat: 44.65, lab: [12, 4, "start"] },
    { id: "mon", n: "Moncton", p: "NB", d: "2027-06-03", tz: "-03:00", s: "spring", r: "atlantic", lon: -64.78, lat: 46.09, lab: [0, -14, "middle"] },
    { id: "win", n: "Winnipeg", p: "MB", d: "2027-10-05", tz: "-05:00", s: "fall", r: "west", lon: -97.14, lat: 49.9, lab: [0, -14, "middle"] },
    { id: "rd", n: "Red Deer", p: "AB", d: "2027-10-06", tz: "-06:00", s: "fall", r: "west", lon: -113.81, lat: 52.27, lab: [0, -14, "middle"] },
    { id: "kel", n: "Kelowna", p: "BC", d: "2027-10-07", tz: "-07:00", s: "fall", r: "west", lon: -119.5, lat: 49.89, lab: [0, 22, "middle"] },
    { id: "ott", n: "Ottawa", p: "ON", d: "2027-11-01", tz: "-04:00", s: "fall", r: "ontario", lon: -75.7, lat: 45.42, lab: [-12, 4, "end"] },
    { id: "kin", n: "Kingston", p: "ON", d: "2027-11-02", tz: "-04:00", s: "fall", r: "ontario", lon: -76.48, lat: 44.23, lab: [0, 22, "middle"] },
    { id: "mar", n: "Markham", p: "ON", d: "2027-11-03", tz: "-04:00", s: "fall", r: "ontario", lon: -79.34, lat: 43.86, lab: [8, 20, "start"] },
    { id: "ham", n: "Hamilton", p: "ON", d: "2027-11-04", tz: "-04:00", s: "fall", r: "ontario", lon: -79.87, lat: 43.26, lab: [0, 22, "middle"] },
  ];
  CITIES.forEach(c => { c.start = new Date(`${c.d}T16:00:00${c.tz}`); c.end = new Date(`${c.d}T20:00:00${c.tz}`); });
  const byId = Object.fromEntries(CITIES.map(c => [c.id, c]));

  const VIDEO_TITLES = {
    zp0zezI4tuI: "Jose Cervera, BlueBay Hotels & Resorts",
    xg_gZBNSCDA: "Nicole Perez, Princess Hotels & Resorts",
    KSQx12RlJkE: "Herbert Byaruhanga, Bird Uganda Safaris",
    WwtXEpUUTTE: "Luis Chaverri, Amstar DMC",
    PEZIhQZDFyU: "Gavin Jimenez, Sirenis Hotels & Resorts",
  };

  /* ---------------- i18n ---------------- */
  const LOCALES = { en: "en-CA", es: "es-MX", fr: "fr-CA" };
  const I18N = {
    es: {
      "nav.tour": "Gira 2027", "nav.exhibit": "Expositores", "nav.agents": "Agentes de viaje", "nav.stories": "Testimonios", "nav.gallery": "Galería", "nav.news": "Noticias", "nav.contact": "Contacto",
      "cta.exhibit": "Exponer en 2027", "cta.advisor": "Soy agente de viajes", "cta.agent": "Agentes",
      "hero.eyebrow": "Primavera y otoño 2027 · 14 ciudades canadienses",
      "hero.title": '<span class="ln">El comercio turístico de Canadá,</span><span class="ln"><em>cara a cara</em></span>',
      "hero.lead": "Expos boutique que llevan destinos, resorts, navieras y operadores turísticos de todo el mundo directamente a los agentes de viaje más destacados de los mercados secundarios más influyentes de Canadá.",
      "hero.reel": "Escucha a los expositores", "hero.next": "Próxima expo",
      "t.days": "días", "t.hrs": "hrs", "t.min": "min", "t.sec": "seg",
      "stats.cities": "Ciudades seleccionadas en 2027", "stats.agents": "Agentes recibidos en una sola serie", "stats.exhibitors": "Expositores globales en 2026", "stats.hours": "De tiempo cara a cara en cada expo",
      "why.eyebrow": "Boutique por diseño · Potente por impacto",
      "why.manifesto": "No somos la feria de turismo más grande del país — y es *intencional.* Cuando los proveedores llegan a la comunidad del agente, se nota. Se agradece. Y se *convierte.*",
      "why.v1": "Conversaciones significativas, cara a cara", "why.v1p": "Tiempo individual y sin prisas en tu mesa — no un discurso de tres minutos en un pasillo con miles de personas.",
      "why.v2": "Mejor formación de producto", "why.v2p": "Las presentaciones estructuradas ponen tu historia frente a una sala sentada y atenta.",
      "why.v3": "Relaciones más profundas", "why.v3p": "Las cenas de networking convierten primeras reuniones en socios de venta a largo plazo.",
      "why.v4": "Impulso real de ventas", "why.v4p": "Los agentes salen con conocimiento de producto que pueden reservar a la mañana siguiente.",
      "band.title": '<span class="ln">Creado para conversaciones reales.</span><span class="ln"><em>Diseñado para negocios reales.</em></span>',
      "tour.eyebrow": "Marca tu calendario", "tour.title": '<span class="ln">La gira 2027.</span><span class="ln"><em>De costa a costa.</em></span>',
      "tour.lead": "Catorce mercados seleccionados estratégicamente donde los agentes venden activamente — y donde los proveedores rara vez tienen la sala para ellos solos.",
      "tour.all": "Las 14", "tour.spring": "Primavera 2027", "tour.fall": "Otoño 2027", "tour.book": "Reservar ciudad", "tour.cal": "Añadir al calendario",
      "fmt.eyebrow": "Una velada, tres actos", "fmt.title": '<span class="ln">Así se vive</span><span class="ln"><em>una expo.</em></span>',
      "fmt.lead": "Presentaciones estructuradas, una feria dinámica y una cena selecta — todo en un entorno de producción profesional y de alta energía.",
      "fmt.a1": "Presentaciones de proveedores", "fmt.a1p": "Sesiones moderadas con video — cada proveedor tiene la sala para contar su historia.",
      "fmt.a2": "Feria de proveedores", "fmt.a2p": "Mesas vestidas, señalización impresa, folletos y promociones — conversaciones sin prisa que convierten.",
      "fmt.a3": "Cena ligera y sorteo de premios", "fmt.a3p": "Una cena de networking y sorteos que envían a cada agente a casa feliz — y leal.",
      "st.eyebrow": "Clips desde la feria", "st.title": '<span class="ln">En sus</span><span class="ln"><em>propias palabras.</em></span>',
      "st.lead": "Expositores de resorts, DMC y safaris nos cuentan por qué siempre regresan. Arrastra para explorar — toca para reproducir.",
      "ex.eyebrow": "Registro de expositores 2027", "ex.title": '<span class="ln">Arma tu gira.</span><span class="ln"><em>Mira tu precio en vivo.</em></span>',
      "ex.lead": "Elige tus ciudades y mira cómo se aplican al instante los descuentos multi-expo. Reserva 12 o más y expón desde solo $1,116 CAD por expo.",
      "ex.s1": "Elige tu paquete", "ex.p1": "Solo exhibición", "ex.p1n": "Mesa vestida, señalización, cena y logo en el sitio web", "ex.sold": "Agotado · Lista de espera",
      "ex.p2": "Presentación y exhibición", "ex.p2n": "Todo lo anterior más un espacio de presentación",
      "ex.s2": "Selecciona tus expos", "ex.allcities": "Todas", "ex.clear": "Borrar", "ex.s3": "Tu nivel de ahorro", "ex.expos": "expos",
      "ex.summary": "Tu gira 2027", "ex.selected": "expos seleccionadas", "ex.base": "Base", "ex.disc": "Descuento multi-expo", "ex.sub": "Subtotal",
      "ex.hst": "13% HST (facturación en Canadá)", "ex.tax": "HST", "ex.total": "Total (CAD)", "ex.per": "Costo efectivo por expo", "ex.dep": "Depósito del 50% hoy",
      "ex.cta": "Continuar al registro", "ex.fine": "El 50% restante vence 90 días antes de cada serie. Patrocinios exclusivos por categoría disponibles a solicitud.",
      "ex.incl": "Cada espacio de exhibición incluye", "ex.i1": "Señalización impresa a color", "ex.i2": "Acceso directo a agentes locales comprometidos", "ex.i3": "Participación en la cena de networking", "ex.i4": "Logo destacado en el sitio web", "ex.i5": "Mesa vestida de 6–8 pies (según sede)",
      "ag.eyebrow": "Llamado a todos los agentes de viaje", "ag.title": '<span class="ln">Los mejores proveedores del mundo,</span><span class="ln"><em>en tu propia ciudad.</em></span>',
      "ag.lead": "Aprende de las marcas que vendes, conoce a sus líderes de ventas, disfruta la cena por nuestra cuenta — y quizás llévate un premio. La asistencia es gratuita para agentes.",
      "ag.p1": "Tarjeta Mastercard de regalo para los primeros 50 agentes en cada expo", "ag.p2": "Destinos, resorts, navieras y operadores turísticos", "ag.p3": "Cena, presentaciones y sorteos incluidos",
      "ag.window": "El registro de agentes abre 5 semanas antes de cada expo", "ag.ph": "tu@agencia.com", "ag.notify": "Avísame",
      "ag.back": "Para los primeros 50 agentes en llegar a cada expo 2027.", "ag.hint": "Arrastra o toca la tarjeta para girarla",
      "sp.eyebrow": "Patrocinadores principales 2026", "sp.s1": "Patrocinador hotelero", "sp.s2": "Patrocinador de tarjetas de regalo", "sp.s3": "Socio de experiencia ártica",
      "sp.cap": "Algunos de nuestros socios actuales y anteriores", "sp.cta": "Hay oportunidades de patrocinio integradas y personalizadas.", "sp.talk": "Habla con Bradley Dean",
      "ga.eyebrow": "Granite Productions", "ga.title": '<span class="ln">Cada evento,</span><span class="ln"><em>producido en casa.</em></span>',
      "ga.lead": "Galas, conferencias, lanzamientos y expos — con nuestro propio equipo de medios capturando cada momento para nuestros socios.", "ga.all": "Ver galerías completas",
      "nw.eyebrow": "En las noticias", "nw.title": '<span class="ln">La prensa del sector</span><span class="ln"><em>habla de nosotros.</em></span>', "nw.all": "Todos los comunicados", "nw.read": "Leer artículo",
      "tm.eyebrow": "Las personas detrás de las expos", "tm.r1": "Director General", "tm.r2": "Director Creativo", "tm.r3": "Maestro de ceremonias y embajador", "tm.r4": "Ventas", "tm.r5": "Consultor de eventos",
      "fn.title": '<span class="ln">Construye relaciones.</span><span class="ln"><em>Impulsa tu negocio.</em></span>',
      "fn.notify": "Entérate primero de los próximos eventos", "fn.email": "Correo electrónico", "fn.interest": "Me interesa", "fn.sup": "Ser proveedor", "fn.agt": "Asistir como agente", "fn.join": "Unirme a la lista",
      "ft.top": "Volver arriba",
      "rg.eyebrow": "Registro de expositores 2027", "rg.title": "Asegura tu lugar", "rg.s1": "Empresa", "rg.s2": "Pago", "rg.s3": "Revisión",
      "rg.company": "Nombre de la empresa *", "rg.contact": "Persona de contacto *", "rg.phone": "Teléfono *", "rg.city": "Ciudad *", "rg.country": "País *",
      "rg.cur": "Moneda", "rg.amt": "Monto del pago", "rg.deposit": "Depósito del 50%", "rg.full": "Monto total", "rg.method": "Método de pago", "rg.cc": "Tarjeta (+3%)", "rg.wire": "Transferencia int'l",
      "rg.note": "Los detalles de pago se envían por correo al recibir tu registro. No se cobra ninguna tarjeta en este formulario.",
      "rg.terms": "Acepto los términos de pago y la política de cancelación.", "rg.thanks": "Estás en la gira 2027.",
      "rg.thanksp": "Este es un prototipo de diseño — en el sitio real, tu registro y enlace de pago se enviarían al instante.", "rg.back": "Atrás", "rg.next": "Continuar",
      _: { regions: { ontario: "Ontario", atlantic: "Atlántico", west: "Oeste de Canadá" }, opensIn: (c, n, d) => `El registro para <b>${c}</b> abre en <b>${n} días</b> · ${d}`, openNow: c => `¡El registro para <b>${c}</b> está abierto!`, toGo: n => `Faltan ${n} días`, submit: "Enviar registro", thanksNl: "¡Gracias! Estás en la lista.", notify: "Te avisaremos cuando abra el registro.", invalid: "Ingresa un correo válido.", waitlist: "Añadido a la lista de espera de presentaciones — con precio de solo exhibición por ahora.", booked: c => `${c} añadida a tu gira`, review: { company: "Empresa", contact: "Contacto", email: "Correo", expos: "Expos", pkg: "Paquete", total: "Total", pay: "Pago hoy", method: "Método" }, inset: "SUR DE ONTARIO" },
    },
    fr: {
      "nav.tour": "Tournée 2027", "nav.exhibit": "Exposants", "nav.agents": "Conseillers en voyages", "nav.stories": "Témoignages", "nav.gallery": "Galerie", "nav.news": "Actualités", "nav.contact": "Contact",
      "cta.exhibit": "Exposer en 2027", "cta.advisor": "Je suis conseiller en voyages", "cta.agent": "Conseillers",
      "hero.eyebrow": "Printemps et automne 2027 · 14 villes canadiennes",
      "hero.title": '<span class="ln">L\'industrie du voyage,</span><span class="ln"><em>face à face</em></span>',
      "hero.lead": "Des salons-boutiques qui amènent destinations, complexes hôteliers, croisiéristes et voyagistes du monde entier directement aux conseillers en voyages les plus performants des marchés régionaux les plus influents au Canada.",
      "hero.reel": "Écoutez nos exposants", "hero.next": "Prochain salon",
      "t.days": "jours", "t.hrs": "h", "t.min": "min", "t.sec": "s",
      "stats.cities": "Villes choisies en 2027", "stats.agents": "Conseillers accueillis en une seule série", "stats.exhibitors": "Exposants internationaux en 2026", "stats.hours": "De rencontres en personne par salon",
      "why.eyebrow": "Boutique par nature · Puissant par impact",
      "why.manifesto": "Nous ne sommes pas le plus grand salon de l'industrie au pays — et c'est *voulu.* Quand les fournisseurs viennent dans la communauté des conseillers, ça se remarque. Ça s'apprécie. Et ça se *concrétise.*",
      "why.v1": "Des conversations en personne qui comptent", "why.v1p": "Du temps en tête-à-tête à votre table — pas un pitch de trois minutes dans une allée bondée.",
      "why.v2": "Une meilleure formation produit", "why.v2p": "Des présentations structurées devant une salle assise et attentive.",
      "why.v3": "Des relations plus profondes", "why.v3p": "Les soupers réseautage transforment une première rencontre en partenariat durable.",
      "why.v4": "Un vrai élan de ventes", "why.v4p": "Les conseillers repartent avec des connaissances qu'ils peuvent vendre dès le lendemain.",
      "band.title": '<span class="ln">Conçu pour de vraies conversations.</span><span class="ln"><em>Pensé pour de vraies affaires.</em></span>',
      "tour.eyebrow": "À vos agendas", "tour.title": '<span class="ln">La tournée 2027.</span><span class="ln"><em>D\'un océan à l\'autre.</em></span>',
      "tour.lead": "Quatorze marchés choisis stratégiquement, là où les conseillers vendent activement — et où les fournisseurs ont rarement la salle pour eux seuls.",
      "tour.all": "Les 14", "tour.spring": "Printemps 2027", "tour.fall": "Automne 2027", "tour.book": "Réserver cette ville", "tour.cal": "Ajouter au calendrier",
      "fmt.eyebrow": "Une soirée, trois actes", "fmt.title": '<span class="ln">Le déroulement</span><span class="ln"><em>d\'un salon.</em></span>',
      "fmt.lead": "Présentations structurées, salon dynamique et souper soigné — dans un environnement énergique et produit de façon professionnelle.",
      "fmt.a1": "Présentations des fournisseurs", "fmt.a1p": "Des séances animées avec vidéo — chaque fournisseur a la salle pour raconter son histoire.",
      "fmt.a2": "Salon des fournisseurs", "fmt.a2p": "Tables habillées, affiches imprimées, brochures et promos — des échanges sans hâte qui rapportent.",
      "fmt.a3": "Souper léger et tirages", "fmt.a3p": "Un souper réseautage et des prix qui renvoient chaque conseiller chez lui heureux — et fidèle.",
      "st.eyebrow": "Capsules du plancher", "st.title": '<span class="ln">Dans leurs</span><span class="ln"><em>propres mots.</em></span>',
      "st.lead": "Des exposants de complexes hôteliers, de DMC et de safaris expliquent pourquoi ils reviennent. Glissez pour explorer — touchez pour lancer.",
      "ex.eyebrow": "Inscription des exposants 2027", "ex.title": '<span class="ln">Créez votre tournée.</span><span class="ln"><em>Voyez votre prix en direct.</em></span>',
      "ex.lead": "Choisissez vos villes et voyez les rabais multi-salons s'appliquer instantanément. Réservez 12 salons ou plus et exposez dès 1 116 $ CA par salon.",
      "ex.s1": "Choisissez votre forfait", "ex.p1": "Exposition seulement", "ex.p1n": "Table habillée, affiche, souper et logo sur le site", "ex.sold": "Complet · Liste d'attente",
      "ex.p2": "Présentation et exposition", "ex.p2n": "Tout ce qui précède plus une plage de présentation",
      "ex.s2": "Choisissez vos salons", "ex.allcities": "Toutes", "ex.clear": "Effacer", "ex.s3": "Votre niveau de rabais", "ex.expos": "salons",
      "ex.summary": "Votre tournée 2027", "ex.selected": "salons choisis", "ex.base": "Base", "ex.disc": "Rabais multi-salons", "ex.sub": "Sous-total",
      "ex.hst": "TVH 13 % (facturation au Canada)", "ex.tax": "TVH", "ex.total": "Total ($ CA)", "ex.per": "Coût réel par salon", "ex.dep": "Dépôt de 50 % aujourd'hui",
      "ex.cta": "Passer à l'inscription", "ex.fine": "Le solde de 50 % est dû 90 jours avant chaque série. Commandites exclusives par catégorie offertes sur demande.",
      "ex.incl": "Chaque espace d'exposition comprend", "ex.i1": "Affiche imprimée en couleur sur mesure", "ex.i2": "Accès direct à des conseillers locaux engagés", "ex.i3": "Participation au souper réseautage", "ex.i4": "Logo affiché sur le site Web", "ex.i5": "Table habillée de 6 à 8 pi (selon le lieu)",
      "ag.eyebrow": "Avis à tous les conseillers en voyages", "ag.title": '<span class="ln">Les meilleurs fournisseurs au monde,</span><span class="ln"><em>dans votre ville.</em></span>',
      "ag.lead": "Apprenez des marques que vous vendez, rencontrez leurs responsables des ventes, soupez à nos frais — et repartez peut-être avec un prix. C'est gratuit pour les conseillers.",
      "ag.p1": "Carte-cadeau Mastercard pour les 50 premiers conseillers à chaque salon", "ag.p2": "Destinations, complexes hôteliers, croisiéristes et voyagistes", "ag.p3": "Souper, présentations et tirages inclus",
      "ag.window": "L'inscription des conseillers ouvre 5 semaines avant chaque salon", "ag.ph": "vous@agence.com", "ag.notify": "M'aviser",
      "ag.back": "Pour les 50 premiers conseillers à chaque salon 2027.", "ag.hint": "Glissez ou touchez la carte pour la faire pivoter",
      "sp.eyebrow": "Commanditaires principaux 2026", "sp.s1": "Commanditaire hôtelier", "sp.s2": "Commanditaire des cartes-cadeaux", "sp.s3": "Partenaire expérience arctique",
      "sp.cap": "Un aperçu de nos partenaires actuels et passés", "sp.cta": "Des commandites intégrées et personnalisées sont offertes.", "sp.talk": "Parlez à Bradley Dean",
      "ga.eyebrow": "Granite Productions", "ga.title": '<span class="ln">Chaque événement,</span><span class="ln"><em>produit à l\'interne.</em></span>',
      "ga.lead": "Galas, congrès, lancements et salons — avec notre propre équipe média pour capter chaque moment pour nos partenaires.", "ga.all": "Voir toutes les galeries",
      "nw.eyebrow": "Dans les médias", "nw.title": '<span class="ln">La presse spécialisée</span><span class="ln"><em>en parle.</em></span>', "nw.all": "Tous les communiqués", "nw.read": "Lire l'article",
      "tm.eyebrow": "L'équipe derrière les salons", "tm.r1": "Directeur général", "tm.r2": "Directeur de création", "tm.r3": "Animateur et ambassadeur", "tm.r4": "Ventes", "tm.r5": "Conseiller en événements",
      "fn.title": '<span class="ln">Bâtissez des relations.</span><span class="ln"><em>Faites croître vos affaires.</em></span>',
      "fn.notify": "Soyez les premiers informés des prochains événements", "fn.email": "Courriel", "fn.interest": "Je m'intéresse à", "fn.sup": "Devenir fournisseur", "fn.agt": "Participer comme conseiller", "fn.join": "S'abonner à l'infolettre",
      "ft.top": "Haut de page",
      "rg.eyebrow": "Inscription des exposants 2027", "rg.title": "Réservez votre place", "rg.s1": "Entreprise", "rg.s2": "Paiement", "rg.s3": "Révision",
      "rg.company": "Nom de l'entreprise *", "rg.contact": "Personne-ressource *", "rg.phone": "Téléphone *", "rg.city": "Ville *", "rg.country": "Pays *",
      "rg.cur": "Devise", "rg.amt": "Montant du paiement", "rg.deposit": "Dépôt de 50 %", "rg.full": "Montant total", "rg.method": "Mode de paiement", "rg.cc": "Carte de crédit (+3 %)", "rg.wire": "Virement int'l",
      "rg.note": "Les détails de paiement vous sont envoyés par courriel dès réception de votre inscription. Aucune carte n'est débitée ici.",
      "rg.terms": "J'accepte les modalités de paiement et la politique d'annulation.", "rg.thanks": "Vous faites partie de la tournée 2027.",
      "rg.thanksp": "Ceci est un prototype — sur le site réel, votre inscription et votre lien de paiement seraient envoyés instantanément.", "rg.back": "Retour", "rg.next": "Continuer",
      _: { regions: { ontario: "Ontario", atlantic: "Atlantique", west: "Ouest canadien" }, opensIn: (c, n, d) => `L'inscription pour <b>${c}</b> ouvre dans <b>${n} jours</b> · ${d}`, openNow: c => `L'inscription pour <b>${c}</b> est ouverte!`, toGo: n => `Dans ${n} jours`, submit: "Soumettre l'inscription", thanksNl: "Merci! Vous êtes abonné.", notify: "Nous vous aviserons à l'ouverture des inscriptions.", invalid: "Entrez un courriel valide.", waitlist: "Ajouté à la liste d'attente des présentations — au prix « exposition seulement » d'ici là.", booked: c => `${c} ajoutée à votre tournée`, review: { company: "Entreprise", contact: "Contact", email: "Courriel", expos: "Salons", pkg: "Forfait", total: "Total", pay: "Paiement aujourd'hui", method: "Mode" }, inset: "SUD DE L'ONTARIO" },
    },
  };
  const EN_DYN = { regions: { ontario: "Ontario", atlantic: "Atlantic Canada", west: "Western Canada" }, opensIn: (c, n, d) => `Registration for <b>${c}</b> opens in <b>${n} days</b> · ${d}`, openNow: c => `Registration for <b>${c}</b> is open now!`, toGo: n => `${n} days to go`, submit: "Submit registration", thanksNl: "Thank you — you're on the list.", notify: "We'll email you the moment registration opens.", invalid: "Please enter a valid email.", waitlist: "Added to the presentation waitlist — priced as Exhibit-only until a slot opens.", booked: c => `${c} added to your tour`, review: { company: "Company", contact: "Contact", email: "Email", expos: "Expos", pkg: "Package", total: "Total", pay: "Due today", method: "Method" }, inset: "SOUTHERN ONTARIO" };

  let lang = "en";
  const D = () => (lang === "en" ? EN_DYN : I18N[lang]._);
  const loc = () => LOCALES[lang];
  const fmtDate = (d, opts = { month: "long", day: "numeric", year: "numeric" }) => new Intl.DateTimeFormat(loc(), { ...opts, timeZone: "UTC" }).format(new Date(d + "T12:00:00Z"));
  const money = v => new Intl.NumberFormat(loc(), { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 }).format(Math.round(v));

  // capture English originals
  $$("[data-i18n]").forEach(el => (el.dataset.en = el.innerHTML));
  $$("[data-i18n-html]").forEach(el => (el.dataset.en = el.innerHTML));
  $$("[data-i18n-ph]").forEach(el => (el.dataset.en = el.placeholder));
  const manifestoEl = $("#manifesto");
  const manifestoEN = "We are not the largest travel trade show in the country — and that's *intentional.* When suppliers show up in an agent's own community, it's noticed. It's appreciated. And it *converts.*";

  function setLang(l) {
    lang = l;
    document.documentElement.lang = l === "fr" ? "fr-CA" : l;
    const dict = I18N[l] || {};
    $$("[data-i18n]").forEach(el => { el.innerHTML = l === "en" ? el.dataset.en : (dict[el.dataset.i18n] ?? el.dataset.en); });
    $$("[data-i18n-html]").forEach(el => { el.innerHTML = l === "en" ? el.dataset.en : (dict[el.dataset.i18nHtml] ?? el.dataset.en); indexLines(el); });
    $$("[data-i18n-ph]").forEach(el => { el.placeholder = l === "en" ? el.dataset.en : (dict[el.dataset.i18nPh] ?? el.dataset.en); });
    splitManifesto(l === "en" ? manifestoEN : dict["why.manifesto"]);
    $$(".lang__btn").forEach((b, i) => {
      const on = b.dataset.lang === l;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on);
      if (on) $(".lang__pill").style.transform = `translateX(${b.offsetLeft - 4}px)`;
    });
    try { localStorage.setItem("gtte-lang", l); } catch (e) {}
    document.dispatchEvent(new CustomEvent("langchange"));
  }
  $$(".lang__btn").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));

  function indexLines(el) { $$(".ln", el).forEach((ln, i) => ln.style.setProperty("--i", i)); }
  $$(".reveal-title, .hero__title").forEach(indexLines);

  function splitManifesto(text) {
    manifestoEl.innerHTML = text.split(/\s+/).map(w => {
      const acc = /^\*.*\*$/.test(w);
      return `<span class="w${acc ? " accent" : ""}">${w.replace(/\*/g, "")}</span>`;
    }).join(" ");
    updateManifesto();
  }

  /* ---------------- toast ---------------- */
  let toastT;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("is-on"), 3200);
  }

  /* ---------------- smooth scroll ---------------- */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  function scrollToEl(target) {
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: -70 });
    else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    const target = id === "#top" ? document.body : $(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    scrollToEl(target);
  });

  /* ---------------- loader ---------------- */
  const loader = $("#loader");
  const lc = $("#loaderCount");
  let lp = 0;
  const loadTick = setInterval(() => {
    lp = Math.min(lp + Math.random() * 18 + 6, document.readyState === "complete" ? 100 : 88);
    lc.textContent = Math.floor(lp);
    if (lp >= 100) { clearInterval(loadTick); finishLoad(); }
  }, 90);
  function finishLoad() {
    setTimeout(() => {
      loader.classList.add("is-done");
      document.body.classList.remove("is-loading");
      $(".hero__title").classList.add("is-in");
      $$(".hero .reveal").forEach(el => el.classList.add("is-in"));
      setTimeout(() => (loader.style.display = "none"), 1200);
    }, 250);
  }
  setTimeout(() => { if (lp < 100) { clearInterval(loadTick); lc.textContent = 100; finishLoad(); } }, 4000);

  /* ---------------- reveal observer ---------------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  // stagger siblings
  $$(".reveal").forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.classList.contains("reveal"));
    const i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty("--d", `${Math.min(i, 6) * 90}ms`);
    if (!el.closest(".hero")) io.observe(el);
  });
  $$(".reveal-title").forEach(el => io.observe(el));

  /* ---------------- counters ---------------- */
  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, to = +el.dataset.to, t0 = performance.now(), dur = 1800;
      const step = now => {
        const p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(to * e).toLocaleString("en-CA");
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$(".count").forEach(el => cio.observe(el));

  /* ---------------- nav ---------------- */
  const nav = $("#nav");
  const burger = $("#burger"), menu = $("#menu");
  function closeMenu() { menu.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); menu.setAttribute("aria-hidden", "true"); if (lenis) lenis.start(); }
  burger.addEventListener("click", () => {
    const open = !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open);
    menu.setAttribute("aria-hidden", !open);
    if (lenis) open ? lenis.stop() : lenis.start();
  });
  const navLinks = $$(".nav__links a");
  const sections = navLinks.map(a => $(a.getAttribute("href")));

  /* ---------------- scroll-driven loop ---------------- */
  const progress = $("#progress");
  const heroMedia = $(".hero__media");
  const band = $(".band"), bandTrack = $("#bandTrack");
  const tlEl = $("#timeline"), tlFill = $("#tlFill");
  const finalBg = $(".final__bg");
  const mcta = $("#mcta");
  let lastY = 0;

  function updateManifesto() {
    const words = $$(".w", manifestoEl);
    if (!words.length) return;
    const r = manifestoEl.getBoundingClientRect(), vh = innerHeight;
    const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
    const lit = Math.floor(p * words.length * 1.05);
    words.forEach((w, i) => w.classList.toggle("is-lit", i < lit || reduced));
  }

  function onScroll() {
    const y = window.scrollY, vh = innerHeight, docH = document.documentElement.scrollHeight - vh;
    progress.style.transform = `scaleX(${docH > 0 ? y / docH : 0})`;
    nav.classList.toggle("is-scrolled", y > 40);
    nav.classList.toggle("is-hidden", y > lastY && y > vh * 0.9 && !menu.classList.contains("is-open"));
    lastY = y;
    mcta.classList.toggle("is-on", y > vh * 0.8 && y < docH - 400);

    if (!reduced) {
      if (y < vh * 1.2) heroMedia.style.transform = `translate3d(0, ${y * 0.3}px, 0) scale(${1 + y / vh * 0.06})`;
      const br = band.getBoundingClientRect();
      if (br.top < vh && br.bottom > 0) {
        const p = (vh - br.top) / (vh + br.height);
        const max = bandTrack.scrollWidth - innerWidth + 40;
        bandTrack.style.transform = `translate3d(${-p * max * 0.9}px,0,0)`;
        $$("img", bandTrack).forEach((img, i) => (img.style.transform = `scale(1.15) translateX(${(p - 0.5) * (i % 2 ? 30 : -30)}px)`));
      }
      const fr = finalBg.parentElement.getBoundingClientRect();
      if (fr.top < vh && fr.bottom > 0) finalBg.style.transform = `translate3d(0, ${(fr.top) * -0.15}px, 0)`;
    }
    const tr = tlEl.getBoundingClientRect();
    tlFill.style.transform = `scaleY(${clamp((vh * 0.6 - tr.top) / tr.height, 0, 1)})`;
    updateManifesto();

    // current section
    let cur = -1, best = -Infinity;
    sections.forEach((s, i) => { const top = s ? s.getBoundingClientRect().top : Infinity; if (top < vh * 0.4 && top > best) { best = top; cur = i; } });
    if (cur > -1 && sections[cur].getBoundingClientRect().bottom < vh * 0.2) cur = -1;
    navLinks.forEach((a, i) => a.classList.toggle("is-current", i === cur));
  }
  if (lenis) lenis.on("scroll", onScroll);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ---------------- cursor + magnetic + tilt ---------------- */
  if (fine && !reduced) {
    const cur = $("#cursor"), lab = $("#cursorLabel");
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    window.addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; cur.classList.add("is-on"); }, { passive: true });
    document.addEventListener("pointerleave", () => cur.classList.remove("is-on"));
    (function loop() { cx = lerp(cx, mx, 0.2); cy = lerp(cy, my, 0.2); cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`; requestAnimationFrame(loop); })();
    document.addEventListener("pointerover", e => {
      const l = e.target.closest("[data-cursor]");
      const v = e.target.closest(".vcard");
      if (v) { cur.classList.add("is-label"); lab.textContent = "Play"; return; }
      if (l) { cur.classList.add("is-label"); lab.textContent = l.dataset.cursor; return; }
      cur.classList.remove("is-label");
      cur.classList.toggle("is-link", !!e.target.closest("a, button, label, input, select"));
    });

    $$(".magnetic").forEach(el => {
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });

    $$(".tilt").forEach(el => {
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${-py * 8}deg) rotateY(${px * 10}deg) translateY(-4px)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  /* ---------------- hero slideshow + countdown ---------------- */
  const slides = $$(".hero__slide"), dots = $$("#heroDots i");
  let si = 0;
  function nextSlide() {
    slides[si].classList.remove("is-active");
    dots[si].classList.remove("is-active"); dots[si].classList.add("is-done");
    si = (si + 1) % slides.length;
    if (si === 0) dots.forEach(d => d.classList.remove("is-done"));
    slides[si].classList.add("is-active");
    void dots[si].offsetWidth;
    dots[si].classList.add("is-active");
  }
  if (!reduced) setInterval(nextSlide, 6000);

  const nextExpo = () => CITIES.find(c => c.end > new Date()) || CITIES[CITIES.length - 1];
  const pad = (n, l = 2) => String(n).padStart(l, "0");
  function tickCountdown() {
    const c = nextExpo();
    const ms = Math.max(0, c.start - new Date());
    $("#cdD").textContent = pad(Math.floor(ms / 864e5), 3);
    $("#cdH").textContent = pad(Math.floor(ms / 36e5) % 24);
    $("#cdM").textContent = pad(Math.floor(ms / 6e4) % 60);
    $("#cdS").textContent = pad(Math.floor(ms / 1e3) % 60);
  }
  function renderNext() {
    const c = nextExpo();
    $("#cdCity").textContent = `${c.n}, ${c.p}`;
    $("#cdDate").textContent = fmtDate(c.d, { weekday: "long", month: "long", day: "numeric", year: "numeric" }) + " · 4 PM";
  }
  tickCountdown(); renderNext();
  setInterval(tickCountdown, 1000);

  // city marquee
  const mq = $("#cityMarquee");
  const mqHTML = CITIES.map(c => `<span>${c.n}, ${c.p}</span>`).join("");
  mq.innerHTML = mqHTML + mqHTML;

  /* ---------------- MAP ---------------- */
  const svg = $("#mapSvg");
  const NS = "http://www.w3.org/2000/svg";
  const P = (lon, lat) => [(lon + 126) * 12.4, 40 + (55 - lat) * 20];
  const INSET = { x: 30, y: 244, w: 440, h: 184, lon0: -81.7, lon1: -75.3, lat0: 42.6, lat1: 45.8 };
  const PI = (lon, lat) => [INSET.x + 18 + (lon - INSET.lon0) / (INSET.lon1 - INSET.lon0) * (INSET.w - 36), INSET.y + 30 + (INSET.lat1 - lat) / (INSET.lat1 - INSET.lat0) * (INSET.h - 50)];

  function buildMap() {
    const pts = CITIES.map(c => P(c.lon, c.lat));
    const curve = pts.map((p, i) => {
      if (!i) return `M${p[0].toFixed(1)},${p[1].toFixed(1)}`;
      const q = pts[i - 1], mx = (q[0] + p[0]) / 2, my = (q[1] + p[1]) / 2, dist = Math.hypot(p[0] - q[0], p[1] - q[1]);
      return `Q${mx.toFixed(1)},${(my - dist * 0.28).toFixed(1)} ${p[0].toFixed(1)},${p[1].toFixed(1)}`;
    }).join(" ");
    const lats = [50, 45].map(l => { const y = P(0, l)[1]; return `<line class="lat" x1="0" x2="1000" y1="${y}" y2="${y}"/><text class="lat-label" x="992" y="${y - 6}" text-anchor="end">${l}°N</text>`; }).join("");
    const lens = P(-78.6, 44.1);
    const mainPins = CITIES.filter(c => c.r !== "ontario").map(c => pinSVG(c, P(c.lon, c.lat), c.lab)).join("");
    const minis = CITIES.filter(c => c.r === "ontario").map(c => { const [x, y] = P(c.lon, c.lat); return `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff" opacity=".85"/>`; }).join("");
    const insetPins = CITIES.filter(c => c.r === "ontario").map(c => pinSVG(c, PI(c.lon, c.lat), c.lab)).join("");
    svg.innerHTML = `
      <defs>
        <linearGradient id="routeGrad" x1="0" x2="1"><stop offset="0" stop-color="#ff4a4f"/><stop offset="1" stop-color="#ffffff" stop-opacity=".7"/></linearGradient>
        <radialGradient id="glow"><stop offset="0" stop-color="#e2232e" stop-opacity=".5"/><stop offset="1" stop-color="#e2232e" stop-opacity="0"/></radialGradient>
      </defs>
      ${lats}
      <text class="region" x="${P(-118, 54.4)[0]}" y="${P(0, 54.4)[1]}" data-region="west">${D().regions.west}</text>
      <text class="region" x="${P(-68, 50.5)[0]}" y="${P(0, 50.5)[1]}" data-region="atlantic">${D().regions.atlantic}</text>
      <text class="region" x="${P(-86, 47.2)[0]}" y="${P(0, 47.2)[1]}" data-region="ontario">${D().regions.ontario}</text>
      <path class="route" id="routePath" d="${curve}"/>
      <path class="route-solid" id="routeSolid" d="${curve}"/>
      <circle r="5" fill="#fff"><animateMotion dur="16s" repeatCount="indefinite" rotate="auto"><mpath href="#routePath"/></animateMotion></circle>
      <circle r="14" fill="url(#glow)"><animateMotion dur="16s" repeatCount="indefinite"><mpath href="#routePath"/></animateMotion></circle>
      <circle class="inset-lens" cx="${lens[0]}" cy="${lens[1]}" r="56"/>
      ${minis}
      <path class="inset-link" d="M${lens[0] - 40},${lens[1] + 40} L${INSET.x + INSET.w},${INSET.y + 20}"/>
      <rect class="inset-frame" x="${INSET.x}" y="${INSET.y}" width="${INSET.w}" height="${INSET.h}" rx="14"/>
      <text class="inset-title" x="${INSET.x + 16}" y="${INSET.y + 22}" id="insetTitle">${D().inset}</text>
      ${insetPins}
      ${mainPins}`;
    const solid = $("#routeSolid"), len = solid.getTotalLength();
    solid.style.strokeDasharray = len;
    solid.style.strokeDashoffset = len;
    solid.style.transition = "stroke-dashoffset 3.6s cubic-bezier(.65,0,.35,1) .3s";
    new IntersectionObserver((en, o) => { if (en[0].isIntersecting) { solid.style.strokeDashoffset = 0; o.disconnect(); setTimeout(() => (solid.style.opacity = ".35"), 4200); solid.style.transition += ", opacity 1s"; } }, { threshold: 0.35 }).observe(svg);
    $$(".pin", svg).forEach(p => {
      p.addEventListener("pointerenter", () => hot(p.dataset.id, true));
      p.addEventListener("pointerleave", () => hot(p.dataset.id, false));
      p.addEventListener("click", e => { e.stopPropagation(); showTip(p.dataset.id); });
      p.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showTip(p.dataset.id); } });
    });
  }
  function pinSVG(c, [x, y], lab) {
    const [dx, dy, anchor] = lab;
    const label = c.short || c.n;
    const dateTxt = fmtDate(c.d, { month: "short", day: "numeric" });
    return `<g class="pin" data-id="${c.id}" data-season="${c.s}" tabindex="0" role="button" aria-label="${c.n}, ${c.p} — ${fmtDate(c.d)}">
      <circle class="pin__halo" cx="${x}" cy="${y}" r="9"/>
      <circle class="pin__dot" cx="${x}" cy="${y}" r="6"/>
      <text class="pin__label" x="${x + dx}" y="${y + dy}" text-anchor="${anchor}">${label}</text>
      <text class="pin__date" x="${x + dx}" y="${y + dy + (dy < 0 ? -14 : 13)}" text-anchor="${anchor}">${dateTxt.toUpperCase()}</text>
    </g>`;
  }
  const cityList = $("#cityList");
  function buildList() {
    const groups = [["spring", "ontario"], ["spring", "atlantic"], ["fall", "west"], ["fall", "ontario"]];
    const seasonName = s => $(`.tab[data-season="${s}"]`).textContent;
    cityList.innerHTML = groups.map(([s, r]) => {
      const items = CITIES.filter(c => c.s === s && c.r === r);
      return `<li class="cities__group" data-season="${s}">${seasonName(s)} · ${D().regions[r]}</li>` + items.map(c => `
        <li class="city" data-id="${c.id}" data-season="${c.s}" tabindex="0">
          <div><b>${c.n}, ${c.p}</b><small>${D().toGo(daysTo(c))}</small></div>
          <div class="city__date">${fmtDate(c.d, { month: "short", day: "numeric" })}<span>${fmtDate(c.d, { weekday: "short" })}</span></div>
        </li>`).join("");
    }).join("");
    $$(".city", cityList).forEach(li => {
      li.addEventListener("pointerenter", () => hot(li.dataset.id, true));
      li.addEventListener("pointerleave", () => hot(li.dataset.id, false));
      li.addEventListener("click", () => showTip(li.dataset.id));
      li.addEventListener("keydown", e => { if (e.key === "Enter") showTip(li.dataset.id); });
    });
    applySeason();
  }
  const daysTo = c => Math.max(0, Math.ceil((c.start - new Date()) / 864e5));
  function hot(id, on) {
    $$(`[data-id="${id}"]`, $("#tour")).forEach(el => el.classList.toggle("is-hot", on));
  }
  let season = "all";
  function applySeason() {
    $$(".pin", svg).forEach(p => p.classList.toggle("is-dim", season !== "all" && p.dataset.season !== season));
    $$(".city, .cities__group", cityList).forEach(li => li.classList.toggle("is-dim", season !== "all" && li.dataset.season !== season));
  }
  const tabPill = $(".tab__pill");
  function moveTabPill() { const a = $(".tab.is-active"); tabPill.style.width = a.offsetWidth + "px"; tabPill.style.transform = `translateX(${a.offsetLeft}px)`; }
  $$(".tab").forEach(t => t.addEventListener("click", () => {
    $$(".tab").forEach(x => { x.classList.toggle("is-active", x === t); x.setAttribute("aria-selected", x === t); });
    season = t.dataset.season; moveTabPill(); applySeason(); hideTip();
  }));

  const tip = $("#mapTip"), mapWrap = $("#mapWrap");
  let tipCity = null;
  function showTip(id) {
    const c = byId[id]; tipCity = c;
    const pin = $(`.pin[data-id="${id}"] .pin__dot`, svg);
    const pr = pin.getBoundingClientRect(), wr = mapWrap.getBoundingClientRect();
    $("#tipRegion").textContent = D().regions[c.r];
    $("#tipCity").textContent = `${c.n}, ${c.p}`;
    $("#tipDate").textContent = fmtDate(c.d, { weekday: "long", month: "long", day: "numeric", year: "numeric" }) + " · 4–8 PM";
    $("#tipDays").textContent = D().toGo(daysTo(c));
    tip.hidden = false;
    let x = pr.left - wr.left + mapWrap.scrollLeft + pr.width / 2, y = pr.top - wr.top;
    const half = 125;
    x = clamp(x, half, mapWrap.scrollWidth - half);
    tip.style.left = x + "px";
    if (y < 190) { tip.style.top = (y + 210) + "px"; } else tip.style.top = y + "px";
    tip.style.animation = "none"; void tip.offsetWidth; tip.style.animation = "";
    $$(".city", cityList).forEach(li => li.classList.toggle("is-hot", li.dataset.id === id));
  }
  function hideTip() { tip.hidden = true; tipCity = null; }
  document.addEventListener("click", e => { if (!tip.hidden && !e.target.closest("#mapTip, .pin, .city")) hideTip(); });
  $("#tipBook").addEventListener("click", () => {
    if (!tipCity) return;
    selected.add(tipCity.id); renderChips(); calc();
    toast(D().booked(`${tipCity.n}, ${tipCity.p}`));
    hideTip(); scrollToEl($("#exhibit"));
  });
  $("#tipCal").addEventListener("click", () => {
    if (!tipCity) return;
    const c = tipCity, f = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Granite Travel Trade Expos//EN", "BEGIN:VEVENT", `UID:gtte-${c.id}-2027@granitetravelexpos.com`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(c.start)}`, `DTEND:${f(c.end)}`, `SUMMARY:Granite Travel Trade Expo — ${c.n}, ${c.p}`, `LOCATION:${c.n}, ${c.p}, Canada`, "DESCRIPTION:4–6 PM Supplier Presentations · 6–7:30 PM Trade Show · 7:30–8 PM Dinner & Prizes. granitetravelexpos.com", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = `granite-expo-${c.id}-2027.ics`;
    document.body.appendChild(a); a.click(); a.remove();
  });

  // center map scroll on small screens
  requestAnimationFrame(() => { if (mapWrap.scrollWidth > mapWrap.clientWidth) mapWrap.scrollLeft = (mapWrap.scrollWidth - mapWrap.clientWidth) * 0.35; });

  /* ---------------- video carousel ---------------- */
  const vcar = $("#vcar"), vTrack = $("#vTrack"), vCards = $$(".vcard", vTrack), vBar = $("#vBar");
  let vx = 0, vTarget = 0, vDrag = false, vStartX = 0, vStartT = 0, vMoved = 0, vVel = 0, vLastX = 0;
  const vBounds = () => [Math.min(0, vcar.clientWidth - vTrack.scrollWidth), 0];
  vcar.addEventListener("pointerdown", e => {
    vDrag = true; vMoved = 0; vStartX = vLastX = e.clientX; vStartT = vTarget; vVel = 0;
    vcar.classList.add("is-drag");
  });
  window.addEventListener("pointermove", e => {
    if (!vDrag) return;
    const dx = e.clientX - vStartX; vMoved = Math.max(vMoved, Math.abs(dx));
    vVel = e.clientX - vLastX; vLastX = e.clientX;
    const [mn, mx] = vBounds(); let t = vStartT + dx;
    if (t > mx) t = mx + (t - mx) * 0.35; if (t < mn) t = mn + (t - mn) * 0.35;
    vTarget = t;
  });
  window.addEventListener("pointerup", () => {
    if (!vDrag) return; vDrag = false; vcar.classList.remove("is-drag");
    const [mn, mx] = vBounds(); vTarget = clamp(vTarget + vVel * 14, mn, mx);
  });
  vcar.addEventListener("click", e => { if (vMoved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  const step = () => vCards[0].offsetWidth + 22;
  $("#vNext").addEventListener("click", () => { const [mn] = vBounds(); vTarget = clamp(vTarget - step(), mn, 0); });
  $("#vPrev").addEventListener("click", () => { const [mn] = vBounds(); vTarget = clamp(vTarget + step(), mn, 0); });
  (function vLoop() {
    vx = lerp(vx, vTarget, reduced ? 1 : 0.12);
    vTrack.style.transform = `translate3d(${vx}px,0,0)`;
    const cw = vcar.clientWidth, center = cw / 2;
    vCards.forEach(card => {
      const r = card.offsetLeft + vx + card.offsetWidth / 2;
      const d = clamp((r - center) / cw, -1, 1);
      card.style.transform = reduced ? "" : `rotateY(${d * -18}deg) translateZ(${-Math.abs(d) * 90}px)`;
    });
    const [mn] = vBounds();
    const p = mn ? clamp(vx / mn, 0, 1) : 0;
    vBar.style.transform = `translateX(${p * (vBar.parentElement.clientWidth - parseFloat(getComputedStyle(vBar).left) * 2 - vBar.offsetWidth)}px)`;
    requestAnimationFrame(vLoop);
  })();

  /* ---------------- video modal ---------------- */
  const vModal = $("#videoModal"), vFrame = $("#videoFrame");
  let lastFocus = null;
  function openVideo(id) {
    lastFocus = document.activeElement;
    vFrame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="${VIDEO_TITLES[id] || "Testimonial"}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    vModal.hidden = false; if (lenis) lenis.stop();
    $(".modal__close", vModal).focus();
  }
  function closeModal(m) {
    m.hidden = true;
    if (m === vModal) vFrame.innerHTML = "";
    if (lenis) lenis.start();
    if (lastFocus) lastFocus.focus();
  }
  $$("[data-video]").forEach(b => b.addEventListener("click", () => openVideo(b.dataset.video)));
  $$(".modal").forEach(m => $$("[data-close]", m).forEach(x => x.addEventListener("click", () => closeModal(m))));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { $$(".modal").forEach(m => { if (!m.hidden) closeModal(m); }); closeMenu(); hideTip(); }
  });

  /* ---------------- quotes ---------------- */
  const quotes = $$(".quote"), qNav = $("#quotesNav");
  let qi = 0, qTimer;
  qNav.innerHTML = quotes.map((_, i) => `<button role="tab" aria-label="Testimonial ${i + 1}"${i ? "" : ' class="is-active"'}></button>`).join("");
  const qBtns = $$("button", qNav);
  function showQuote(i) {
    quotes[qi].classList.remove("is-active"); qBtns[qi].classList.remove("is-active");
    qi = i;
    quotes[qi].classList.add("is-active"); void qBtns[qi].offsetWidth; qBtns[qi].classList.add("is-active");
    clearTimeout(qTimer); qTimer = setTimeout(() => showQuote((qi + 1) % quotes.length), 7000);
  }
  qBtns.forEach((b, i) => b.addEventListener("click", () => showQuote(i)));
  qTimer = setTimeout(() => showQuote(1), 7000);

  /* ---------------- configurator ---------------- */
  const selected = new Set();
  const chipsEl = $("#chips");
  let lastCalc = { base: 0, disc: 0, sub: 0, tax: 0, total: 0, dep: 0, pct: 0, n: 0, per: 0 };
  function renderChips() {
    const sp = $(`.tab[data-season="spring"]`).textContent, fa = $(`.tab[data-season="fall"]`).textContent;
    chipsEl.innerHTML = `<span class="chips__sep">${sp}</span>` + CITIES.map((c, i) =>
      (i === 7 ? `<span class="chips__sep">${fa}</span>` : "") +
      `<button type="button" class="chip" data-id="${c.id}" aria-pressed="${selected.has(c.id)}">${c.n}, ${c.p} <small>${fmtDate(c.d, { month: "short", day: "numeric" })}</small></button>`
    ).join("");
    $$(".chip", chipsEl).forEach(ch => ch.addEventListener("click", () => {
      selected.has(ch.dataset.id) ? selected.delete(ch.dataset.id) : selected.add(ch.dataset.id);
      ch.setAttribute("aria-pressed", selected.has(ch.dataset.id));
      calc();
    }));
  }
  $$("[data-pick]").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.pick;
    if (k === "none") selected.clear();
    else CITIES.filter(c => k === "all" || c.s === k).forEach(c => selected.add(c.id));
    renderChips(); calc();
  }));
  $$('input[name="pkg"]').forEach(r => r.addEventListener("change", () => { if (r.value === "1795" && r.checked) toast(D().waitlist); calc(); }));
  $("#hst").addEventListener("change", calc);

  const animNum = (el, from, to, fmt) => {
    if (reduced || from === to) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const run = now => { const p = clamp((now - t0) / 650, 0, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(lerp(from, to, e)); if (p < 1) requestAnimationFrame(run); };
    requestAnimationFrame(run);
  };
  function calc() {
    const n = selected.size;
    const price = 1395; // presentation slots are sold out → waitlist, billed as exhibit-only
    const pct = n >= 12 ? 0.2 : n >= 9 ? 0.15 : n >= 4 ? 0.1 : 0;
    const base = n * price, disc = base * pct, sub = base - disc, tax = $("#hst").checked ? sub * 0.13 : 0, total = sub + tax, dep = total / 2, per = n ? sub / n : 0;
    const next = { base, disc, sub, tax, total, dep, pct, n, per };
    $("#sumCount").textContent = n;
    animNum($("#sumBase"), lastCalc.base, base, money);
    animNum($("#sumDisc"), lastCalc.disc, disc, v => "–" + money(v));
    animNum($("#sumSub"), lastCalc.sub, sub, money);
    animNum($("#sumTax"), lastCalc.tax, tax, money);
    animNum($("#sumTotal"), lastCalc.total, total, money);
    animNum($("#sumDep"), lastCalc.dep, dep, money);
    $("#sumPer").textContent = n ? money(per) : "—";
    $("#sumPct").textContent = pct ? `${Math.round(pct * 100)}%` : "";
    $("#openReg").disabled = !n;
    $$(".tier").forEach(t => t.classList.toggle("is-on", n >= +t.dataset.min));
    $("#tierFill").style.width = n >= 12 ? "100%" : n >= 9 ? "66.67%" : n >= 4 ? "33.34%" : `${(n / 4) * 33.34 * 0.6}%`;
    lastCalc = next;
  }

  /* ---------------- registration modal ---------------- */
  const rModal = $("#regModal"), rForm = $("#regForm");
  let rStep = 1;
  $("#openReg").addEventListener("click", () => {
    lastFocus = document.activeElement;
    rStep = 1; renderStep();
    $("#regDone").hidden = true; $("#regFoot").hidden = false;
    rModal.hidden = false; if (lenis) lenis.stop();
    setTimeout(() => $("#rCompany").focus(), 50);
  });
  function payAmount() {
    const full = rForm.amt.value === "full", cc = rForm.pm.value === "cc";
    let v = full ? lastCalc.total : lastCalc.dep; if (cc) v *= 1.03;
    return v;
  }
  function renderStep() {
    $$(".reg__panel", rForm).forEach(p => p.classList.toggle("is-active", +p.dataset.step === rStep));
    $$("#regSteps li").forEach((li, i) => { li.classList.toggle("is-active", i + 1 === rStep); li.classList.toggle("is-done", i + 1 < rStep); });
    $("#regBack").style.visibility = rStep === 1 ? "hidden" : "visible";
    $("#regNext span").textContent = rStep === 3 ? D().submit : (lang === "en" ? "Continue" : I18N[lang]["rg.next"]);
    $("#regTotal").innerHTML = `${lastCalc.n} × expos<b>${money(payAmount())}</b>`;
    if (rStep === 3) {
      const R = D().review, pkg = $('input[name="pkg"]:checked').closest(".pkg").querySelector(".pkg__name").textContent;
      const cities = CITIES.filter(c => selected.has(c.id)).map(c => c.n).join(", ");
      const method = $('input[name="pm"]:checked + span').textContent;
      $("#review").innerHTML = [
        [R.company, $("#rCompany").value], [R.contact, $("#rContact").value], [R.email, $("#rEmail").value],
        [R.expos, `${lastCalc.n} — ${cities}`], [R.pkg, pkg], [R.total, money(lastCalc.total) + " CAD"],
        [R.pay, money(payAmount()) + " " + rForm.cur.value + (rForm.cur.value === "USD" ? "*" : "")], [R.method, method],
      ].map(([k, v]) => `<div><span>${k}</span><b>${escapeHTML(v)}</b></div>`).join("");
    }
  }
  const escapeHTML = s => String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  rForm.addEventListener("change", () => renderStep());
  function validStep() {
    let ok = true;
    if (rStep === 1) {
      $$('.reg__panel[data-step="1"] [required]').forEach(inp => {
        const bad = !inp.value.trim() || (inp.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value));
        inp.closest(".field").classList.toggle("is-error", bad);
        if (bad && ok) { inp.focus(); ok = false; }
      });
    }
    if (rStep === 3) {
      const t = $("#rTerms"); t.closest(".check").classList.toggle("is-error", !t.checked); ok = t.checked;
    }
    return ok;
  }
  $("#regNext").addEventListener("click", () => {
    if (!validStep()) return;
    if (rStep < 3) { rStep++; renderStep(); return; }
    $$(".reg__panel", rForm).forEach(p => p.classList.remove("is-active"));
    $("#regFoot").hidden = true; $("#regDone").hidden = false;
    $$("#regSteps li").forEach(li => { li.classList.remove("is-active"); li.classList.add("is-done"); });
    confetti();
  });
  $("#regBack").addEventListener("click", () => { if (rStep > 1) { rStep--; renderStep(); } });

  function confetti() {
    if (reduced) return;
    const colors = ["#e2232e", "#ffffff", "#0b0e13", "#ff8a8e", "#f3efe8"];
    for (let i = 0; i < 90; i++) {
      const c = document.createElement("i");
      c.className = "confetti";
      c.style.background = colors[i % colors.length];
      document.body.appendChild(c);
      const x0 = innerWidth / 2, y0 = innerHeight / 2, ang = Math.random() * Math.PI * 2, sp = 6 + Math.random() * 10;
      let vx = Math.cos(ang) * sp, vy = Math.sin(ang) * sp - 8, x = x0, y = y0, rot = Math.random() * 360, life = 0;
      const tick = () => {
        life++; vy += 0.35; vx *= 0.985; x += vx; y += vy; rot += vx * 2;
        c.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
        c.style.opacity = 1 - life / 140;
        if (life < 140) requestAnimationFrame(tick); else c.remove();
      };
      requestAnimationFrame(tick);
    }
  }

  /* ---------------- agents ---------------- */
  function renderRegWindow() {
    const c = nextExpo();
    const open = new Date(c.start.getTime() - 35 * 864e5);
    const now = new Date();
    const city = `${c.n}, ${c.p}`;
    const openStr = new Intl.DateTimeFormat(loc(), { month: "long", day: "numeric", year: "numeric" }).format(open);
    $("#regLine").innerHTML = now < open ? D().opensIn(city, Math.ceil((open - now) / 864e5), openStr) : D().openNow(city);
  }
  renderRegWindow();
  const emailOK = v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
  $("#notifyForm").addEventListener("submit", e => {
    e.preventDefault();
    const v = $("#notifyEmail").value.trim();
    if (!emailOK(v)) { toast(D().invalid); $("#notifyEmail").focus(); return; }
    $("#notifyEmail").value = ""; toast(D().notify);
  });
  $("#newsForm").addEventListener("submit", e => {
    e.preventDefault();
    const inp = $("#nlEmail"), ok = emailOK(inp.value.trim());
    inp.closest(".field").classList.toggle("is-error", !ok);
    $("#nlMsg").textContent = ok ? D().thanksNl : D().invalid;
    $("#nlMsg").style.color = ok ? "" : "var(--red-2)";
    if (ok) inp.value = "";
  });

  // gift card: drag to spin, click to flip, hover to tilt
  const gc = $("#giftcard"), gci = $(".giftcard__inner", gc), shine = $(".giftcard__shine", gc);
  let gRot = 0, gStart = 0, gX = 0, gDrag = false, gMoved = 0, tiltX = 0, tiltY = 0;
  const gApply = () => { gci.style.transform = `rotateX(${tiltX}deg) rotateY(${gRot + tiltY}deg)`; shine.style.setProperty("--shine", `${50 + ((gRot + tiltY) % 360) / 3.6 * -1}%`); };
  gc.addEventListener("pointerdown", e => { gDrag = true; gMoved = 0; gX = e.clientX; gStart = gRot; gc.classList.add("is-drag"); gc.setPointerCapture(e.pointerId); });
  gc.addEventListener("pointermove", e => {
    if (gDrag) { const dx = e.clientX - gX; gMoved = Math.max(gMoved, Math.abs(dx)); gRot = gStart + dx * 0.7; tiltX = 0; tiltY = 0; gApply(); return; }
    if (!fine) return;
    const r = gc.getBoundingClientRect();
    tiltY = ((e.clientX - r.left) / r.width - 0.5) * 22; tiltX = -((e.clientY - r.top) / r.height - 0.5) * 16; gApply();
  });
  const gEnd = () => {
    if (!gDrag) return; gDrag = false; gc.classList.remove("is-drag");
    gRot = gMoved < 5 ? gStart + 180 : Math.round(gRot / 180) * 180;
    gApply();
  };
  gc.addEventListener("pointerup", gEnd);
  gc.addEventListener("pointercancel", gEnd);
  gc.addEventListener("pointerleave", () => { if (!gDrag) { tiltX = 0; tiltY = 0; gApply(); } });
  gc.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); gRot += 180; gApply(); } });
  // idle wobble invite
  if (!reduced) new IntersectionObserver((en, o) => { if (en[0].isIntersecting) { setTimeout(() => { gRot += 360; gApply(); }, 500); o.disconnect(); } }, { threshold: 0.6 }).observe(gc);

  /* ---------------- partner logos ---------------- */
  const LOGOS = ["Sandals.jpg", "RIU_Hotels.jpg", "MSC-Cruises.jpg", "Iberostar.jpg", "WestJet-Vacations.jpg", "Jamaica.jpg", "Barcelo-Hotel-Group.jpg", "Karisma-Hotels-and-Resorts.jpg", "Celebrity-Cruises.jpg", "Hilton.jpg", "Palladium-hotel-group.jpg", "Collette.jpg", "Bahamas.jpg", "Barbados.jpg", "Cayman-Islands.jpg", "Dubai.jpg", "Tourism-Australia.jpg", "Trafalgar-Tours.jpg", "Globus.jpg", "Holland-America.jpg", "Rocky-Mountaineer.jpg", "Visit-Orlando.jpg", "Uniworld-Boutique-River-Cruises.jpg", "Catalonia.jpg",
    "Royalton-Hotels.jpg", "Sunwing.jpg", "Transat.jpg", "Couples-Resorts.jpg", "Oasis-Hotels-Resorts.jpg", "Sirenis.jpg", "BlueBay_Hotels.jpg", "Princess-Hotels-Resorts.jpg", "The-Palace-Company.jpg", "Sandos.jpg", "Puerto-Vallarta.png", "Los-Cabos.jpg", "Quark_Expeditions.jpg", "Carnival-Cruise.jpg", "Exodus-Travels.jpg", "Brightline.jpg", "St-Vincent-Grenadines.jpg", "Coconut-Bay-Beach-Resort.jpg", "Swan-Hellenic.png", "Choose-Chicago.jpg", "Visit-Myrtle-Beach.jpg", "Flair-Vacations.jpg", "Valentin-Imperial-Riviera-Maya.png", "Air-North.jpg"];
  const files = LOGOS.map(f => f.replace(/^Iberostar/, "iberostar").replace(/^Sunwing/, "sunwing").replace(/^Brightline/, "brightline"));
  const half = Math.ceil(files.length / 2);
  const row = (arr, rev) => `<div class="logos__row${rev ? " logos__row--rev" : ""}">${[...arr, ...arr].map(f => `<div class="logo-tile"><img src="images/partners/${f}" alt="${f.replace(/\.\w+$/, "").replace(/[-_]/g, " ")}" loading="lazy"></div>`).join("")}</div>`;
  $("#logos").innerHTML = row(files.slice(0, half)) + row(files.slice(half), true);

  /* ---------------- gallery ring ---------------- */
  const RING = [
    ["DSC_4665.jpg", "Spring 2025 · Halifax"], ["travelpulse-rca-2024.jpg", "TravelPulse Readers' Choice Awards"], ["DSC_1908.jpg", "Fall 2025 · Ottawa"],
    ["CAA-event.jpg", "CAA National Conference"], ["DSC_4933.jpg", "Fall 2025 · Hamilton"], ["st-kitts-event.jpg", "St. Kitts Tourism"],
    ["DSC_5482.jpg", "Fall 2025 · Hamilton"], ["virtual-show.jpg", "Virtual Travel & Leisure Show"], ["yt-xg_gZBNSCDA.jpg", "Quick Clips · Princess"], ["yt-KSQx12RlJkE.jpg", "Quick Clips · Bird Uganda"],
  ];
  const ring = $("#ring"), stage = $("#ringStage");
  stage.innerHTML = RING.map(([f, c]) => `<figure class="ring__item"><img src="images/${f}" alt="${c}" loading="lazy" draggable="false"><figcaption>${c}</figcaption></figure>`).join("");
  const rItems = $$(".ring__item", stage);
  let rAng = 0, rTarget = 0, rDrag = false, rX = 0, rStart = 0, rVel = 0, rLast = 0, rRadius = 500, rVisible = false;
  function layoutRing() {
    const w = rItems[0].offsetWidth, n = rItems.length, stepA = 360 / n;
    rRadius = Math.round((w / 2) / Math.tan(Math.PI / n)) + 30;
    rItems.forEach((it, i) => (it.style.transform = `rotateY(${i * stepA}deg) translateZ(${rRadius}px)`));
  }
  layoutRing(); window.addEventListener("resize", layoutRing);
  new IntersectionObserver(en => (rVisible = en[0].isIntersecting)).observe(ring);
  ring.addEventListener("pointerdown", e => { rDrag = true; rX = rLast = e.clientX; rStart = rTarget; rVel = 0; ring.classList.add("is-drag"); ring.setPointerCapture(e.pointerId); });
  ring.addEventListener("pointermove", e => { if (!rDrag) return; rVel = e.clientX - rLast; rLast = e.clientX; rTarget = rStart + (e.clientX - rX) * 0.22; });
  const rEnd = () => { if (!rDrag) return; rDrag = false; ring.classList.remove("is-drag"); rTarget += rVel * 2.2; };
  ring.addEventListener("pointerup", rEnd); ring.addEventListener("pointercancel", rEnd);
  (function rLoop() {
    if (rVisible) {
      if (!rDrag && !reduced) rTarget -= 0.06;
      rAng = lerp(rAng, rTarget, 0.08);
      const sc = Math.min(1, innerWidth / 900);
      stage.style.transform = `scale(${0.75 + sc * 0.25}) translateZ(${-rRadius}px) rotateX(-4deg) rotateY(${rAng}deg)`;
    }
    requestAnimationFrame(rLoop);
  })();

  /* ---------------- team hover image ---------------- */
  const tf = $("#teamFloat"), timg = $("#teamImg");
  if (fine) {
    let tx = 0, ty = 0, fx = 0, fy = 0, on = false;
    $$("#teamList li").forEach(li => {
      li.addEventListener("pointerenter", () => { timg.src = li.dataset.img; tf.classList.add("is-on"); on = true; });
      li.addEventListener("pointerleave", () => { tf.classList.remove("is-on"); on = false; });
    });
    window.addEventListener("pointermove", e => { tx = e.clientX + 170; ty = e.clientY; }, { passive: true });
    (function tLoop() { fx = lerp(fx, tx, 0.14); fy = lerp(fy, ty, 0.14); if (on || tf.classList.contains("is-on")) tf.style.left = fx + "px", tf.style.top = fy + "px"; requestAnimationFrame(tLoop); })();
  }

  /* ---------------- language-dependent re-render ---------------- */
  document.addEventListener("langchange", () => {
    buildMap(); buildList(); renderChips(); calc(); renderNext(); renderRegWindow(); moveTabPill(); hideTip();
    if (!rModal.hidden) renderStep();
  });

  /* ---------------- init ---------------- */
  buildMap(); buildList(); renderChips(); calc();
  let saved = "en";
  try { saved = localStorage.getItem("gtte-lang") || "en"; } catch (e) {}
  setLang(I18N[saved] || saved === "en" ? saved : "en");
  requestAnimationFrame(() => { moveTabPill(); onScroll(); });
  window.addEventListener("resize", moveTabPill);
  window.addEventListener("load", () => { moveTabPill(); layoutRing(); onScroll(); });
})();
