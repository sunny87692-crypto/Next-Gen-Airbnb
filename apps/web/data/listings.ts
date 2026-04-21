// Stubs for listings data

export type CategoryId = 'homes' | 'experiences' | 'agents' | 'services';

export type ListingItem = {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  price: string;
  rating: string;
  badge: string;
  image: string;
  category: CategoryId;
};

export type Section = { id: string; title: string; items: ListingItem[] };

export const homePhotos = [
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1390971284633-8a13fde9d3aa?auto=format&fit=crop&w=900&q=80',
];

export const sections: Section[] = [
  {
    id: 'pune',
    title: 'Popular homes in Pune',
    items: [
      { id: 'pn1', title: 'Modern Loft in Koregaon Park', subtitle: 'Designer duplex with terrace', location: 'Pune City', price: '₹8,200', rating: '4.92', badge: 'Guest favourite', category: 'homes', image: homePhotos[0] },
      { id: 'pn2', title: 'Villa in Aundh', subtitle: 'Smart home with pool & garden', location: 'Aundh', price: '₹12,500', rating: '4.87', badge: 'Superhost', category: 'homes', image: homePhotos[1] },
      { id: 'pn3', title: 'Bungalow in Baner', subtitle: 'Quiet neighbourhood, fiber WiFi', location: 'Baner', price: '₹6,900', rating: '4.78', badge: 'Top rated', category: 'homes', image: homePhotos[2] },
      { id: 'pn4', title: 'Penthouse in Viman Nagar', subtitle: 'Sky view, rooftop terrace', location: 'Viman Nagar', price: '₹15,000', rating: '4.96', badge: 'Luxury pick', category: 'homes', image: homePhotos[3] },
      { id: 'pn5', title: 'Apartment in Wakad', subtitle: 'Cosy 2BHK near tech hubs', location: 'Wakad', price: '₹5,400', rating: '4.73', badge: 'Value stay', category: 'homes', image: homePhotos[4] },
      { id: 'pn6', title: 'Farmhouse in Lavasa', subtitle: 'Hill retreat, 40 min from Pune', location: 'Lavasa', price: '₹18,000', rating: '4.95', badge: 'Rare find', category: 'homes', image: homePhotos[5] },
      { id: 'pn7', title: 'Studio in Hinjewadi', subtitle: 'Minutes from IT parks', location: 'Hinjewadi', price: '₹3,800', rating: '4.60', badge: 'Quick access', category: 'homes', image: homePhotos[6] },
      { id: 'pn8', title: 'Heritage Villa in Deccan', subtitle: '100-year colonial bungalow', location: 'Deccan Gymkhana', price: '₹22,000', rating: '4.98', badge: 'Heritage gem', category: 'homes', image: homePhotos[7] },
      { id: 'pn-exp', title: 'Prototype Weekend', subtitle: 'Live founder retreat', location: 'Pimpri-Chinchwad', price: '₹6,768', rating: '4.98', badge: 'Creator pick', category: 'experiences', image: homePhotos[8] },
      { id: 'pn-agent', title: 'Prompt Pilot Agent', subtitle: 'Booking assistant for smart guest flows', location: 'Pune City', price: '₹8,559', rating: '4.96', badge: 'Agent ready', category: 'agents', image: homePhotos[9] },
      { id: 'pn-svc', title: 'AI Concierge Setup', subtitle: 'Custom itinerary + check-in flow', location: 'Pune City', price: '₹20,083', rating: '4.86', badge: 'Hot right now', category: 'services', image: homePhotos[0] },
    ],
  },
  {
    id: 'goa',
    title: 'Available in North Goa this weekend',
    items: [
      { id: 'ga1', title: 'Beach House in Calangute', subtitle: 'Seconds from the shore', location: 'Calangute', price: '₹11,000', rating: '4.93', badge: 'Beachfront', category: 'homes', image: homePhotos[1] },
      { id: 'ga2', title: 'Villa in Siolim', subtitle: 'Infinity pool + sunset views', location: 'Siolim', price: '₹24,000', rating: '4.97', badge: 'Guest favourite', category: 'homes', image: homePhotos[2] },
      { id: 'ga3', title: 'Apartment in Candolim', subtitle: 'Modern 2BR, walk to beach', location: 'Candolim', price: '₹7,800', rating: '4.81', badge: 'Sea breeze', category: 'homes', image: homePhotos[3] },
      { id: 'ga4', title: 'Cottage in Anjuna', subtitle: 'Bohemian vibes, lush garden', location: 'Anjuna', price: '₹5,500', rating: '4.76', badge: 'Chill zone', category: 'homes', image: homePhotos[4] },
      { id: 'ga5', title: 'Treehouse in Assagao', subtitle: 'Canopy living, hammock porch', location: 'Assagao', price: '₹9,200', rating: '4.88', badge: 'Unique stay', category: 'homes', image: homePhotos[5] },
      { id: 'ga6', title: 'Mansion in Porvorim', subtitle: 'Colonial estate, 8 rooms', location: 'Porvorim', price: '₹38,000', rating: '4.99', badge: 'Grand estate', category: 'homes', image: homePhotos[6] },
      { id: 'ga7', title: 'Studio in Panaji', subtitle: 'City-centre, heritage quarter', location: 'Panaji', price: '₹4,100', rating: '4.66', badge: 'City break', category: 'homes', image: homePhotos[7] },
      { id: 'ga8', title: 'Shack Villa in Morjim', subtitle: 'Turtle beach front', location: 'Morjim', price: '₹14,300', rating: '4.90', badge: 'Eco stay', category: 'homes', image: homePhotos[8] },
    ]
  }
];

export const listingsData = sections.flatMap(s => s.items);
