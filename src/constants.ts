export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  hasOptions?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  // Bakmie
  {
    id: 'bakmie-kering',
    name: 'Bakmie Kering',
    category: 'Bakmie',
    description: 'Bakmie khas Kalimantan dengan bumbu gurih dan topping lengkap.',
  },
  {
    id: 'bakmie-kuah',
    name: 'Bakmie Kuah',
    category: 'Bakmie',
    description: 'Bakmie dengan kuah kaldu hangat yang segar dan nikmat.',
  },
  {
    id: 'bakmie-goreng',
    name: 'Bakmie Goreng',
    category: 'Bakmie',
    description: 'Bakmie goreng dengan bumbu khas yang meresap sempurna.',
  },
  // Kwetiao
  {
    id: 'kwetiao-goreng',
    name: 'Kwetiao Goreng',
    category: 'Kwetiao',
    description: 'Kwetiao goreng dengan aroma smokey yang menggugah selera.',
  },
  {
    id: 'kwetiao-kering',
    name: 'Kwetiao Kering',
    category: 'Kwetiao',
    description: 'Kwetiao tanpa kuah dengan bumbu spesial.',
  },
  {
    id: 'kwetiao-kuah',
    name: 'Kwetiao Kuah',
    category: 'Kwetiao',
    description: 'Kwetiao lembut dengan kuah kaldu bening yang gurih.',
  },
  // Nasi Capcai
  {
    id: 'capcai-kering',
    name: 'Nasi Capcai Kering',
    category: 'Nasi',
    description: 'Nasi dengan tumis aneka sayuran segar khas Kalbar.',
  },
  {
    id: 'capcai-kuah',
    name: 'Nasi Capcai Kuah',
    category: 'Nasi',
    description: 'Nasi dengan sayuran segar dalam kuah kental hangat khas Kalbar.',
  },
  // Nasi
  {
    id: 'kaifon',
    name: 'Nasi Campur (Kaifon)',
    category: 'Nasi',
    description: 'Nasi campur khas Kalimantan Barat dengan aneka topping daging.',
  },
  // Minuman
  {
    id: 'jeruk-nipis',
    name: 'Jeruk Nipis',
    category: 'Minuman',
    description: 'Segar dan asam manis alami.',
    hasOptions: true
  },
  {
    id: 'teh',
    name: 'Teh',
    category: 'Minuman',
    description: 'Teh manis klasik.',
    hasOptions: true
  },
  {
    id: 'susu-kedelai',
    name: 'Susu Kedelai',
    category: 'Minuman',
    description: 'Susu kedelai murni yang menyehatkan.',
    hasOptions: true
  },
  {
    id: 'kopi',
    name: 'Kopi',
    category: 'Minuman',
    description: 'Kopi hitam mantap.',
    hasOptions: true
  },
  {
    id: 'extra-joss',
    name: 'Extra Joss',
    category: 'Minuman',
    description: 'Minuman energi untuk stamina.',
    hasOptions: true
  }
];
