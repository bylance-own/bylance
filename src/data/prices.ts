/**
 * ============================================================================
 * 📱 BYLANCE — ДАННЫЕ ИНТЕРНЕТ-МАГАЗИНА ЭЛЕКТРОНИКИ
 * ============================================================================
 * Модели с выбором памяти и SIM, 4 способа оплаты, полный каталог.
 */
import { WEBP_IMAGES } from './productImages';

export interface StoreAddress {
  id: string;
  title: string;
  address: string;
  description: string;
  hours: string;
  isMain: boolean;
  badge: string;
  gis: string;
  phone?: string;
  phoneFormatted?: string;
}

// 1. КОНТАКТЫ МАГАЗИНА (ДВА АДРЕСА: ГЛАВНЫЙ И ВТОРОЙ ФИЛИАЛ)
export const SITE_INFO = {
  shopName: "Bylance",
  city: "Алматы",
  logoPath: "/assets/aistudio/Gemini_Generated_Image_fizavafizavafiza_cfb77561.webp",
  faviconPath: "/logo.svg",
  // Основной телефон и WhatsApp магазина: 8771-500-50-60
  whatsapp: "77715005060",
  whatsappFormatted: "+7 (771) 500-50-60",
  telegram: "bylancee",
  gis: "https://2gis.kz/almaty/firm/70000001109699711",
  // 1 адрес (Новые устройства)
  address: "г. Алматы, ул. Василия Клочкова, 119 (1 этаж)",
  addressMain: "г. Алматы, ул. Василия Клочкова, 119 (1 этаж, Бостандыкский район)",
  // 2 адрес (Б/У iPhone)
  addressSecond: "г. Алматы, 2 этаж, 20 сектор, 23 витрина",
  addresses: [
    {
      id: 'new-store',
      title: 'Магазин новых устройств',
      address: 'ул. Василия Клочкова, 119, 1 этаж (Бостандыкский район, 050057)',
      description: 'Только новые запечатанные оригинальные устройства Apple, стайлеры Dyson и гаджеты с официальной гарантией 1 год и рассрочкой.',
      hours: '10:00 – 22:00',
      isMain: true,
      badge: 'Новая техника',
      gis: 'https://2gis.kz/almaty/firm/70000001109699711',
      phone: '77715005060',
      phoneFormatted: '+7 (771) 500-50-60',
    },
    {
      id: 'used-store',
      title: 'Магазин Б/У iPhone',
      address: 'г. Алматы, 2 этаж, 20 сектор, 23 витрина',
      description: 'Проверенные б/у iPhone с гарантией, быстрая диагностика при вас и моментальный расчет за наличные или Kaspi.',
      hours: '10:00 – 21:00',
      isMain: false,
      badge: 'Б/У iPhone',
      gis: 'https://go.2gis.com/B4zZk',
      phone: '77471018395',
      phoneFormatted: '+7 747 101 8395',
    },
  ] as StoreAddress[],
  hours: "10:00 – 22:00",
  roundTo: 1000,
  founder: {
    name: "Аружан Жеткерген",
    role: "Основательница магазина Bylance",
    image: "/aruzhan_profile.webp",
    instagram: "zaagaru",
    tiktok: "_zaag_",
    shopInstagram: "bylance_kz",
  },
};

// 2. ЧЕТЫРЕ СПОСОБА ОПЛАТЫ
export type PaymentMethodId = 'kaspi' | 'halyk' | 'promo' | 'cash';

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  shortLabel: string;
  badge: string;
  description: string;
  color: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'kaspi',
    name: 'Kaspi рассрочка',
    shortLabel: 'Kaspi',
    badge: '0-0-12 / 0-0-24',
    description: 'Оформление рассрочки или кредита через Kaspi Bank',
    color: '#F14635',
  },
  {
    id: 'halyk',
    name: 'Halyk рассрочка',
    shortLabel: 'Halyk',
    badge: '0-0-12 / 0-0-24',
    description: 'Рассрочка без переплат через приложение Halyk Bank',
    color: '#008248',
  },
  {
    id: 'promo',
    name: 'Акционная цена',
    shortLabel: 'Акция',
    badge: 'Спеццена',
    description: 'Специальная сниженная цена по текущей акции магазина',
    color: '#E11D48',
  },
  {
    id: 'cash',
    name: 'Скидка за наличную оплату',
    shortLabel: 'Наличный расчёт',
    badge: 'Скидка',
    description: 'Лучшая цена при оплате наличными или прямым переводом',
    color: '#059669',
  },
];

// 3. КАТЕГОРИИ
export type MainCategory = 'apple' | 'dyson' | 'other';

export interface CategoryInfo {
  id: MainCategory;
  name: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'apple', name: 'Apple', description: 'iPhone, iPad, MacBook, AirPods, Apple Watch' },
  { id: 'dyson', name: 'Dyson', description: 'Стайлеры и выпрямители волос' },
  { id: 'other', name: 'Фото и гаджеты', description: 'Фотокамеры, Ray-Ban Meta, DJI, Яндекс Станция' },
];

export interface VariantPrices {
  kaspi: number | null;
  halyk: number | null;
  promo: number | null;
  cash: number | null;
}

// ВАРИАНТ ТОВАРА
export interface ProductVariant {
  id: string;
  fullName: string;
  simType?: 'ESIM' | 'SIM';
  storage?: string;
  size?: string;
  prices: VariantPrices;
  colorPrices?: Record<string, VariantPrices>;
}

export function getVariantPrices(variant: ProductVariant, colorId?: string): VariantPrices {
  if (colorId && variant.colorPrices && variant.colorPrices[colorId]) {
    return variant.colorPrices[colorId];
  }
  return variant.prices;
}

// ЦВЕТ ТОВАРА (с мини-картинкой и плашкой)
export interface ProductColor {
  id: string;
  name: string;
  image: string;
  hex?: string;
}

// ГОТОВЫЕ ЦВЕТОВЫЕ НАБОРЫ (пользователь может менять картинки на свои в любое время)
// ГОТОВЫЕ ЦВЕТОВЫЕ НАБОРЫ С ПОДДЕРЖКОЙ WEBP ИЗОБРАЖЕНИЙ
export const IPHONE_18_PRO_COLORS: ProductColor[] = [
  { id: 'burgundy', name: 'Burgundy (Бургунди/Бордовый)', hex: '#7a0f2d', image: WEBP_IMAGES.iphone18ProRed },
  { id: 'glacier', name: 'Glacier (Светло-голубой)', hex: '#8fb8d8', image: WEBP_IMAGES.iphone18ProBlue },
  { id: 'silver', name: 'Silver (Серебристый)', hex: '#e3e4e6', image: WEBP_IMAGES.iphone18ProSilver },
  { id: 'black', name: 'Black (Чёрный)', hex: '#212124', image: WEBP_IMAGES.iphone18ProBlack },
];

export const IPHONE_17_COLORS: ProductColor[] = [
  { id: 'lavender', name: 'Lavender (Лавандовый)', hex: '#b8a8d8', image: WEBP_IMAGES.iphone17Purple },
  { id: 'sage', name: 'Sage (Зелёный шалфей)', hex: '#7c9684', image: WEBP_IMAGES.iphone17Green },
  { id: 'mist-blue', name: 'Mist Blue (Дымчато-голубой)', hex: '#7e9cb8', image: WEBP_IMAGES.iphone17Blue },
  { id: 'white', name: 'White (Белый)', hex: '#f7f7f9', image: WEBP_IMAGES.iphone17White },
  { id: 'black', name: 'Black (Чёрный)', hex: '#222326', image: WEBP_IMAGES.iphone17Black },
];

export const IPHONE_17_PRO_COLORS: ProductColor[] = [
  { id: 'cosmic-orange', name: 'Cosmic Orange (Космический оранжевый)', hex: '#d96c34', image: WEBP_IMAGES.iphone17ProOrange },
  { id: 'deep-blue', name: 'Deep Blue (Глубокий синий)', hex: '#24374e', image: WEBP_IMAGES.iphone17ProBlue },
  { id: 'silver', name: 'Silver (Серебристый)', hex: '#e3e4e6', image: WEBP_IMAGES.iphone17ProWhite },
];

export const IPHONE_A16_COLORS: ProductColor[] = [
  { id: 'lightblue', name: 'Light Blue (Голубой)', hex: '#97bfdf', image: WEBP_IMAGES.iphoneA16LightBlue },
  { id: 'pink', name: 'Pink (Розовый)', hex: '#e7a9b6', image: WEBP_IMAGES.iphoneA16Pink },
  { id: 'silver', name: 'Silver (Серебристый)', hex: '#e2e3e5', image: WEBP_IMAGES.iphoneA16Silver },
  { id: 'yellow', name: 'Yellow (Лимонный)', hex: '#edd362', image: WEBP_IMAGES.iphoneA16Yellow },
];

export const IPHONE_DUO_COLORS: ProductColor[] = [
  { id: 'blue', name: 'Deep Blue (Глубокий синий)', hex: '#1e324f', image: WEBP_IMAGES.iphoneDuoBlue },
  { id: 'white', name: 'Pure White (Белоснежный)', hex: '#ffffff', image: WEBP_IMAGES.iphoneDuoWhite },
];

export const IPAD_AIR_M4_COLORS: ProductColor[] = [
  { id: 'blue', name: 'Blue (Синий)', hex: '#899ab0', image: WEBP_IMAGES.ipadAirBlue },
  { id: 'purple', name: 'Purple (Фиолетовый)', hex: '#b8b1ca', image: WEBP_IMAGES.ipadAirPurple },
  { id: 'space-gray', name: 'Space Gray (Серый космос)', hex: '#6e6f73', image: WEBP_IMAGES.ipadAirSpaceGray },
  { id: 'starlight', name: 'Starlight (Сияющая звезда)', hex: '#e5e0d8', image: WEBP_IMAGES.ipadAirStarlight },
];

export const MACBOOK_AIR_M5_COLORS: ProductColor[] = [
  { id: 'blue', name: 'Midnight Blue (Тёмно-синий)', hex: '#263445', image: WEBP_IMAGES.macbookAirBlue },
  { id: 'golden', name: 'Starlight Gold (Золотистый)', hex: '#e9dfcc', image: WEBP_IMAGES.macbookAirGolden },
  { id: 'lightblue', name: 'Sky Blue (Небесный)', hex: '#b0c5da', image: WEBP_IMAGES.macbookAirLightBlue },
  { id: 'silver', name: 'Silver (Серебристый)', hex: '#e2e3e5', image: WEBP_IMAGES.macbookAirSilver },
];

export const MACBOOK_NEO_COLORS: ProductColor[] = [
  { id: 'blue', name: 'Neo Blue (Нео-синий)', hex: '#314a6b', image: WEBP_IMAGES.macbookNeoBlue },
  { id: 'pink', name: 'Neo Pink (Нео-розовый)', hex: '#df9fae', image: WEBP_IMAGES.macbookNeoPink },
  { id: 'silver', name: 'Neo Silver (Серебристый)', hex: '#e1e2e4', image: WEBP_IMAGES.macbookNeoSilver },
  { id: 'yellow', name: 'Neo Yellow (Солнечный)', hex: '#e8cd5e', image: WEBP_IMAGES.macbookNeoYellow },
];

export const WATCH_11_COLORS: ProductColor[] = [
  { id: 'black', name: 'Jet Black (Глянцевый чёрный)', hex: '#1a1a1a', image: WEBP_IMAGES.watch11Black },
  { id: 'grey', name: 'Space Grey (Космический серый)', hex: '#58595b', image: WEBP_IMAGES.watch11Grey },
  { id: 'pink', name: 'Rose Pink (Розовый)', hex: '#e8b8b8', image: WEBP_IMAGES.watch11Pink },
  { id: 'silver', name: 'Silver (Серебристый)', hex: '#e2e3e5', image: WEBP_IMAGES.watch11Silver },
];

export const WATCH_SE_COLORS: ProductColor[] = [
  { id: 'black', name: 'Midnight Black (Тёмная ночь)', hex: '#1f2022', image: WEBP_IMAGES.watchSe40Black },
  { id: 'golden', name: 'Starlight Gold (Сияющая звезда)', hex: '#e6ded3', image: WEBP_IMAGES.watchSe40Golden },
];

export const IPHONE_PRO_COLORS: ProductColor[] = IPHONE_18_PRO_COLORS;
export const IPHONE_BASE_COLORS: ProductColor[] = IPHONE_17_COLORS;
export const IPAD_COLORS: ProductColor[] = IPAD_AIR_M4_COLORS;
export const MACBOOK_COLORS: ProductColor[] = MACBOOK_AIR_M5_COLORS;
export const WATCH_COLORS: ProductColor[] = WATCH_11_COLORS;

export const DYSON_COLOR_CERAMIC_PINK: ProductColor = { id: 'ceramic-pink', name: 'Ceramic Pink (Керамический розовый)', hex: '#dfa8a8', image: WEBP_IMAGES.dysonAirwrapCeramicPink };
export const DYSON_COLOR_PRUSSIAN_BLUE: ProductColor = { id: 'prussian-blue', name: 'Prussian Blue (Синий индиго)', hex: '#26384a', image: WEBP_IMAGES.dysonAirwrapPrussianBlue };
export const DYSON_COLOR_RED_VELVET: ProductColor = { id: 'red-velvet', name: 'Red Velvet (Красный бархат)', hex: '#7a0f2d', image: WEBP_IMAGES.dysonAirwrapRedVelvet };
export const DYSON_COLOR_JASPER_PLUM: ProductColor = { id: 'jasper-plum', name: 'Jasper Plum (Яшмовая слива)', hex: '#582f42', image: WEBP_IMAGES.dysonCoandaJasperPlum };
export const DYSON_COLOR_CHOCOLATE: ProductColor = { id: 'chocolate', name: 'Chocolate (Шоколадный)', hex: '#5b3428', image: WEBP_IMAGES.dysonAirwrapChocolate };

// МОДЕЛЬ ТОВАРА (ГРУППА С ВЫБОРОМ ПАМЯТИ/SIM/ЦВЕТА)
export interface ProductModel {
  id: string;
  name: string;
  subtitle?: string;
  category: MainCategory;
  subcategory: string;
  badge?: string; // Никакого "Топ продаж" над телефонами!
  warranty: string;
  image: string;
  colorOptions?: ProductColor[];
  simOptions?: ('ESIM' | 'SIM')[];
  storageOptions?: string[];
  sizeOptions?: string[];
  variants: ProductVariant[];
}

export const PRODUCT_MODELS: ProductModel[] = [
  // ==========================================
  // 1. IPHONE 18 PRO
  // ==========================================
  {
    id: 'model-ip18p',
    name: 'iPhone 18 Pro',
    category: 'apple',
    subcategory: 'iPhone 18',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.iphone18Pro,
    colorOptions: IPHONE_18_PRO_COLORS,
    simOptions: ['ESIM', 'SIM'],
    storageOptions: ['256 ГБ', '512 ГБ', '1 ТБ'],
    variants: [
      {
        id: '18-pro-esim-256',
        fullName: 'iPhone 18 Pro (ESIM) 256 ГБ',
        simType: 'ESIM',
        storage: '256 ГБ',
        prices: { kaspi: 864000, halyk: 900000, promo: 750000, cash: 720000 },
        colorPrices: {
          burgundy: { kaspi: 900000, halyk: 937500, promo: 781200, cash: 750000 },
          red: { kaspi: 900000, halyk: 937500, promo: 781200, cash: 750000 },
        },
      },
      {
        id: '18-pro-esim-512',
        fullName: 'iPhone 18 Pro (ESIM) 512 ГБ',
        simType: 'ESIM',
        storage: '512 ГБ',
        prices: { kaspi: 996000, halyk: 1037500, promo: 864000, cash: 830000 },
        colorPrices: {
          burgundy: { kaspi: 1032000, halyk: 1075000, promo: 895200, cash: 860000 },
          red: { kaspi: 1032000, halyk: 1075000, promo: 895200, cash: 860000 },
        },
      },
      {
        id: '18-pro-esim-1tb',
        fullName: 'iPhone 18 Pro (ESIM) 1 ТБ',
        simType: 'ESIM',
        storage: '1 ТБ',
        prices: { kaspi: 1260000, halyk: 1312500, promo: 1092000, cash: 1050000 },
        colorPrices: {
          burgundy: { kaspi: 1296000, halyk: 1350000, promo: 1123200, cash: 1080000 },
          red: { kaspi: 1296000, halyk: 1350000, promo: 1123200, cash: 1080000 },
        },
      },
      {
        id: '18-pro-sim-256',
        fullName: 'iPhone 18 Pro (SIM) 256 ГБ',
        simType: 'SIM',
        storage: '256 ГБ',
        prices: { kaspi: 900000, halyk: 937500, promo: 780000, cash: 750000 },
        colorPrices: {
          burgundy: { kaspi: 936000, halyk: 975000, promo: 811200, cash: 780000 },
          red: { kaspi: 936000, halyk: 975000, promo: 811200, cash: 780000 },
        },
      },
      {
        id: '18-pro-sim-512',
        fullName: 'iPhone 18 Pro (SIM) 512 ГБ',
        simType: 'SIM',
        storage: '512 ГБ',
        prices: { kaspi: 1044000, halyk: 1087500, promo: 905000, cash: 870000 },
        colorPrices: {
          burgundy: { kaspi: 1116000, halyk: 1162500, promo: 967200, cash: 930000 },
          red: { kaspi: 1116000, halyk: 1162500, promo: 967200, cash: 930000 },
        },
      },
      {
        id: '18-pro-sim-1tb',
        fullName: 'iPhone 18 Pro (SIM) 1 ТБ',
        simType: 'SIM',
        storage: '1 ТБ',
        prices: { kaspi: 1320000, halyk: 1375000, promo: 1144000, cash: 1100000 },
        colorPrices: {
          burgundy: { kaspi: 1356000, halyk: 1412500, promo: 1175200, cash: 1130000 },
          red: { kaspi: 1356000, halyk: 1412500, promo: 1175200, cash: 1130000 },
        },
      },
    ],
  },

  // ==========================================
  // 2. IPHONE 18 PRO MAX
  // ==========================================
  {
    id: 'model-ip18pm',
    name: 'iPhone 18 Pro Max',
    category: 'apple',
    subcategory: 'iPhone 18',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.iphone18Pro,
    colorOptions: IPHONE_18_PRO_COLORS,
    simOptions: ['ESIM', 'SIM'],
    storageOptions: ['256 ГБ', '512 ГБ', '1 ТБ', '2 ТБ'],
    variants: [
      {
        id: '18-pm-esim-256',
        fullName: 'iPhone 18 Pro Max (ESIM) 256 ГБ',
        simType: 'ESIM',
        storage: '256 ГБ',
        prices: { kaspi: 984000, halyk: 1025000, promo: 853000, cash: 820000 },
        colorPrices: {
          burgundy: { kaspi: 1020000, halyk: 1062500, promo: 884200, cash: 850000 },
          red: { kaspi: 1020000, halyk: 1062500, promo: 884200, cash: 850000 },
        },
      },
      {
        id: '18-pm-esim-512',
        fullName: 'iPhone 18 Pro Max (ESIM) 512 ГБ',
        simType: 'ESIM',
        storage: '512 ГБ',
        prices: { kaspi: 1164000, halyk: 1212500, promo: 1010000, cash: 970000 },
        colorPrices: {
          burgundy: { kaspi: 1200000, halyk: 1250000, promo: 1041200, cash: 1000000 },
          red: { kaspi: 1200000, halyk: 1250000, promo: 1041200, cash: 1000000 },
        },
      },
      {
        id: '18-pm-esim-1tb',
        fullName: 'iPhone 18 Pro Max (ESIM) 1 ТБ',
        simType: 'ESIM',
        storage: '1 ТБ',
        prices: { kaspi: 1416000, halyk: 1475000, promo: 1248000, cash: 1180000 },
        colorPrices: {
          burgundy: { kaspi: 1457000, halyk: 1512500, promo: 1279200, cash: 1210000 },
          red: { kaspi: 1457000, halyk: 1512500, promo: 1279200, cash: 1210000 },
        },
      },
      {
        id: '18-pm-esim-2tb',
        fullName: 'iPhone 18 Pro Max (ESIM) 2 ТБ',
        simType: 'ESIM',
        storage: '2 ТБ',
        prices: { kaspi: 1680000, halyk: 1750000, promo: 1456000, cash: 1400000 },
        colorPrices: {
          burgundy: { kaspi: 1716000, halyk: 1787500, promo: 1487200, cash: 1430000 },
          red: { kaspi: 1716000, halyk: 1787500, promo: 1487200, cash: 1430000 },
        },
      },
      {
        id: '18-pm-sim-256',
        fullName: 'iPhone 18 Pro Max (SIM) 256 ГБ',
        simType: 'SIM',
        storage: '256 ГБ',
        prices: { kaspi: 1020000, halyk: 1062500, promo: 884000, cash: 850000 },
        colorPrices: {
          burgundy: { kaspi: 1056000, halyk: 1100000, promo: 915200, cash: 880000 },
          red: { kaspi: 1056000, halyk: 1100000, promo: 915200, cash: 880000 },
        },
      },
      {
        id: '18-pm-sim-512',
        fullName: 'iPhone 18 Pro Max (SIM) 512 ГБ',
        simType: 'SIM',
        storage: '512 ГБ',
        prices: { kaspi: 1200000, halyk: 1250000, promo: 1040000, cash: 1000000 },
        colorPrices: {
          burgundy: { kaspi: 1236000, halyk: 1287500, promo: 1071200, cash: 1030000 },
          red: { kaspi: 1236000, halyk: 1287500, promo: 1071200, cash: 1030000 },
        },
      },
      {
        id: '18-pm-sim-1tb',
        fullName: 'iPhone 18 Pro Max (SIM) 1 ТБ',
        simType: 'SIM',
        storage: '1 ТБ',
        prices: { kaspi: 1500000, halyk: 1562500, promo: 1300000, cash: 1250000 },
        colorPrices: {
          burgundy: { kaspi: 1536000, halyk: 1600000, promo: 1331200, cash: 1280000 },
          red: { kaspi: 1536000, halyk: 1600000, promo: 1331200, cash: 1280000 },
        },
      },
      {
        id: '18-pm-sim-2tb',
        fullName: 'iPhone 18 Pro Max (SIM) 2 ТБ',
        simType: 'SIM',
        storage: '2 ТБ',
        prices: { kaspi: 1800000, halyk: 1875000, promo: 1560000, cash: 1500000 },
        colorPrices: {
          burgundy: { kaspi: 1836000, halyk: 1912500, promo: 1591200, cash: 1530000 },
          red: { kaspi: 1836000, halyk: 1912500, promo: 1591200, cash: 1530000 },
        },
      },
    ],
  },

  // ==========================================
  // 3. IPHONE DUO
  // ==========================================
  {
    id: 'model-ip-duo',
    name: 'iPhone DUO',
    category: 'apple',
    subcategory: 'iPhone Duo',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.iphoneDuoBlue,
    colorOptions: IPHONE_DUO_COLORS,
    storageOptions: ['256 ГБ', '512 ГБ', '1 ТБ'],
    variants: [
      {
        id: 'duo-256',
        fullName: 'iPhone DUO 256 ГБ',
        storage: '256 ГБ',
        prices: { kaspi: 1500000, halyk: 1562500, promo: 1300000, cash: 1250000 },
      },
      {
        id: 'duo-512',
        fullName: 'iPhone DUO 512 ГБ',
        storage: '512 ГБ',
        prices: { kaspi: 1680000, halyk: 1750000, promo: 1456000, cash: 1400000 },
      },
      {
        id: 'duo-1tb',
        fullName: 'iPhone DUO 1 ТБ',
        storage: '1 ТБ',
        prices: { kaspi: 2220000, halyk: 2312500, promo: 1924000, cash: 1850000 },
      },
    ],
  },

  // ==========================================
  // 4. IPHONE 17
  // ==========================================
  {
    id: 'model-ip17',
    name: 'iPhone 17',
    category: 'apple',
    subcategory: 'iPhone 17',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.iphone17Purple,
    colorOptions: IPHONE_17_COLORS,
    simOptions: ['ESIM', 'SIM'],
    storageOptions: ['256 ГБ'],
    variants: [
      {
        id: '17-esim-256',
        fullName: 'iPhone 17 (ESIM) 256 ГБ',
        simType: 'ESIM',
        storage: '256 ГБ',
        prices: { kaspi: 600000, halyk: 625000, promo: 520000, cash: 500000 },
      },
      {
        id: '17-sim-256',
        fullName: 'iPhone 17 (SIM) 256 ГБ',
        simType: 'SIM',
        storage: '256 ГБ',
        prices: { kaspi: 600000, halyk: 625000, promo: 520000, cash: 500000 },
      },
    ],
  },

  // ==========================================
  // 5. IPHONE 17 PRO
  // ==========================================
  {
    id: 'model-ip17p',
    name: 'iPhone 17 Pro',
    category: 'apple',
    subcategory: 'iPhone 17',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.iphone17ProOrange,
    colorOptions: IPHONE_17_PRO_COLORS,
    simOptions: ['ESIM', 'SIM'],
    storageOptions: ['256 ГБ', '512 ГБ', '1 ТБ'],
    variants: [
      {
        id: '17-p-esim-256',
        fullName: 'iPhone 17 Pro (ESIM) 256 ГБ',
        simType: 'ESIM',
        storage: '256 ГБ',
        prices: { kaspi: 720000, halyk: 750000, promo: 624000, cash: 600000 },
      },
      {
        id: '17-p-esim-512',
        fullName: 'iPhone 17 Pro (ESIM) 512 ГБ',
        simType: 'ESIM',
        storage: '512 ГБ',
        prices: { kaspi: 864000, halyk: 900000, promo: 748000, cash: 720000 },
      },
      {
        id: '17-p-esim-1tb',
        fullName: 'iPhone 17 Pro (ESIM) 1 ТБ',
        simType: 'ESIM',
        storage: '1 ТБ',
        prices: { kaspi: 984000, halyk: 1025000, promo: 852000, cash: 820000 },
      },
      {
        id: '17-p-sim-256',
        fullName: 'iPhone 17 Pro (SIM) 256 ГБ',
        simType: 'SIM',
        storage: '256 ГБ',
        prices: { kaspi: 804000, halyk: 837500, promo: 697000, cash: 670000 },
      },
      {
        id: '17-p-sim-512',
        fullName: 'iPhone 17 Pro (SIM) 512 ГБ',
        simType: 'SIM',
        storage: '512 ГБ',
        prices: { kaspi: 960000, halyk: 1000000, promo: 832000, cash: 800000 },
      },
      {
        id: '17-p-sim-1tb',
        fullName: 'iPhone 17 Pro (SIM) 1 ТБ',
        simType: 'SIM',
        storage: '1 ТБ',
        prices: { kaspi: 1104000, halyk: 1150000, promo: 957000, cash: 920000 },
      },
    ],
  },

  // ==========================================
  // 6. IPHONE 17 PRO MAX
  // ==========================================
  {
    id: 'model-ip17pm',
    name: 'iPhone 17 Pro Max',
    category: 'apple',
    subcategory: 'iPhone 17',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.iphone17ProOrange,
    colorOptions: IPHONE_17_PRO_COLORS,
    simOptions: ['ESIM', 'SIM'],
    storageOptions: ['256 ГБ', '512 ГБ', '1 ТБ', '2 ТБ'],
    variants: [
      {
        id: '17-pm-esim-256',
        fullName: 'iPhone 17 Pro Max (ESIM) 256 ГБ',
        simType: 'ESIM',
        storage: '256 ГБ',
        prices: { kaspi: 780000, halyk: 812500, promo: 676000, cash: 650000 },
      },
      {
        id: '17-pm-esim-512',
        fullName: 'iPhone 17 Pro Max (ESIM) 512 ГБ',
        simType: 'ESIM',
        storage: '512 ГБ',
        prices: { kaspi: 900000, halyk: 937500, promo: 780000, cash: 750000 },
      },
      {
        id: '17-pm-esim-1tb',
        fullName: 'iPhone 17 Pro Max (ESIM) 1 ТБ',
        simType: 'ESIM',
        storage: '1 ТБ',
        prices: { kaspi: 1020000, halyk: 1062500, promo: 884000, cash: 850000 },
      },
      {
        id: '17-pm-esim-2tb',
        fullName: 'iPhone 17 Pro Max (ESIM) 2 ТБ',
        simType: 'ESIM',
        storage: '2 ТБ',
        prices: { kaspi: null, halyk: null, promo: null, cash: null },
      },
      {
        id: '17-pm-sim-256',
        fullName: 'iPhone 17 Pro Max (SIM) 256 ГБ',
        simType: 'SIM',
        storage: '256 ГБ',
        prices: { kaspi: 840000, halyk: 875000, promo: 728000, cash: 700000 },
      },
      {
        id: '17-pm-sim-512',
        fullName: 'iPhone 17 Pro Max (SIM) 512 ГБ',
        simType: 'SIM',
        storage: '512 ГБ',
        prices: { kaspi: 984000, halyk: 1025000, promo: 853000, cash: 820000 },
      },
      {
        id: '17-pm-sim-1tb',
        fullName: 'iPhone 17 Pro Max (SIM) 1 ТБ',
        simType: 'SIM',
        storage: '1 ТБ',
        prices: { kaspi: 1104000, halyk: 1150000, promo: 957000, cash: 920000 },
      },
      {
        id: '17-pm-sim-2tb',
        fullName: 'iPhone 17 Pro Max (SIM) 2 ТБ',
        simType: 'SIM',
        storage: '2 ТБ',
        prices: { kaspi: 1224000, halyk: 1275000, promo: 1061000, cash: 1020000 },
      },
    ],
  },

  // ==========================================
  // 7. IPAD A16
  // ==========================================
  {
    id: 'model-ipad-a16',
    name: 'iPad A16',
    category: 'apple',
    subcategory: 'iPad',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.iphoneA16LightBlue,
    colorOptions: IPHONE_A16_COLORS,
    storageOptions: ['128 ГБ', '256 ГБ'],
    variants: [
      {
        id: 'ipad-a16-128',
        fullName: 'iPad A16 128 ГБ',
        storage: '128 ГБ',
        prices: { kaspi: 300000, halyk: 312500, promo: 260000, cash: 250000 },
      },
      {
        id: 'ipad-a16-256',
        fullName: 'iPad A16 256 ГБ',
        storage: '256 ГБ',
        prices: { kaspi: 360000, halyk: 375000, promo: 312000, cash: 300000 },
      },
    ],
  },

  // ==========================================
  // 8. IPAD AIR 11 M4 (2026)
  // ==========================================
  {
    id: 'model-ipad-air-m4',
    name: 'iPad Air 11 M4 (2026)',
    category: 'apple',
    subcategory: 'iPad',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.ipadAirSpaceGray,
    colorOptions: IPAD_AIR_M4_COLORS,
    storageOptions: ['128 ГБ', '256 ГБ'],
    variants: [
      {
        id: 'ipad-air11-m4-128',
        fullName: 'iPad Air 11 M4 (2026) 128 ГБ',
        storage: '128 ГБ',
        prices: { kaspi: 480000, halyk: 500000, promo: 416000, cash: 400000 },
      },
      {
        id: 'ipad-air11-m4-256',
        fullName: 'iPad Air 11 M4 (2026) 256 ГБ',
        storage: '256 ГБ',
        prices: { kaspi: 540000, halyk: 562500, promo: 468000, cash: 450000 },
      },
    ],
  },

  // ==========================================
  // 9. MACBOOK NEO 13
  // ==========================================
  {
    id: 'model-mb-neo13',
    name: 'MacBook Neo 13',
    category: 'apple',
    subcategory: 'MacBook',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.macbookNeoSilver,
    colorOptions: MACBOOK_NEO_COLORS,
    storageOptions: ['256 ГБ', '512 ГБ'],
    variants: [
      {
        id: 'mb-neo13-256',
        fullName: 'MacBook Neo 13 256 ГБ',
        storage: '256 ГБ',
        prices: { kaspi: 480000, halyk: 500000, promo: 416000, cash: 400000 },
      },
      {
        id: 'mb-neo13-512',
        fullName: 'MacBook Neo 13 512 ГБ',
        storage: '512 ГБ',
        prices: { kaspi: 540000, halyk: 562500, promo: 468000, cash: 450000 },
      },
    ],
  },

  // ==========================================
  // 10. MACBOOK AIR 13 M5 (2026)
  // ==========================================
  {
    id: 'model-mb-air13-m5',
    name: 'MacBook Air 13 M5 (2026)',
    category: 'apple',
    subcategory: 'MacBook',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.macbookAirSilver,
    colorOptions: MACBOOK_AIR_M5_COLORS,
    storageOptions: ['512 ГБ'],
    variants: [
      {
        id: 'mb-air13-m5-512',
        fullName: 'MacBook Air 13 M5 (2026) 512 ГБ',
        storage: '512 ГБ',
        prices: { kaspi: 876000, halyk: 912500, promo: 760000, cash: 730000 },
      },
    ],
  },

  // ==========================================
  // 11. AIRPODS 4 (БАЗОВЫЙ)
  // ==========================================
  {
    id: 'model-airpods-4',
    name: 'AirPods 4 (базовый)',
    category: 'apple',
    subcategory: 'AirPods',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.airpods4,
    variants: [
      {
        id: 'airpods-4-base',
        fullName: 'AirPods 4 (базовый)',
        prices: { kaspi: 72000, halyk: 75000, promo: 63000, cash: 60000 },
      },
    ],
  },

  // ==========================================
  // 12. AIRPODS 5
  // ==========================================
  {
    id: 'model-airpods-5',
    name: 'AirPods 5',
    category: 'apple',
    subcategory: 'AirPods',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.airpods5,
    variants: [
      {
        id: 'airpods-5',
        fullName: 'AirPods 5',
        prices: { kaspi: 102000, halyk: 106250, promo: 88000, cash: 85000 },
      },
    ],
  },

  // ==========================================
  // 13. AIRPODS 5 С БЕСПРОВОДНОЙ ЗАРЯДКОЙ
  // ==========================================
  {
    id: 'model-airpods-5-wireless',
    name: 'AirPods 5 с беспроводной зарядкой',
    category: 'apple',
    subcategory: 'AirPods',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.airpods5,
    variants: [
      {
        id: 'airpods-5-wireless',
        fullName: 'AirPods 5 с беспроводной зарядкой',
        prices: { kaspi: 120000, halyk: 125000, promo: 104000, cash: 100000 },
      },
    ],
  },

  // ==========================================
  // 14. AIRPODS PRO
  // ==========================================
  {
    id: 'model-airpods-pro',
    name: 'AirPods Pro',
    category: 'apple',
    subcategory: 'AirPods',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.airpodsPro,
    variants: [
      {
        id: 'airpods-pro',
        fullName: 'AirPods Pro',
        prices: { kaspi: 140400, halyk: 146250, promo: 120000, cash: 117000 },
      },
    ],
  },

  // ==========================================
  // 15. APPLE WATCH SERIES 11
  // ==========================================
  {
    id: 'model-aw-11',
    name: 'Apple Watch Series 11',
    category: 'apple',
    subcategory: 'Apple Watch',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.watch11Black,
    colorOptions: WATCH_11_COLORS,
    sizeOptions: ['42 мм', '46 мм'],
    variants: [
      {
        id: 'aw-11-42',
        fullName: 'Apple Watch Series 11 (42 мм)',
        size: '42 мм',
        prices: { kaspi: 210000, halyk: 218750, promo: 182000, cash: 175000 },
      },
      {
        id: 'aw-11-46',
        fullName: 'Apple Watch Series 11 (46 мм)',
        size: '46 мм',
        prices: { kaspi: 240000, halyk: 250000, promo: 208000, cash: 200000 },
      },
    ],
  },

  // ==========================================
  // 16. APPLE WATCH SE
  // ==========================================
  {
    id: 'model-aw-se',
    name: 'Apple Watch SE',
    category: 'apple',
    subcategory: 'Apple Watch',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.watchSe40Black,
    colorOptions: WATCH_SE_COLORS,
    sizeOptions: ['40 мм', '44 мм'],
    variants: [
      {
        id: 'aw-se-40',
        fullName: 'Apple Watch SE (40 мм)',
        size: '40 мм',
        prices: { kaspi: 168000, halyk: 175000, promo: 146000, cash: 140000 },
      },
      {
        id: 'aw-se-44',
        fullName: 'Apple Watch SE (44 мм)',
        size: '44 мм',
        prices: { kaspi: 192000, halyk: 200000, promo: 167000, cash: 160000 },
      },
    ],
  },

  // ==========================================
  // 17. DYSON AIRSTRAIT HT01
  // ==========================================
  {
    id: 'model-dyson-ht01',
    name: 'Dyson HT01 Airstrait',
    category: 'dyson',
    subcategory: 'Airstrait HT01',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.dysonAirstraitCeramicPink,
    colorOptions: [
      { id: 'ceramic-pink', name: 'Ceramic Pink (Керамический розовый)', hex: '#dfa8a8', image: WEBP_IMAGES.dysonAirstraitCeramicPink },
      { id: 'chocolate', name: 'Chocolate (Шоколадный)', hex: '#5b3428', image: WEBP_IMAGES.dysonAirstraitChocolate },
    ],
    variants: [
      {
        id: 'dyson-ht01',
        fullName: 'Dyson HT01 Airstrait',
        prices: { kaspi: 270000, halyk: 281250, promo: 235000, cash: 225000 },
      },
    ],
  },

  // ==========================================
  // 18. DYSON AIRWRAP HS08
  // ==========================================
  {
    id: 'model-dyson-hs08-blue',
    name: 'Dyson HS08 Airwrap Prussian Blue',
    category: 'dyson',
    subcategory: 'Airwrap HS08',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.dysonAirwrapPrussianBlue,
    colorOptions: [DYSON_COLOR_PRUSSIAN_BLUE],
    variants: [
      {
        id: 'dyson-hs08-blue',
        fullName: 'Dyson HS08 Airwrap Prussian Blue',
        prices: { kaspi: 318000, halyk: 331250, promo: 275000, cash: 265000 },
      },
    ],
  },
  {
    id: 'model-dyson-hs08-pink',
    name: 'Dyson HS08 Airwrap Ceramic Pink',
    category: 'dyson',
    subcategory: 'Airwrap HS08',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.dysonAirwrapCeramicPink,
    colorOptions: [DYSON_COLOR_CERAMIC_PINK],
    variants: [
      {
        id: 'dyson-hs08-pink',
        fullName: 'Dyson HS08 Airwrap Ceramic Pink',
        prices: { kaspi: 318000, halyk: 331250, promo: 275000, cash: 265000 },
      },
    ],
  },
  {
    id: 'model-dyson-hs08-red',
    name: 'Dyson HS08 Airwrap Red Velvet',
    category: 'dyson',
    subcategory: 'Airwrap HS08',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.dysonAirwrapRedVelvet,
    colorOptions: [DYSON_COLOR_RED_VELVET],
    variants: [
      {
        id: 'dyson-hs08-red',
        fullName: 'Dyson HS08 Airwrap Red Velvet',
        prices: { kaspi: 330000, halyk: 343750, promo: 285000, cash: 275000 },
      },
    ],
  },
  {
    id: 'model-dyson-hs08-chocolate',
    name: 'Dyson HS08 Airwrap Chocolate',
    category: 'dyson',
    subcategory: 'Airwrap HS08',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.dysonAirwrapChocolate,
    colorOptions: [DYSON_COLOR_CHOCOLATE],
    variants: [
      {
        id: 'dyson-hs08-chocolate',
        fullName: 'Dyson HS08 Airwrap Chocolate',
        prices: { kaspi: 330000, halyk: 343750, promo: 285000, cash: 275000 },
      },
    ],
  },

  // ==========================================
  // 19. DYSON AIRWRAP HS09 CO-ANDA
  // ==========================================
  {
    id: 'model-dyson-hs09-base-chocolate',
    name: 'Dyson HS09 Co-anda Chocolate',
    category: 'dyson',
    subcategory: 'Airwrap HS09',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.dysonCoandaChocolate,
    colorOptions: [{ ...DYSON_COLOR_CHOCOLATE, image: WEBP_IMAGES.dysonCoandaChocolate }],
    variants: [
      {
        id: 'dyson-hs09-base-chocolate',
        fullName: 'Dyson HS09 Co-anda Chocolate',
        prices: { kaspi: 408000, halyk: 425000, promo: 350000, cash: 340000 },
      },
    ],
  },

  // ==========================================
  // 20. DYSON AIRWRAP HS09 CO-ANDA (НОВЫЙ)
  // ==========================================
  {
    id: 'model-dyson-hs09-new-pink',
    name: 'Dyson HS09 Co-anda (новый) Ceramic Pink',
    category: 'dyson',
    subcategory: 'Airwrap HS09 (Новый)',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.dysonCoandaCeramicPink,
    colorOptions: [{ ...DYSON_COLOR_CERAMIC_PINK, image: WEBP_IMAGES.dysonCoandaCeramicPink }],
    variants: [
      {
        id: 'dyson-hs09-new-pink',
        fullName: 'Dyson HS09 Co-anda (новый) Ceramic Pink',
        prices: { kaspi: 408000, halyk: 425000, promo: 350000, cash: 340000 },
      },
    ],
  },
  {
    id: 'model-dyson-hs09-new-plum',
    name: 'Dyson HS09 Co-anda (новый) Jasper Plum',
    category: 'dyson',
    subcategory: 'Airwrap HS09 (Новый)',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.dysonCoandaJasperPlum,
    colorOptions: [{ ...DYSON_COLOR_JASPER_PLUM, image: WEBP_IMAGES.dysonCoandaJasperPlum }],
    variants: [
      {
        id: 'dyson-hs09-new-plum',
        fullName: 'Dyson HS09 Co-anda (новый) Jasper Plum',
        prices: { kaspi: 408000, halyk: 425000, promo: 350000, cash: 340000 },
      },
    ],
  },

  // ==========================================
  // 20B. DYSON CORRALE
  // ==========================================
  {
    id: 'model-dyson-corrale-plum',
    name: 'Dyson Corrale Jasper Plum',
    category: 'dyson',
    subcategory: 'Corrale',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.dysonCorraleJasperPlum,
    colorOptions: [{ id: 'jasper-plum', name: 'Jasper Plum (Яшмовая слива)', hex: '#582f42', image: WEBP_IMAGES.dysonCorraleJasperPlum }],
    variants: [
      {
        id: 'dyson-corrale-plum',
        fullName: 'Dyson Corrale Jasper Plum',
        prices: { kaspi: null, halyk: null, promo: null, cash: null },
      },
    ],
  },
  {
    id: 'model-dyson-corrale-pink',
    name: 'Dyson Corrale Ceramic Pink',
    category: 'dyson',
    subcategory: 'Corrale',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.dysonCorraleCeramicPink,
    colorOptions: [{ id: 'ceramic-pink', name: 'Ceramic Pink (Керамический розовый)', hex: '#dfa8a8', image: WEBP_IMAGES.dysonCorraleCeramicPink }],
    variants: [
      {
        id: 'dyson-corrale-pink',
        fullName: 'Dyson Corrale Ceramic Pink',
        prices: { kaspi: null, halyk: null, promo: null, cash: null },
      },
    ],
  },

  // ==========================================
  // 21. CANON
  // ==========================================
  {
    id: 'model-canon-g7x3-grey',
    name: 'Фотоаппарат Canon G7 Mark3 серый',
    category: 'other',
    subcategory: 'Canon',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.canonG7Mark3Grey,
    colorOptions: [
      { id: 'grey', name: 'Серый (Silver Grey)', hex: '#94959a', image: WEBP_IMAGES.canonG7Mark3Grey },
    ],
    variants: [
      {
        id: 'canon-g7x3-grey',
        fullName: 'Фотоаппарат Canon G7 Mark3 серый',
        prices: { kaspi: 744000, halyk: 775000, promo: 645000, cash: 620000 },
      },
    ],
  },
  {
    id: 'model-canon-g7x3-black',
    name: 'Фотоаппарат Canon G7 Mark3 черный',
    category: 'other',
    subcategory: 'Canon',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.canonG7Mark3Black,
    colorOptions: [
      { id: 'black', name: 'Черный (Black)', hex: '#1c1d1f', image: WEBP_IMAGES.canonG7Mark3Black },
    ],
    variants: [
      {
        id: 'canon-g7x3-black',
        fullName: 'Фотоаппарат Canon G7 Mark3 черный',
        prices: { kaspi: 744000, halyk: 775000, promo: 645000, cash: 620000 },
      },
    ],
  },
  {
    id: 'model-canon-sx740',
    name: 'Фотоаппарат Canon SX740',
    category: 'other',
    subcategory: 'Canon',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.canonSx740,
    variants: [
      {
        id: 'canon-sx740',
        fullName: 'Фотоаппарат Canon SX740',
        prices: { kaspi: 408000, halyk: 425000, promo: 354000, cash: 340000 },
      },
    ],
  },

  // ==========================================
  // 22. SONY
  // ==========================================
  {
    id: 'model-sony-zve10',
    name: 'Sony ZVE-10',
    category: 'other',
    subcategory: 'Sony',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.sonyZve10,
    variants: [
      {
        id: 'sony-zve10',
        fullName: 'Sony ZVE-10',
        prices: { kaspi: 384000, halyk: 400000, promo: 333000, cash: 320000 },
      },
    ],
  },

  // ==========================================
  // 23. RAY-BAN META
  // ==========================================
  {
    id: 'model-rayban-gen1',
    name: 'Rayban gen1',
    category: 'other',
    subcategory: 'Ray-Ban',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.raybanGen1,
    variants: [
      {
        id: 'rayban-gen1',
        fullName: 'Rayban gen1',
        prices: { kaspi: 240000, halyk: 250000, promo: 208000, cash: 200000 },
      },
    ],
  },
  {
    id: 'model-rayban-gen2',
    name: 'Rayban gen2',
    category: 'other',
    subcategory: 'Ray-Ban',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.raybanGen2,
    variants: [
      {
        id: 'rayban-gen2',
        fullName: 'Rayban gen2',
        prices: { kaspi: 330000, halyk: 343750, promo: 286000, cash: 275000 },
      },
    ],
  },

  {
    id: 'model-kylie-meta-chameleon',
    name: 'Kylie&Meta хамелеон очки с бриллиантом',
    subtitle: 'В помещении прозрачные / на солнце темнеют',
    category: 'other',
    subcategory: 'Meta',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.kylieMetaChameleon,
    variants: [
      {
        id: 'kylie-meta-chameleon',
        fullName: 'Kylie&Meta хамелеон очки с бриллиантом',
        prices: { kaspi: 390000, halyk: 406250, promo: 338000, cash: 325000 },
      },
    ],
  },

  // ==========================================
  // 24. DJI
  // ==========================================
  {
    id: 'model-dji-mic-mini',
    name: 'DJI MIC mini',
    category: 'other',
    subcategory: 'DJI',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.djiMicMini,
    variants: [
      {
        id: 'dji-mic-mini',
        fullName: 'DJI MIC mini',
        prices: { kaspi: 58800, halyk: 61250, promo: 51000, cash: 49000 },
      },
    ],
  },
  {
    id: 'model-dji-moc-mini-2',
    name: 'DJI MOC MINI 2',
    category: 'other',
    subcategory: 'DJI',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.djiMocMini2,
    variants: [
      {
        id: 'dji-moc-mini-2',
        fullName: 'DJI MOC MINI 2',
        prices: { kaspi: 64800, halyk: 67500, promo: 57000, cash: 54000 },
      },
    ],
  },
  {
    id: 'model-dji-pocket4-standart',
    name: 'DJI OSMO pocket 4 standart',
    category: 'other',
    subcategory: 'DJI',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.djiOsmoPocket4,
    variants: [
      {
        id: 'dji-pocket4-standart',
        fullName: 'DJI OSMO pocket 4 standart',
        prices: { kaspi: 312000, halyk: 325000, promo: 270000, cash: 260000 },
      },
    ],
  },
  {
    id: 'model-dji-pocket4-creator',
    name: 'DJI OSMO pocket 4 creator combo',
    category: 'other',
    subcategory: 'DJI',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.djiOsmoPocket4,
    variants: [
      {
        id: 'dji-pocket4-creator',
        fullName: 'DJI OSMO pocket 4 creator combo',
        prices: { kaspi: 390000, halyk: 406250, promo: 338000, cash: 325000 },
      },
    ],
  },
  {
    id: 'model-dji-pocket4-p-combo',
    name: 'DJI OSMO pocket 4 P combo',
    category: 'other',
    subcategory: 'DJI',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.djiOsmoPocket4,
    variants: [
      {
        id: 'dji-pocket4-p-combo',
        fullName: 'DJI OSMO pocket 4 P combo',
        prices: { kaspi: 456000, halyk: 475000, promo: 396000, cash: 380000 },
      },
    ],
  },

  // ==========================================
  // 25. ЯНДЕКС СТАНЦИЯ
  // ==========================================
  {
    id: 'model-yandex-lite2',
    name: 'Яндекс станция лайт2',
    category: 'other',
    subcategory: 'Яндекс Станция',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.yandexLite2,
    variants: [
      {
        id: 'yandex-lite2',
        fullName: 'Яндекс станция лайт2',
        prices: { kaspi: 40200, halyk: 41875, promo: 35000, cash: 33500 },
      },
    ],
  },
  {
    id: 'model-yandex-street',
    name: 'Яндекс станция Стрит',
    category: 'other',
    subcategory: 'Яндекс Станция',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.yandexStreet,
    variants: [
      {
        id: 'yandex-street',
        fullName: 'Яндекс станция Стрит',
        prices: { kaspi: 92400, halyk: 96250, promo: 80000, cash: 77000 },
      },
    ],
  },
  {
    id: 'model-yandex-midi',
    name: 'Яндекс станция Миди',
    category: 'other',
    subcategory: 'Яндекс Станция',
    warranty: '1 год официальной гарантии',
    image: WEBP_IMAGES.yandexMidi,
    variants: [
      {
        id: 'yandex-midi',
        fullName: 'Яндекс станция Миди',
        prices: { kaspi: 115200, halyk: 120000, promo: 100000, cash: 96000 },
      },
    ],
  },
];

// ХЕЛПЕРЫ ФОРМАТИРОВАНИЯ
export const formatPrice = (val: number | null | undefined): string => {
  if (val === null || val === undefined) return '';
  return val.toLocaleString('ru-RU').replace(/\u00a0/g, ' ') + '\u00A0₸';
};

export const formatStorage = (gb: number): string =>
  gb >= 1024 ? `${gb / 1024} ТБ` : `${gb} ГБ`;

// ============================================================================
// ⭐️ ДАННЫЕ ОЦЕНКИ И ВЫКУПА Б/У IPHONE (ИЗ BYLANCE_VALUATION)
// ============================================================================
export interface UsedGeneration {
  gen: string;
  models: {
    label: string;
    name: string;
    prices: Record<number, number>;
  }[];
}

export const USED_IPHONES_BUYBACK: UsedGeneration[] = [
  {
    gen: "18",
    models: [
      { label: "Обычный", name: "iPhone 18", prices: { 128: 275000, 256: 320000, 512: 365000 } },
      { label: "Air", name: "iPhone Air", prices: { 256: 320000, 512: 375000, 1024: 430000 } },
      { label: "Pro", name: "iPhone 18 Pro", prices: { 256: 405000, 512: 460000, 1024: 525000 } },
      { label: "Pro Max", name: "iPhone 18 Pro Max", prices: { 256: 460000, 512: 530000, 1024: 600000 } },
    ],
  },
  {
    gen: "17",
    models: [
      { label: "Обычный", name: "iPhone 17", prices: { 128: 215000, 256: 255000, 512: 310000 } },
      { label: "Air", name: "iPhone Air", prices: { 256: 255000, 512: 300000, 1024: 350000 } },
      { label: "Pro", name: "iPhone 17 Pro", prices: { 256: 350000, 512: 405000, 1024: 460000 } },
      { label: "Pro Max", name: "iPhone 17 Pro Max", prices: { 256: 405000, 512: 460000, 1024: 525000 } },
    ],
  },
  {
    gen: "16",
    models: [
      { label: "16e", name: "iPhone 16e", prices: { 128: 130000, 256: 150000, 512: 185000 } },
      { label: "Обычный", name: "iPhone 16", prices: { 128: 145000, 256: 175000, 512: 205000 } },
      { label: "Plus", name: "iPhone 16 Plus", prices: { 128: 160000, 256: 195000, 512: 230000 } },
      { label: "Pro", name: "iPhone 16 Pro", prices: { 128: 220000, 256: 250000, 512: 295000, 1024: 345000 } },
      { label: "Pro Max", name: "iPhone 16 Pro Max", prices: { 256: 305000, 512: 350000, 1024: 400000 } },
    ],
  },
  {
    gen: "15",
    models: [
      { label: "Обычный", name: "iPhone 15", prices: { 128: 115000, 256: 135000, 512: 165000 } },
      { label: "Plus", name: "iPhone 15 Plus", prices: { 128: 125000, 256: 150000, 512: 180000 } },
      { label: "Pro", name: "iPhone 15 Pro", prices: { 128: 170000, 256: 195000, 512: 230000, 1024: 270000 } },
      { label: "Pro Max", name: "iPhone 15 Pro Max", prices: { 256: 250000, 512: 290000, 1024: 325000 } },
    ],
  },
  {
    gen: "14",
    models: [
      { label: "Обычный", name: "iPhone 14", prices: { 128: 90000, 256: 105000, 512: 125000 } },
      { label: "Plus", name: "iPhone 14 Plus", prices: { 128: 100000, 256: 115000, 512: 135000 } },
      { label: "Pro", name: "iPhone 14 Pro", prices: { 128: 145000, 256: 165000, 512: 195000, 1024: 215000 } },
      { label: "Pro Max", name: "iPhone 14 Pro Max", prices: { 128: 175000, 256: 195000, 512: 225000, 1024: 255000 } },
    ],
  },
  {
    gen: "13",
    models: [
      { label: "mini", name: "iPhone 13 mini", prices: { 128: 65000, 256: 75000, 512: 95000 } },
      { label: "Обычный", name: "iPhone 13", prices: { 128: 75000, 256: 90000, 512: 110000 } },
      { label: "Pro", name: "iPhone 13 Pro", prices: { 128: 110000, 256: 125000, 512: 145000, 1024: 165000 } },
      { label: "Pro Max", name: "iPhone 13 Pro Max", prices: { 128: 135000, 256: 150000, 512: 175000, 1024: 195000 } },
    ],
  },
  {
    gen: "12",
    models: [
      { label: "mini", name: "iPhone 12 mini", prices: { 64: 40000, 128: 50000, 256: 55000 } },
      { label: "Обычный", name: "iPhone 12", prices: { 64: 55000, 128: 60000, 256: 70000 } },
      { label: "Pro", name: "iPhone 12 Pro", prices: { 128: 80000, 256: 90000, 512: 110000 } },
      { label: "Pro Max", name: "iPhone 12 Pro Max", prices: { 128: 95000, 256: 110000, 512: 120000 } },
    ],
  },
  {
    gen: "11",
    models: [
      { label: "Обычный", name: "iPhone 11", prices: { 64: 40000, 128: 45000, 256: 55000 } },
      { label: "Pro", name: "iPhone 11 Pro", prices: { 64: 55000, 256: 65000, 512: 80000 } },
      { label: "Pro Max", name: "iPhone 11 Pro Max", prices: { 64: 65000, 256: 80000, 512: 95000 } },
    ],
  },
  {
    gen: "X",
    models: [
      { label: "X", name: "iPhone X", prices: { 64: 30000, 256: 40000 } },
      { label: "XR", name: "iPhone XR", prices: { 64: 40000, 128: 45000, 256: 55000 } },
      { label: "XS", name: "iPhone XS", prices: { 64: 40000, 256: 50000, 512: 55000 } },
      { label: "XS Max", name: "iPhone XS Max", prices: { 64: 50000, 256: 60000, 512: 65000 } },
    ],
  },
];

export const BATTERY_RULES = [
  { min: 90, cut: 0 },
  { min: 85, cut: 3 },
  { min: 80, cut: 7 },
  { min: 75, cut: 12 },
  { min: 0, cut: 18 },
];

export const BATTERY_PRESETS = [75, 80, 85, 90, 100];

export interface BodyOption {
  id: string;
  label: string;
  hint: string;
  color: string;
  cut: number;
}

export const BODY_CONDITIONS: BodyOption[] = [
  {
    id: "perfect",
    label: "Идеальное",
    hint: "Как новый, без следов",
    color: "#38bdf8",
    cut: 0,
  },
  {
    id: "good",
    label: "Хорошее",
    hint: "Еле заметные потёртости",
    color: "#34d399",
    cut: 5,
  },
  {
    id: "average",
    label: "Среднее",
    hint: "Мелкие царапины",
    color: "#fbbf24",
    cut: 12,
  },
  {
    id: "poor",
    label: "Плохое",
    hint: "Заметные царапины, вмятины",
    color: "#f87171",
    cut: 22,
  },
];

export interface ExtraDefect {
  id: string;
  label: string;
  cut: number;
  isEsimOnly?: boolean;
}

export const getEsimDeduction = (modelName: string): number => {
  if (modelName.toLowerCase().includes('pro')) {
    return 40000;
  }
  return 30000;
};

export const EXTRAS_OPTIONS: ExtraDefect[] = [
  { id: "esim_only", label: "Только eSIM (США)", cut: 0, isEsimOnly: true },
  { id: "no_box", label: "Нет коробки и зарядки", cut: 3 },
  { id: "broken_biometrics", label: "Не работает Face ID / Touch ID", cut: 15 },
  { id: "replaced_glass", label: "Менялось заднее стекло", cut: 5 },
  { id: "replaced_screen_orig", label: "Менялся экран (оригинал)", cut: 5 },
  { id: "replaced_screen", label: "Менялся экран (неоригинал)", cut: 10 },
];

export const BLOCKED_REASON = "Заблокирован iCloud / чужой Apple ID";

