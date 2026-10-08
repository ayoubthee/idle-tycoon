// Centrale bedrijfsgegevens. Alles wat hier staat komt op elke pagina terug.
// Waarden gemarkeerd met `verify: true` in README.md moeten door de eigenaar
// worden gecontroleerd voordat de site live gaat.

export const site = {
  name: 'Mediakoning',
  domain: 'https://mediakoning.nl',
  tagline: 'IPTV-ontvangers & mediaspelers met persoonlijk advies',
  description:
    'Mediakoning is dé specialist in IPTV-ontvangers, Android TV-boxen en mediaspelers. Formuler, TVIP, MAG en meer — met eerlijk advies, snelle levering en afhaalpunten in Amsterdam, Rotterdam en Amersfoort.',
  email: 'info@mediakoning.nl',
  supportEmail: 'support@mediakoning.nl',
  phone: '+31 6 19886410',
  phoneDisplay: '06 1988 6410',
  whatsapp: '31619886410',
  kvk: '— (invullen)',
  btw: '— (invullen)',
  rating: { score: 9.1, count: 2264, source: 'WebwinkelKeur', url: 'https://www.webwinkelkeur.nl/webshop/Mediakoning_1202016' },
  shipping: {
    freeFrom: 50,
    cost: 4.95,
    cutoff: '17:00',
    returnDays: 14,
    warrantyMonths: 24,
  },
  hours: [
    { day: 'Maandag – vrijdag', time: '10:00 – 20:00' },
    { day: 'Zaterdag', time: '10:00 – 18:00' },
    { day: 'Zondag', time: 'Gesloten' },
  ],
  locations: [
    {
      id: 'amsterdam',
      city: 'Amsterdam',
      type: 'Showroom & afhaalpunt',
      street: 'Nieuwe Hemweg 4C',
      zip: '1013 BG',
      note: 'Hoofdlocatie — demonstraties en persoonlijk advies.',
    },
    {
      id: 'rotterdam',
      city: 'Rotterdam',
      type: 'Afhaalpunt (partner)',
      street: 'Graafstroomstraat 51-F',
      zip: '',
      note: 'Bestelling online klaarzetten en ophalen.',
    },
    {
      id: 'amersfoort',
      city: 'Amersfoort',
      type: 'Afhaalpunt (partner)',
      street: 'Heliumweg 6A',
      zip: '',
      note: 'Bestelling online klaarzetten en ophalen.',
    },
  ],
  socials: [
    { name: 'Facebook', url: 'https://www.facebook.com/mediakoning.nl/' },
    { name: 'Trustpilot', url: 'https://www.trustpilot.com/review/mediakoning.nl' },
  ],
  payments: ['iDEAL', 'Bancontact', 'PayPal', 'Visa', 'Mastercard', 'Klarna'],
};

export const categories = [
  {
    slug: 'iptv-ontvangers',
    name: 'IPTV-ontvangers',
    short: 'IPTV-boxen',
    intro:
      'Set-top boxen die speciaal gebouwd zijn voor televisie via internet. Snel zappen, een elektronische programmagids en een afstandsbediening die gewoon fijn werkt.',
    icon: 'tv',
  },
  {
    slug: 'mediaspelers',
    name: 'Mediaspelers',
    short: 'Mediaspelers',
    intro:
      'Streamers en Android TV-boxen voor Netflix, YouTube, Disney+, Plex en je eigen mediabibliotheek — in 4K HDR met Dolby Vision en Atmos.',
    icon: 'play',
  },
  {
    slug: 'accessoires',
    name: 'Accessoires',
    short: 'Accessoires',
    intro:
      'Losse afstandsbedieningen, air mice, mini-toetsenborden en kabels. Alles om je setup compleet en stabiel te maken.',
    icon: 'remote',
  },
];

export const nav = [
  { label: 'Shop', href: 'shop.html', mega: true },
  { label: 'Merken', href: 'merken.html' },
  { label: 'Keuzehulp', href: 'keuzehulp.html' },
  { label: 'Vergelijken', href: 'vergelijk.html' },
  { label: 'Kennisbank', href: 'kennisbank.html' },
  { label: 'Zakelijk', href: 'reseller.html' },
];
