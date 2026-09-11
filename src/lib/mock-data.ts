import { Professional, Service } from '@/types';

export const GEA_INFO = {
  name: "Gea Espacio de Bienestar",
  address: "Alberti 2471, Mar del Plata",
  whatsapp: "2235438952",
  instagram: "gea.espaciodebienestar",
  instagramUrl: "https://instagram.com/gea.espaciodebienestar",
  whatsappUrl: "https://wa.me/5492235438952"
};

export const GEA_SERVICES: Service[] = [
  // Masajes
  {
    id: 's_descontracturante',
    name: 'Masaje Descontracturante',
    description: 'Terapia manual intensiva para liberar contracturas y tensiones crónicas en cuello, espalda y hombros.',
    duration_minutes: 50,
    price: 38000,
    color: '#6f6181',
    is_active: true
  },
  {
    id: 's_shiroabhyanga',
    name: 'Masaje Ayurveda Shiroabhyanga',
    description: 'Masaje milenario en cabeza, cuello y hombros con aceites templados para calmar la mente y revitalizar.',
    duration_minutes: 50,
    price: 41000,
    color: '#897a9b',
    is_active: true
  },
  {
    id: 's_relajante',
    name: 'Masaje Relajante',
    description: 'Maniobras suaves y fluidas con aceites esenciales para reducir el estrés y reconectar cuerpo y mente.',
    duration_minutes: 50,
    price: 38000,
    color: '#dedfab',
    is_active: true
  },
  {
    id: 's_drenaje',
    name: 'Drenaje Linfático Manual',
    description: 'Estimulación del sistema linfático para eliminar toxinas, retención de líquidos y desinflamar.',
    duration_minutes: 50,
    price: 41000,
    color: '#585e73',
    is_active: true
  },
  {
    id: 's_deportivo',
    name: 'Masaje Deportivo',
    description: 'Preparación o descarga muscular profunda para atletas o personas con alta actividad física.',
    duration_minutes: 50,
    price: 42000,
    color: '#6f6181',
    is_active: true
  },
  {
    id: 's_facial',
    name: 'Masaje Facial',
    description: 'Estimulación de la microcirculación cutánea, relajación mandibular y efecto rejuvenecedor natural.',
    duration_minutes: 50,
    price: 37000,
    color: '#dedfab',
    is_active: true
  },
  {
    id: 's_abhyanga',
    name: 'Masaje Ayurveda Abhyanga',
    description: 'Masaje tradicional de cuerpo completo con aceites medicinales según doshas para equilibrar la energía vital.',
    duration_minutes: 50,
    price: 44000,
    color: '#897a9b',
    is_active: true
  },
  {
    id: 's_piedras',
    name: 'Masaje con Piedras Calientes',
    description: 'Termoterapia con piedras volcánicas que penetran el calor en las fibras musculares profundas.',
    duration_minutes: 50,
    price: 42000,
    color: '#585e73',
    is_active: true
  },
  {
    id: 's_tailandes',
    name: 'Masaje Tailandés',
    description: 'Presiones rítmicas a lo largo de líneas de energía combinadas con suaves estiramientos asistidos.',
    duration_minutes: 50,
    price: 44000,
    color: '#6f6181',
    is_active: true
  },
  {
    id: 's_obsidiana',
    name: 'Masaje Relajante con Obsidiana',
    description: 'Piedras de obsidiana volcánica para drenar densidades energéticas y armonizar la frecuencia corporal.',
    duration_minutes: 50,
    price: 42000,
    color: '#897a9b',
    is_active: true
  },
  {
    id: 's_bioenergetico',
    name: 'Masaje Bioenergético',
    description: 'Integración cuerpo-mente para destrabar corazas musculares y liberar emociones retenidas.',
    duration_minutes: 50,
    price: 42000,
    color: '#585e73',
    is_active: true
  },
  {
    id: 's_abdominal',
    name: 'Masaje Abdominal Profundo',
    description: 'Trabajo visceral focalizado para optimizar la digestión y liberar tensiones en el plexo solar.',
    duration_minutes: 50,
    price: 43000,
    color: '#dedfab',
    is_active: true
  },
  {
    id: 's_sonoro',
    name: 'Masaje Sonoro',
    description: 'Vibración y frecuencias armónicas con cuencos aplicados directamente sobre el cuerpo.',
    duration_minutes: 50,
    price: 40000,
    color: '#897a9b',
    is_active: true
  },
  {
    id: 's_cervicocraneal',
    name: 'Masaje Cervicocraneal',
    description: 'Alivio rápido para cefaleas tensionales, bruxismo y sobrecarga en nuca y cuello.',
    duration_minutes: 50,
    price: 39000,
    color: '#6f6181',
    is_active: true
  },

  // Terapias Holísticas
  {
    id: 's_reiki',
    name: 'Sesión de Reiki',
    description: 'Canalización de energía universal a través de las manos para armonizar los chakras y calmar el estrés.',
    duration_minutes: 50,
    price: 37000,
    color: '#897a9b',
    is_active: true
  },
  {
    id: 's_presoterapia',
    name: 'Drenaje Linfático con Botas de Presoterapia',
    description: 'Compresión neumática progresiva que mejora la circulación de retorno, pesadez en piernas y celulitis.',
    duration_minutes: 50,
    price: 45000,
    color: '#585e73',
    is_active: true
  },
  {
    id: 's_bioarmonizacion',
    name: 'Terapias de Bioarmonización Energética',
    description: 'Sintonización bioenergética integral del campo áurico y cuerpos sutiles.',
    duration_minutes: 50,
    price: 40000,
    color: '#dedfab',
    is_active: true
  },
  {
    id: 's_reflexologia',
    name: 'Reflexología Podal',
    description: 'Estímulo de zonas reflejas en los pies que conectan y equilibran todos los órganos corporales.',
    duration_minutes: 50,
    price: 38000,
    color: '#6f6181',
    is_active: true
  }
];

// Mapeo de Profesionales con sus servicios exactos según documento
export const GEA_PROFESSIONALS: Professional[] = [
  {
    id: 'p_ailin',
    name: 'Ailin',
    email: 'ailin@geaespacio.com',
    phone: '+54 9 223 543-8952',
    bio: 'Masoterapeuta y reikista. Especialista en descontracturante, linfático, facial y cervicocraneal.',
    is_active: true,
    services: GEA_SERVICES.filter(s => [
      's_descontracturante', 's_relajante', 's_drenaje', 's_facial', 's_cervicocraneal', 's_reiki'
    ].includes(s.id))
  },
  {
    id: 'p_patricia',
    name: 'Patricia',
    email: 'patricia@geaespacio.com',
    phone: '+54 9 223 543-8952',
    bio: 'Especialista en masajes descontracturantes, relajantes, drenaje linfático, piedras calientes y presoterapia.',
    is_active: true,
    services: GEA_SERVICES.filter(s => [
      's_descontracturante', 's_relajante', 's_drenaje', 's_piedras', 's_presoterapia'
    ].includes(s.id))
  },
  {
    id: 'p_sofia',
    name: 'Sofía',
    email: 'sofia@geaespacio.com',
    phone: '+54 9 223 543-8952',
    bio: 'Terapeuta corporal enfocada en relajación profunda y terapia sensorial con obsidiana.',
    is_active: true,
    services: GEA_SERVICES.filter(s => [
      's_descontracturante', 's_relajante', 's_obsidiana'
    ].includes(s.id))
  },
  {
    id: 'p_natali',
    name: 'Natali',
    email: 'natali@geaespacio.com',
    phone: '+54 9 223 543-8952',
    bio: 'Masajista corporal y facial, con formación en tratamientos ayurvédicos Abhyanga.',
    is_active: true,
    services: GEA_SERVICES.filter(s => [
      's_descontracturante', 's_relajante', 's_facial', 's_abhyanga'
    ].includes(s.id))
  },
  {
    id: 'p_celeste',
    name: 'Celeste',
    email: 'celeste@geaespacio.com',
    phone: '+54 9 223 543-8952',
    bio: 'Especialista en Medicina Ayurveda (Shiroabhyanga y Abhyanga), masaje Tailandés, bioenergético, sonoro y abdominal.',
    is_active: true,
    services: GEA_SERVICES.filter(s => [
      's_shiroabhyanga', 's_abhyanga', 's_tailandes', 's_bioenergetico', 's_abdominal', 's_sonoro'
    ].includes(s.id))
  },
  {
    id: 'p_mauro',
    name: 'Mauro',
    email: 'mauro@geaespacio.com',
    phone: '+54 9 223 543-8952',
    bio: 'Masajista deportivo. Preparación física, elongación asistida y recuperación muscular.',
    is_active: true,
    services: GEA_SERVICES.filter(s => [
      's_deportivo'
    ].includes(s.id))
  },
  {
    id: 'p_ivana',
    name: 'Ivana',
    email: 'ivana@geaespacio.com',
    phone: '+54 9 223 543-8952',
    bio: 'Terapeuta holística y canalizadora de Reiki Usui para armonización y paz interior.',
    is_active: true,
    services: GEA_SERVICES.filter(s => [
      's_reiki'
    ].includes(s.id))
  },
  {
    id: 'p_francisco',
    name: 'Francisco',
    email: 'francisco@geaespacio.com',
    phone: '+54 9 223 543-8952',
    bio: 'Facilitador de bioarmonización energética y calibración sutil.',
    is_active: true,
    services: GEA_SERVICES.filter(s => [
      's_bioarmonizacion'
    ].includes(s.id))
  }
];

// Alias para compatibilidad con código existente
export const MOCK_SERVICES = GEA_SERVICES;
export const MOCK_PROFESSIONALS = GEA_PROFESSIONALS;
