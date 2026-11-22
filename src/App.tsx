import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Check,
  MapPin,
  Phone,
  MessageCircle,
  Send,
  Sun,
  Moon,
  Search,
  X,
  ShieldCheck,
  Copy,
  ChevronRight,
  ChevronDown,
  Filter,
  Menu,
  Zap,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Battery,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import {
  SITE_INFO,
  PAYMENT_METHODS,
  PaymentMethodId,
  CATEGORIES,
  MainCategory,
  ProductModel,
  ProductVariant,
  ProductColor,
  PRODUCT_MODELS,
  formatPrice,
  formatStorage,
  getVariantPrices,
  USED_IPHONES_BUYBACK,
  BATTERY_RULES,
  BATTERY_PRESETS,
  BODY_CONDITIONS,
  EXTRAS_OPTIONS,
  getEsimDeduction,
  UsedGeneration,
  BodyOption
} from './data/prices';
import { KaspiIcon, HalykIcon, PaymentMethodIcon } from './components/PaymentIcons';
import { ProductImage } from './components/ProductImage';
import { getFaqList, getValuationFaqList } from './data/faq';
import {
  Lang,
  TRANSLATIONS,
  localizePaymentMethod,
  localizeCategory,
  localizeStoreAddress,
  localizeBodyCondition,
  localizeExtraLabel,
  localizeUsedModelLabel,
  localizeColorName,
  localizeProductName,
  localizeProductSubtitle,
  localizeSubcategory
} from './data/i18n';

// Cart Item interface: stores specific variant + chosen payment method + color
export interface CartItem {
  variantId: string;
  modelId: string;
  modelName: string;
  fullName: string;
  image: string;
  colorName?: string;
  paymentMethod: PaymentMethodId;
  quantity: number;
  prices: ProductVariant['prices'];
}

export default function App() {
  // 1. THEME STATE (SYSTEM-AWARE BY DEFAULT + MANUAL TOGGLE)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      // If phone/device is set to dark mode, immediately render in dark mode!
      if (prefersDark) return true;
      const manual = localStorage.getItem('bylance_manual_theme');
      if (manual === 'dark') return true;
      if (manual === 'light') return false;
      return false;
    }
    return false;
  });

  // Real-time synchronization with OS system dark/light mode
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemChange = (e: MediaQueryListEvent) => {
      // Whenever system theme toggles on phone/OS, immediately update!
      setIsDark(e.matches);
      localStorage.removeItem('bylance_manual_theme');
    };

    mql.addEventListener('change', handleSystemChange);
    return () => mql.removeEventListener('change', handleSystemChange);
  }, []);

  // Sync DOM with isDark
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Handler for toggle button
  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('bylance_manual_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // 1.5 LANGUAGE STATE (RU / KK)
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bylance_lang');
      if (saved === 'kk' || saved === 'ru') return saved;
    }
    return 'ru';
  });

  const t = TRANSLATIONS[lang];

  const handleSelectLang = useCallback((nextLang: Lang) => {
    setLang(nextLang);
    try {
      localStorage.setItem('bylance_lang', nextLang);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.title = TRANSLATIONS[lang].pageTitle;
    }
  }, [lang]);

  // 2. GLOBAL PAYMENT METHOD
  const [globalPayment, setGlobalPayment] = useState<PaymentMethodId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bylance_payment_method') as PaymentMethodId;
      if (saved && ['kaspi', 'halyk', 'promo', 'cash'].includes(saved)) {
        return saved;
      }
    }
    return 'promo'; // default: Акционная цена
  });

  const handleSelectGlobalPayment = useCallback((method: PaymentMethodId) => {
    setGlobalPayment(method);
    localStorage.setItem('bylance_payment_method', method);
  }, []);

  // Per-card selections: modelId -> { colorId?, simType?, storage?, size?, paymentMethod? }
  const [cardSelections, setCardSelections] = useState<Record<string, {
    colorId?: string;
    simType?: 'ESIM' | 'SIM';
    storage?: string;
    size?: string;
    paymentMethod?: PaymentMethodId;
  }>>({});

  // ---------------------------------------------------------------------------
  // ⭐️ IPHONE VALUATION & TRADE-IN CALCULATOR (FROM BYLANCE_VALUATION)
  // ---------------------------------------------------------------------------
  const [selectedGen, setSelectedGen] = useState<UsedGeneration>(() => USED_IPHONES_BUYBACK[2] || USED_IPHONES_BUYBACK[0]); // iPhone 16
  const [selectedModel, setSelectedModel] = useState<UsedGeneration['models'][0]>(() => {
    const defaultGen = USED_IPHONES_BUYBACK[2] || USED_IPHONES_BUYBACK[0];
    return defaultGen.models[1] || defaultGen.models[0]; // iPhone 16
  });
  const [selectedStorage, setSelectedStorage] = useState<number>(128);
  const [batteryPct, setBatteryPct] = useState<number>(90);
  const [selectedBody, setSelectedBody] = useState<BodyOption>(BODY_CONDITIONS[0]); // Идеальное
  const [selectedExtras, setSelectedExtras] = useState<Record<string, boolean>>({});
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [copiedValuation, setCopiedValuation] = useState<boolean>(false);
  const [tradeInApplied, setTradeInApplied] = useState<{
    modelName: string;
    storage: number;
    price: number;
  } | null>(null);

  const handleSelectGen = useCallback((gen: UsedGeneration) => {
    setSelectedGen(gen);
    const firstModel = gen.models[0];
    setSelectedModel(firstModel);
    if (firstModel) {
      const storages = Object.keys(firstModel.prices).map(Number);
      setSelectedStorage(storages[0]);
    }
  }, []);

  const handleSelectModel = useCallback((model: UsedGeneration['models'][0]) => {
    setSelectedModel(model);
    const storages = Object.keys(model.prices).map(Number);
    if (!model.prices[selectedStorage]) {
      setSelectedStorage(storages[0]);
    }
  }, [selectedStorage]);

  const toggleExtra = useCallback((id: string) => {
    setSelectedExtras((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (id === 'replaced_screen_orig' && next[id]) {
        next.replaced_screen = false;
      } else if (id === 'replaced_screen' && next[id]) {
        next.replaced_screen_orig = false;
      }
      return next;
    });
  }, []);

  const handleResetValuation = useCallback(() => {
    const defaultGen = USED_IPHONES_BUYBACK[2] || USED_IPHONES_BUYBACK[0];
    setSelectedGen(defaultGen);
    setSelectedModel(defaultGen.models[1] || defaultGen.models[0]);
    setSelectedStorage(128);
    setBatteryPct(90);
    setSelectedBody(BODY_CONDITIONS[0]);
    setSelectedExtras({});
    setIsBlocked(false);
  }, []);

  // Valuation Calculation Logic
  const calculation = useMemo(() => {
    if (isBlocked) {
      return {
        price: 0,
        canBuy: false,
        reason: t.blockedCalcReason,
        activeExtrasLabels: [],
      };
    }
    const basePrice = selectedModel.prices[selectedStorage] || 0;
    let batteryCut = 0;
    for (const rule of BATTERY_RULES) {
      if (batteryPct >= rule.min) {
        batteryCut = rule.cut;
        break;
      }
    }
    const bodyCut = selectedBody.cut;
    let extrasCut = 0;
    let fixedExtraCut = 0;
    const activeExtrasLabels: string[] = [];

    EXTRAS_OPTIONS.forEach((extra) => {
      if (selectedExtras[extra.id]) {
        if (extra.isEsimOnly) {
          const esimCut = getEsimDeduction(selectedModel.name);
          fixedExtraCut += esimCut;
          activeExtrasLabels.push(t.onlyEsimLabel(formatPrice(esimCut)));
        } else {
          extrasCut += extra.cut;
          activeExtrasLabels.push(localizeExtraLabel(extra.id, extra.label, lang).toLowerCase());
        }
      }
    });

    const totalCut = Math.min(batteryCut + bodyCut + extrasCut, 90);
    const priceAfterPct = Math.max(0, basePrice * (1 - totalCut / 100));
    const price = Math.max(
      0,
      Math.round((priceAfterPct - fixedExtraCut) / SITE_INFO.roundTo) * SITE_INFO.roundTo
    );

    return {
      price,
      canBuy: true,
      activeExtrasLabels,
    };
  }, [selectedModel, selectedStorage, batteryPct, selectedBody, selectedExtras, isBlocked, lang, t]);

  // WhatsApp prefilled URL for Sell / Valuation
  const waUrlSell = useMemo(() => {
    if (!calculation.canBuy) {
      return `https://wa.me/${SITE_INFO.whatsapp}`;
    }
    const bodyLoc = localizeBodyCondition(selectedBody.id, lang);
    const msg = [
      t.waSellGreeting(SITE_INFO.shopName),
      `• ${t.waModel}: ${selectedModel.name} (${formatStorage(selectedStorage)})`,
      `• ${t.waBattery}: ${batteryPct}%`,
      `• ${t.waBody}: ${bodyLoc.label} (${bodyLoc.hint})`,
      calculation.activeExtrasLabels.length > 0
        ? `• ${t.waExtras}: ${calculation.activeExtrasLabels.join(', ')}`
        : null,
      `• ${t.waSiteValuation}: ${formatPrice(calculation.price)}`,
      t.waVisitAsk,
    ]
      .filter(Boolean)
      .join('\n');
    return `https://wa.me/${SITE_INFO.whatsapp}?text=${encodeURIComponent(msg)}`;
  }, [calculation, selectedModel, selectedStorage, batteryPct, selectedBody, lang, t]);

  const copyValuationSummary = useCallback(() => {
    const bodyLoc = localizeBodyCondition(selectedBody.id, lang);
    const summary = t.copyValuationSummaryText(
      selectedModel.name,
      formatStorage(selectedStorage),
      batteryPct,
      bodyLoc.label,
      formatPrice(calculation.price)
    );
    navigator.clipboard.writeText(summary);
    setCopiedValuation(true);
    setTimeout(() => setCopiedValuation(false), 2000);
  }, [selectedModel, selectedStorage, batteryPct, selectedBody, calculation.price, lang, t]);

  // Active Page Navigation ('catalog' or 'valuation')
  const [activePage, setActivePage] = useState<'catalog' | 'valuation'>(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash.toLowerCase();
      if (h.includes('val') || h.includes('trade-in') || h.includes('calc')) {
        return 'valuation';
      }
    }
    return 'catalog';
  });

  const navigateTo = useCallback((page: 'catalog' | 'valuation') => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState(null, '', `#${page}`);
    } catch {}
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h.includes('val') || h.includes('trade-in') || h.includes('calc')) {
        setActivePage('valuation');
      } else if (h.includes('cat')) {
        setActivePage('catalog');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleApplyTradeIn = useCallback(() => {
    if (!calculation.canBuy || calculation.price <= 0) return;
    setTradeInApplied({
      modelName: `${selectedModel.name} (${formatStorage(selectedStorage)})`,
      storage: selectedStorage,
      price: calculation.price,
    });
    // Switch to catalog page
    setActivePage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState(null, '', '#catalog');
    } catch {}
  }, [calculation, selectedModel, selectedStorage]);

  // 3. CART STATE (saved in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bylance_cart_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch (err) {
        console.error('Failed to parse cart from localStorage', err);
      }
    }
    return [];
  });

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bylance_cart_v2', JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [cart]);

  // Add variant to cart with specific payment method and selected color
  const addToCart = useCallback((
    model: ProductModel,
    variant: ProductVariant,
    itemPaymentMethod: PaymentMethodId,
    chosenColor?: ProductColor
  ) => {
    setCart((prev) => {
      const colorLabel = chosenColor ? ` (${chosenColor.name})` : '';
      const existingIndex = prev.findIndex(
        (item) => item.variantId === variant.id &&
                  item.paymentMethod === itemPaymentMethod &&
                  item.colorName === (chosenColor ? chosenColor.name : undefined)
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      }

      const variantPrices = getVariantPrices(variant, chosenColor?.id);

      const newItem: CartItem = {
        variantId: variant.id,
        modelId: model.id,
        modelName: model.name,
        fullName: variant.fullName + colorLabel,
        image: chosenColor?.image || model.image,
        colorName: chosenColor?.name,
        paymentMethod: itemPaymentMethod,
        quantity: 1,
        prices: variantPrices,
      };

      return [...prev, newItem];
    });
  }, []);

  // Update quantity in cart
  const updateCartQuantity = useCallback((index: number, delta: number) => {
    setCart((prev) => {
      const next = [...prev];
      const target = next[index];
      if (!target) return prev;
      const newQty = target.quantity + delta;
      if (newQty <= 0) {
        return next.filter((_, i) => i !== index);
      }
      next[index] = { ...target, quantity: newQty };
      return next;
    });
  }, []);

  // Change payment method for a specific item in cart
  const updateItemPaymentMethod = useCallback((index: number, newMethod: PaymentMethodId) => {
    setCart((prev) => {
      const next = [...prev];
      const target = next[index];
      if (!target) return prev;
      next[index] = { ...target, paymentMethod: newMethod };
      return next;
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Cart Totals calculation
  const cartTotals = useMemo(() => {
    let totalCount = 0;
    let totalPrice = 0;
    let hasUnpricedItems = false;

    for (const item of cart) {
      totalCount += item.quantity;
      const unitPrice = item.prices[item.paymentMethod];
      if (unitPrice !== null && unitPrice !== undefined) {
        totalPrice += unitPrice * item.quantity;
      } else {
        hasUnpricedItems = true;
      }
    }

    return { totalCount, totalPrice, hasUnpricedItems };
  }, [cart]);

  // 4. CATALOG FILTER & SEARCH STATE
  const [selectedCategory, setSelectedCategory] = useState<MainCategory | 'all'>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-trade-in');

  // PREVENT BACKGROUND PAGE FROM SCROLLING ON MOBILE & TABLET WHEN MODAL/DRAWER IS OPEN
  useEffect(() => {
    if (isCartOpen || isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isCartOpen, isMobileMenuOpen]);

  // Subcategories for active category
  const availableSubcategories = useMemo(() => {
    const list = PRODUCT_MODELS.filter((p) => {
      if (selectedCategory === 'all') return true;
      return p.category === selectedCategory;
    });
    return Array.from(new Set(list.map((p) => p.subcategory)));
  }, [selectedCategory]);

  useEffect(() => {
    setSelectedSubcategory('all');
  }, [selectedCategory]);

  // Filtered product models
  const filteredModels = useMemo(() => {
    return PRODUCT_MODELS.filter((model) => {
      if (selectedCategory !== 'all' && model.category !== selectedCategory) {
        return false;
      }
      if (selectedSubcategory !== 'all' && model.subcategory !== selectedSubcategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = model.name.toLowerCase().includes(query);
        const matchesSubtitle = model.subtitle?.toLowerCase().includes(query) || false;
        const matchesSubcat = model.subcategory.toLowerCase().includes(query);
        const matchesVariant = model.variants.some((v) => v.fullName.toLowerCase().includes(query));
        if (!matchesName && !matchesSubtitle && !matchesSubcat && !matchesVariant) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedSubcategory, searchQuery]);

  // Resolve active variant for a model based on current card selections
  const getActiveVariant = useCallback((model: ProductModel): ProductVariant => {
    const sel = cardSelections[model.id] || {};
    const chosenSim = sel.simType || (model.simOptions ? model.simOptions[0] : undefined);
    const chosenStorage = sel.storage || (model.storageOptions ? model.storageOptions[0] : undefined);
    const chosenSize = sel.size || (model.sizeOptions ? model.sizeOptions[0] : undefined);

    const match = model.variants.find((v) => {
      const simMatch = !chosenSim || v.simType === chosenSim;
      const storageMatch = !chosenStorage || v.storage === chosenStorage;
      const sizeMatch = !chosenSize || v.size === chosenSize;
      return simMatch && storageMatch && sizeMatch;
    });

    return match || model.variants[0];
  }, [cardSelections]);

  const getCardPaymentMethod = useCallback((modelId: string): PaymentMethodId => {
    return cardSelections[modelId]?.paymentMethod || globalPayment;
  }, [cardSelections, globalPayment]);

  const updateCardSelection = useCallback((
    modelId: string,
    updates: Partial<{
      colorId: string;
      simType: 'ESIM' | 'SIM';
      storage: string;
      size: string;
      paymentMethod: PaymentMethodId;
    }>
  ) => {
    setCardSelections((prev) => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        ...updates,
      },
    }));
  }, []);

  // DIRECT 1-CLICK ORDER VIA WHATSAPP FROM PRODUCT CARD
  const handleOrderNowWhatsApp = useCallback((
    model: ProductModel,
    variant: ProductVariant,
    methodId: PaymentMethodId,
    chosenColor?: ProductColor
  ) => {
    const methodLoc = localizePaymentMethod(methodId, lang);
    const variantPrices = getVariantPrices(variant, chosenColor?.id);
    const priceVal = variantPrices[methodId];
    const priceStr = priceVal !== null && priceVal !== undefined
      ? formatPrice(priceVal)
      : t.onRequest;

    const textLines = [
      t.waOneClickGreeting(SITE_INFO.shopName),
      ``,
      `• ${t.waModel}: ${localizeProductName(variant.fullName, lang)}`,
    ];

    if (chosenColor) {
      textLines.push(`• ${t.waColor}: ${localizeColorName(chosenColor.name, lang)}`);
    }

    textLines.push(
      `• ${t.waPaymentMethod}: ${methodLoc.name}`,
      `• ${t.waPrice}: ${priceStr}`,
      ``,
      t.waAvailabilityAsk
    );

    const url = `https://wa.me/${SITE_INFO.whatsapp}?text=${encodeURIComponent(textLines.join('\n'))}`;
    window.open(url, '_blank');
  }, [lang, t]);

  // 5. WHATSAPP ORDER GENERATOR FOR CART
  const generateWhatsAppMessage = useCallback(() => {
    const lines: string[] = [t.waCartGreeting, '', t.waMyItems, ''];

    cart.forEach((item, index) => {
      const priceVal = item.prices[item.paymentMethod];
      const priceStr = priceVal !== null && priceVal !== undefined
        ? formatPrice(priceVal)
        : t.waManagerClarify;

      const methodLoc = localizePaymentMethod(item.paymentMethod, lang);
      const methodName = methodLoc.name;

      lines.push(`${index + 1}. ${localizeProductName(item.fullName, lang)}`);
      lines.push(`${t.waQuantity}: ${item.quantity}`);
      lines.push(`${t.waPaymentMethod}: ${methodName}`);
      lines.push(`${t.waPrice}: ${priceStr}`);
      lines.push('');
    });

    const formattedTotal = cartTotals.totalPrice > 0
      ? formatPrice(cartTotals.totalPrice)
      : '0 ₸';

    const totalSuffix = cartTotals.hasUnpricedItems ? t.waUnpricedSuffix : '';
    lines.push(`${t.waItemsSum}: ${formattedTotal}${totalSuffix}`);

    if (tradeInApplied) {
      lines.push(`${t.waTradeInOffset(tradeInApplied.modelName)}: -${formatPrice(tradeInApplied.price)}`);
      const finalToPay = Math.max(0, cartTotals.totalPrice - tradeInApplied.price);
      lines.push(`${t.waTotalWithTradeIn}: ${formatPrice(finalToPay)}`);
    } else {
      lines.push(`${t.waTotalPay}: ${formattedTotal}${totalSuffix}.`);
    }

    return lines.join('\n');
  }, [cart, cartTotals, tradeInApplied, lang, t]);

  const handleCheckoutWhatsApp = useCallback(() => {
    if (cart.length === 0) return;
    const msg = generateWhatsAppMessage();
    const url = `https://wa.me/${SITE_INFO.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }, [cart, generateWhatsAppMessage]);

  const handleCopyOrder = useCallback(() => {
    const msg = generateWhatsAppMessage();
    navigator.clipboard.writeText(msg);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  }, [generateWhatsAppMessage]);

  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.replace(/\/$/, '');
  const logoPath = SITE_INFO.logoPath || '/assets/aistudio/Gemini_Generated_Image_fizavafizavafiza_cfb77561.webp';
  const logoSrc = logoPath.startsWith('http')
    ? logoPath
    : `${cleanBase}/${logoPath.replace(/^\//, '')}`;
  const founderImgPath = SITE_INFO.founder?.image || '/aruzhan_profile.webp';
  const founderSrc = founderImgPath.startsWith('http')
    ? founderImgPath
    : `${cleanBase}/${founderImgPath.replace(/^\//, '')}`;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip flex flex-col font-sans bg-[#f8f9fb] dark:bg-[#0a0d14] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* ====================================================================== */}
      {/* 1. HEADER (OPTIMIZED FOR MOBILE, TABLET & DESKTOP — NO OVERLAPS)       */}
      {/* ====================================================================== */}
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0a0d14]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 transition-colors">
        <div className="max-w-6xl mx-auto px-2.5 sm:px-6 h-16 flex items-center justify-between gap-1.5 sm:gap-3">
          
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 lg:flex-initial">
            {/* Hamburger Button visible on mobile AND tablet (< 1024px) to prevent collisions */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label={t.openMenu}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo & Brand: Clicking Logo returns to catalog, compact on narrow mobile */}
            <button
              type="button"
              onClick={() => navigateTo('catalog')}
              className="flex items-center gap-2 sm:gap-2.5 min-w-0 focus-visible:outline-none text-left cursor-pointer active:scale-95 transition-transform"
              aria-label={t.toCatalogAria}
            >
              <div className="h-8 w-16 sm:h-10 sm:w-28 rounded-xl overflow-hidden bg-[#490203] border border-[#d4af5a]/40 shadow-sm shrink-0">
                <img
                  src={logoSrc}
                  alt={SITE_INFO.shopName}
                  className="w-full h-full object-cover object-center scale-125"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base sm:text-xl font-black tracking-tight text-[#7a0f2d] dark:text-[#ffead1] transition-colors leading-tight truncate">
                  {SITE_INFO.shopName}
                </span>
                <span className="text-[8px] sm:text-[10px] uppercase tracking-wide sm:tracking-wider font-semibold text-slate-500 dark:text-[#ffead1]/70 leading-none truncate">
                  {t.brandSubtitle}
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation: ONE unified segmented switcher button between Catalog and Trade-In + smooth links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {/* The single unified switcher button */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200/80 dark:border-white/10 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  navigateTo('catalog');
                  setTimeout(() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }), 50);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                  activePage === 'catalog'
                    ? 'bg-[#7a0f2d] text-[#ffead1] shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{t.navCatalog}</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('valuation')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                  activePage === 'valuation'
                    ? 'bg-[#7a0f2d] text-[#ffead1] shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.navTradeIn}</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                navigateTo('catalog');
                setTimeout(() => document.getElementById('founder')?.scrollIntoView({ behavior: 'smooth' }), 50);
              }}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {t.navFounder}
            </button>
            <button
              type="button"
              onClick={() => {
                navigateTo('catalog');
                setTimeout(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }), 50);
              }}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {t.navFaq}
            </button>
            <button
              type="button"
              onClick={() => {
                navigateTo('catalog');
                setTimeout(() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' }), 50);
              }}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {t.navContacts}
            </button>
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Language Switcher (РУС / ҚАЗ) */}
            <div
              className="inline-flex p-0.5 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200/80 dark:border-white/10"
              role="group"
              aria-label="Выбор языка / Тілді таңдау"
            >
              <button
                type="button"
                onClick={() => handleSelectLang('ru')}
                className={`px-1.5 sm:px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                  lang === 'ru'
                    ? 'bg-[#7a0f2d] text-[#ffead1] shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                РУС
              </button>
              <button
                type="button"
                onClick={() => handleSelectLang('kk')}
                className={`px-1.5 sm:px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                  lang === 'kk'
                    ? 'bg-[#7a0f2d] text-[#ffead1] shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ҚАЗ
              </button>
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={handleToggleTheme}
              aria-label={t.toggleTheme}
              title={isDark ? t.themeToLight : t.themeToDark}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#7a0f2d]" />}
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#ffead1]/40 hover:bg-[#ffead1]/70 dark:bg-white/10 dark:hover:bg-white/15 text-[#2a1a1f] dark:text-[#ffead1] transition-all flex items-center gap-1.5 sm:gap-2 font-semibold text-xs sm:text-sm border border-[#7a0f2d]/15 dark:border-white/10"
              aria-label={t.openCartAria}
            >
              <ShoppingCart className="w-4 h-4 text-[#7a0f2d] dark:text-[#ffead1]" />
              <span className="hidden sm:inline">{t.cartLabel}</span>
              {cartTotals.totalCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] sm:text-[11px] font-black rounded-full bg-[#7a0f2d] text-[#ffead1]">
                  {cartTotals.totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================== */}
      {/* MOBILE NAVIGATION SIDE DRAWER (NO EMOJIS, CLEAN LABELS)                */}
      {/* ====================================================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white dark:bg-[#121622] text-slate-900 dark:text-white h-full shadow-2xl flex flex-col z-10 p-5 space-y-5 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-22 rounded-lg overflow-hidden bg-[#490203] border border-[#d4af5a]/40 shadow-xs shrink-0">
                  <img
                    src={logoSrc}
                    alt={SITE_INFO.shopName}
                    className="w-full h-full object-cover object-center scale-125"
                  />
                </div>
                <span className="font-black text-xl text-[#7a0f2d] dark:text-[#ffead1]">
                  {SITE_INFO.shopName}
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Switcher inside mobile menu */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {lang === 'kk' ? 'Тіл:' : 'Язык:'}
              </span>
              <div className="inline-flex p-0.5 rounded-lg bg-white dark:bg-[#121622] border border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => handleSelectLang('ru')}
                  className={`px-2.5 py-1 rounded-md text-xs font-black transition-all cursor-pointer ${
                    lang === 'ru'
                      ? 'bg-[#7a0f2d] text-[#ffead1]'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  РУС
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectLang('kk')}
                  className={`px-2.5 py-1 rounded-md text-xs font-black transition-all cursor-pointer ${
                    lang === 'kk'
                      ? 'bg-[#7a0f2d] text-[#ffead1]'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  ҚАЗ
                </button>
              </div>
            </div>

            {/* Quick Categories Navigation */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {t.catalogCategories}
              </span>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                  navigateTo('catalog');
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-[#7a0f2d] text-[#ffead1] dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border dark:border-[#b4401f]'
                    : 'hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span>{t.allProducts}</span>
                <span className="text-[11px] opacity-70">({PRODUCT_MODELS.length})</span>
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('apple');
                  setSelectedSubcategory('all');
                  navigateTo('catalog');
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  selectedCategory === 'apple'
                    ? 'bg-[#7a0f2d] text-[#ffead1] dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border dark:border-[#b4401f]'
                    : 'hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span>{t.appleTech}</span>
                <span className="text-[11px] opacity-70">
                  ({PRODUCT_MODELS.filter((p) => p.category === 'apple').length})
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('dyson');
                  setSelectedSubcategory('all');
                  navigateTo('catalog');
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  selectedCategory === 'dyson'
                    ? 'bg-[#7a0f2d] text-[#ffead1] dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border dark:border-[#b4401f]'
                    : 'hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span>{t.dysonDevices}</span>
                <span className="text-[11px] opacity-70">
                  ({PRODUCT_MODELS.filter((p) => p.category === 'dyson').length})
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('other');
                  setSelectedSubcategory('all');
                  navigateTo('catalog');
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  selectedCategory === 'other'
                    ? 'bg-[#7a0f2d] text-[#ffead1] dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border dark:border-[#b4401f]'
                    : 'hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span>{t.photoAndGadgets}</span>
                <span className="text-[11px] opacity-70">
                  ({PRODUCT_MODELS.filter((p) => p.category === 'other').length})
                </span>
              </button>
            </div>

            {/* Pages & Sections in Store */}
            <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {lang === 'kk' ? 'Беттер:' : 'Страницы:'}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigateTo('catalog');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activePage === 'catalog'
                    ? 'bg-[#7a0f2d] text-[#ffead1]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span>{lang === 'kk' ? 'Жаңа құрылғылар каталогы' : 'Каталог новых устройств'}</span>
                <span className="text-[10px] opacity-80">{lang === 'kk' ? 'Дүкен' : 'Магазин'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateTo('valuation');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activePage === 'valuation'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-amber-700 dark:text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                <span>{lang === 'kk' ? 'iPhone бағалау және Trade-In' : 'Оценка и Trade-In iPhone'}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold">
                  Trade-In
                </span>
              </button>

              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pt-2 mb-1">
                {t.sectionsLabel}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (activePage !== 'valuation') navigateTo('valuation');
                  setIsMobileMenuOpen(false);
                  setTimeout(() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}
                className="w-full text-left py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                {t.howBuybackWorks}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activePage !== 'catalog') navigateTo('catalog');
                  setIsMobileMenuOpen(false);
                  setTimeout(() => document.getElementById('founder')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}
                className="w-full text-left py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-between cursor-pointer"
              >
                <span>{t.founderName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 font-bold">{t.founderBadge}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setTimeout(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}
                className="w-full text-left py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                {t.faqFull}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setTimeout(() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}
                className="w-full text-left py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                {t.contactsAlmaty}
              </button>
            </div>

            {/* Telegram Б/У Callout */}
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1.5 text-xs">
              <span className="font-bold text-[#229ED9] block">
                {t.tgUsedTitle}
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                {t.tgUsedDesc}
              </p>
              <a
                href={`https://t.me/${SITE_INFO.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-[#229ED9] hover:underline pt-1 text-[11px]"
              >
                <span>{t.tgOpenChannel}</span>
              </a>
            </div>

            {/* Direct WhatsApp Button */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${SITE_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{t.writeWhatsApp}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MAIN CONTAINER                                                         */}
      {/* ====================================================================== */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8 pb-28 md:pb-12">

        {activePage === 'catalog' && (
          <>
        {/* ====================================================================== */}
        {/* 1. CATALOG SECTION (IMMEDIATELY VISIBLE ON FIRST SCREEN)                */}
        {/* ====================================================================== */}
        <section id="catalog" className="space-y-4 scroll-mt-20">
          
          {/* Top Compact Catalog Header: Trust badge, Title & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold mb-1.5 border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.catalogTrustBadge}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t.catalogTitle}
              </h1>
            </div>

            {/* Fast Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7a0f2d]/30 dark:focus:ring-white/20 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label={t.clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* APPLIED TRADE-IN DISCOUNT (if calculated by user) */}
          {tradeInApplied && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-950 dark:text-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black">
                    {t.tradeInAppliedTitle} {tradeInApplied.modelName}
                  </div>
                  <div className="text-[11px] text-emerald-800 dark:text-emerald-300/80">
                    {t.tradeInDiscountPrefix} <span className="font-bold font-mono text-xs">{formatPrice(tradeInApplied.price)}</span> {t.tradeInDiscountSuffix}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => navigateTo('valuation')}
                  className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-white/10 hover:bg-white text-xs font-bold transition-all border border-emerald-500/30 cursor-pointer"
                >
                  {t.changeValuation}
                </button>
                <button
                  type="button"
                  onClick={() => setTradeInApplied(null)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all cursor-pointer"
                >
                  {t.resetBtn}
                </button>
              </div>
            </div>
          )}

          {/* Quick Global Payment Mode Selector Pills (Switches all catalog prices) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-1">
              {t.catalogPricesLabel}
            </span>
            {PAYMENT_METHODS.map((m) => {
              const isSelected = globalPayment === m.id;
              const locM = localizePaymentMethod(m.id, lang);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectGlobalPayment(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                    isSelected
                      ? m.id === 'cash'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f] shadow-xs'
                      : 'bg-white dark:bg-[#121622] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                  }`}
                >
                  <PaymentMethodIcon method={m.id} className="w-3.5 h-3.5" />
                  <span>{locM.name}</span>
                  {m.id === 'cash' && (
                    <span className="text-[10px] px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold ml-0.5">
                      {t.discountBadge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Category Tabs (Visible on all screens with horizontal scroll) */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border shrink-0 min-h-[40px] flex items-center justify-center active:scale-95 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] shadow-sm dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]'
                  : 'bg-white dark:bg-[#121622] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
              }`}
            >
              {t.allProducts} ({PRODUCT_MODELS.length})
            </button>

            {CATEGORIES.map((cat) => {
              const count = PRODUCT_MODELS.filter((p) => p.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              const locCat = localizeCategory(cat.id, lang);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border shrink-0 min-h-[40px] flex items-center justify-center active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] shadow-sm dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]'
                      : 'bg-white dark:bg-[#121622] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                  }`}
                >
                  {locCat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Subcategory Pills (Enlarged & Easy to Tap) */}
          {availableSubcategories.length > 1 && (
            <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar pb-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1.5 mr-0.5">
                <Filter className="w-3.5 h-3.5 text-[#7a0f2d] dark:text-[#ffead1]" />
                <span>{t.subcategoryLabel}</span>
              </span>
              <button
                onClick={() => setSelectedSubcategory('all')}
                className={`text-xs sm:text-sm px-4 py-2 rounded-xl border font-bold transition-all shrink-0 min-h-[38px] flex items-center justify-center active:scale-95 ${
                  selectedSubcategory === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-xs'
                    : 'bg-white dark:bg-[#121622] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                }`}
              >
                {t.allLabel}
              </button>

              {availableSubcategories.map((subcat) => (
                <button
                  key={subcat}
                  onClick={() => setSelectedSubcategory(subcat)}
                  className={`text-xs sm:text-sm px-4 py-2 rounded-xl border font-bold transition-all shrink-0 min-h-[38px] flex items-center justify-center active:scale-95 ${
                    selectedSubcategory === subcat
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-xs'
                      : 'bg-white dark:bg-[#121622] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                  }`}
                >
                  {localizeSubcategory(subcat, lang)}
                </button>
              ))}
            </div>
          )}

          {/* ================================================================== */}
          {/* GROUPED PRODUCT CARDS GRID                                         */}
          {/* ================================================================== */}
          {filteredModels.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#121622] rounded-2xl border border-slate-200/80 dark:border-white/10">
              <p className="text-base font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t.nothingFound} «{searchQuery}»
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedSubcategory('all'); }}
                className="text-xs font-bold text-[#7a0f2d] dark:text-[#ffead1] hover:underline"
              >
                {t.resetFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {filteredModels.map((model) => {
                const sel = cardSelections[model.id] || {};
                const activeColor = model.colorOptions?.find((c) => c.id === sel.colorId) || model.colorOptions?.[0];
                const displayImage = activeColor?.image || model.image;
                const activeVariant = getActiveVariant(model);
                const itemPayment = getCardPaymentMethod(model.id);

                const activePrices = getVariantPrices(activeVariant, activeColor?.id);
                const currentPrice = activePrices[itemPayment];
                const activeMethodObj = PAYMENT_METHODS.find((m) => m.id === itemPayment) || PAYMENT_METHODS[2];

                const cartMatch = cart.find(
                  (c) => c.variantId === activeVariant.id &&
                         c.paymentMethod === itemPayment &&
                         c.colorName === (activeColor ? activeColor.name : undefined)
                );
                const cartQty = cartMatch ? cartMatch.quantity : 0;

                const activeSim = sel.simType || (model.simOptions ? model.simOptions[0] : undefined);
                const activeStorage = sel.storage || (model.storageOptions ? model.storageOptions[0] : undefined);
                const activeSize = sel.size || (model.sizeOptions ? model.sizeOptions[0] : undefined);

                const kaspiPrice = activePrices.kaspi;
                const halykPrice = activePrices.halyk;
                const promoPrice = activePrices.promo;
                const cashPrice = activePrices.cash;

                const kaspi12 = kaspiPrice ? Math.round(kaspiPrice / 12) : null;
                const kaspi24 = kaspiPrice ? Math.round(kaspiPrice / 24) : null;
                const halyk12 = halykPrice ? Math.round(halykPrice / 12) : null;
                const halyk24 = halykPrice ? Math.round(halykPrice / 24) : null;

                const specParts: string[] = [];
                if (activeStorage) specParts.push(activeStorage);
                if (activeSim) specParts.push(activeSim === 'ESIM' ? 'eSIM' : 'SIM');
                if (activeSize) specParts.push(activeSize);
                if (activeColor) specParts.push(localizeColorName(activeColor.name, lang).split(' (')[0]);
                const localizedModelName = localizeProductName(model.name, lang);
                const localizedSubtitle = localizeProductSubtitle(model.subtitle, lang);
                const localizedColorLabel = activeColor ? localizeColorName(activeColor.name, lang) : undefined;
                const specSubtitle = specParts.length > 0 ? specParts.join(' · ') : (localizedSubtitle || localizeSubcategory(model.subcategory, lang));

                return (
                  <div
                    key={model.id}
                    className="rounded-2xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-w-0 overflow-hidden group"
                  >
                    <div className="min-w-0">
                      {/* Product Photo Container: Compact size, rounded corners, pure white background */}
                      <div className="w-full h-52 sm:h-56 bg-white dark:bg-white p-5 flex items-center justify-center overflow-hidden border-b border-slate-100 dark:border-slate-100 relative rounded-t-2xl">
                        <div className="w-full h-full flex items-center justify-center bg-white rounded-2xl p-1">
                          <ProductImage
                            src={displayImage}
                            alt={localizedModelName}
                            fallbackSrc={model.image}
                            className="max-h-36 sm:max-h-42 w-auto max-w-[85%] object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        {localizedColorLabel && (
                          <span className="absolute bottom-2.5 right-2.5 z-20 max-w-[calc(100%-1.25rem)] truncate text-[10px] font-bold tracking-wide px-2.5 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-xs text-white border border-white/20 shadow-2xs pointer-events-none">
                            {localizedColorLabel}
                          </span>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-4 sm:p-5 space-y-4">
                        
                        {/* Subcategory & Warranty & Title */}
                        <div className="space-y-1 sm:space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/5">
                              {localizeSubcategory(model.subcategory, lang)}
                            </span>
                            <span className="text-[11px] sm:text-xs text-slate-400">
                              {t.warranty1Year}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug pt-0.5">
                            {localizedModelName}
                          </h3>
                          {localizedSubtitle && (
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-snug">
                              {localizedSubtitle}
                            </p>
                          )}
                        </div>

                        {/* SELECTOR: COLOR SELECTION WITH COMPACT ROUNDED WHITE THUMBNAILS */}
                        {model.colorOptions && model.colorOptions.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-extrabold uppercase tracking-wider text-[#7a0f2d] dark:text-[#ffead1]">
                                {t.colorLabel}
                              </span>
                              <span className="font-bold text-[#2a1a1f] dark:text-[#ffead1] bg-[#ffead1]/60 dark:bg-[#7a0f2d]/40 px-2.5 py-0.5 rounded-lg text-xs truncate ml-2 border border-[#7a0f2d]/20 dark:border-white/10 shadow-2xs">
                                {localizedColorLabel}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1">
                              {model.colorOptions.map((col) => {
                                const isColSel = activeColor?.id === col.id;
                                const colNameLoc = localizeColorName(col.name, lang);
                                return (
                                  <button
                                    key={col.id}
                                    type="button"
                                    onClick={() => updateCardSelection(model.id, { colorId: col.id })}
                                    title={colNameLoc}
                                    className={`group/color relative rounded-xl border-2 transition-all flex items-center justify-center shrink-0 active:scale-95 cursor-pointer overflow-hidden ${
                                      isColSel
                                        ? 'border-[#7a0f2d] dark:border-[#ffead1] ring-2 ring-[#b4401f]/40 dark:ring-[#ffead1]/30 scale-105 shadow-md'
                                        : 'border-slate-200 dark:border-white/10 hover:border-[#b4401f]/60 dark:hover:border-white/40 hover:scale-[1.02]'
                                    }`}
                                  >
                                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white flex items-center justify-center relative rounded-xl p-1 overflow-hidden shadow-2xs">
                                      {col.image ? (
                                        <img
                                          src={col.image}
                                          alt={colNameLoc}
                                          loading="lazy"
                                          className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover/color:scale-110"
                                          onError={(e) => {
                                            (e.currentTarget as HTMLElement).style.display = 'none';
                                          }}
                                        />
                                      ) : (
                                        <span
                                          className="w-7 h-7 rounded-full border border-slate-200 shadow-inner"
                                          style={{ backgroundColor: col.hex || '#e2e8f0' }}
                                        />
                                      )}
                                      {col.hex && col.image && (
                                        <span
                                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-white absolute bottom-0.5 right-0.5 shadow-sm pointer-events-none"
                                          style={{ backgroundColor: col.hex }}
                                        />
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                            {activeColor && activeVariant.colorPrices?.[activeColor.id] && (
                              <div className="text-[10px] sm:text-[11px] font-bold text-[#7a0f2d] dark:text-[#ffead1] bg-[#ffead1]/70 dark:bg-[#7a0f2d]/30 px-2.5 py-1 rounded-xl border border-[#7a0f2d]/25 flex items-center justify-between">
                                <span className="flex items-center gap-1.5 truncate">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#7a0f2d] dark:bg-[#ffead1] shrink-0" />
                                  <span className="truncate">{t.specialColorPrice} {localizedColorLabel?.split(' (')[0]}</span>
                                </span>
                                <span className="font-mono font-black shrink-0 ml-1.5">{formatPrice(currentPrice || 0)}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* SELECTOR 1: SIM TYPE */}
                        {model.simOptions && model.simOptions.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              {t.simTypeLabel}
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {model.simOptions.map((sim) => {
                                const isSel = activeSim === sim;
                                return (
                                  <button
                                    key={sim}
                                    type="button"
                                    onClick={() => updateCardSelection(model.id, { simType: sim })}
                                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                                      isSel
                                        ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]/60 shadow-xs'
                                        : 'bg-slate-50 dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                                    }`}
                                  >
                                    {sim === 'ESIM' ? t.simEsim : t.simPhysical}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* SELECTOR 2: STORAGE (MEMORY) */}
                        {model.storageOptions && model.storageOptions.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              {t.storageLabel}
                            </span>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                              {model.storageOptions.map((storage) => {
                                const isSel = activeStorage === storage;
                                return (
                                  <button
                                    key={storage}
                                    type="button"
                                    onClick={() => updateCardSelection(model.id, { storage })}
                                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                                      isSel
                                        ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]/60 shadow-xs'
                                        : 'bg-slate-50 dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                                    }`}
                                  >
                                    {storage}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* SELECTOR 3: SIZE (FOR APPLE WATCH) */}
                        {model.sizeOptions && model.sizeOptions.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              {t.sizeLabel}
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {model.sizeOptions.map((sz) => {
                                const isSel = activeSize === sz;
                                return (
                                  <button
                                    key={sz}
                                    type="button"
                                    onClick={() => updateCardSelection(model.id, { size: sz })}
                                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                                      isSel
                                        ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]/60 shadow-xs'
                                        : 'bg-slate-50 dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                                    }`}
                                  >
                                    {sz}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>

                    {/* ================================================================ */}
                    {/* AUTHENTIC MULTI-COLOR PRICING TAG                                */}
                    {/* ================================================================ */}
                    <div className="p-2.5 sm:p-3.5 border-t border-slate-100 dark:border-white/10 space-y-1.5 sm:space-y-2 bg-slate-50/60 dark:bg-[#0e121c]/90 mt-auto">
                      
                      {/* 1. Header Box: Model Title + Spec Summary (Wine Crimson #7a0f2d) */}
                      <div className="rounded-2xl bg-[#7a0f2d] text-white p-2.5 sm:p-3 shadow-xs">
                        <div className="font-extrabold text-sm sm:text-base leading-tight text-white tracking-tight">
                          {localizedModelName}
                        </div>
                        <div className="text-[11px] sm:text-xs text-[#ffead1] font-medium leading-tight mt-0.5 truncate">
                          {specSubtitle}
                        </div>
                      </div>

                      {/* 2. Kaspi Row (Warm Cream #ffead1 / #fff4e5) */}
                      <button
                        type="button"
                        onClick={() => updateCardSelection(model.id, { paymentMethod: 'kaspi' })}
                        className={`w-full text-left rounded-2xl bg-[#ffead1] hover:bg-[#ffe3c2] text-[#2a1a1f] p-2 sm:p-2.5 transition-all flex items-center justify-between gap-1.5 sm:gap-2 shadow-2xs relative cursor-pointer active:scale-[0.99] min-w-0 overflow-hidden ${
                          itemPayment === 'kaspi'
                            ? 'ring-2 ring-rose-500 ring-offset-2 ring-offset-white dark:ring-offset-[#121622] scale-[1.01]'
                            : 'opacity-95 hover:opacity-100'
                        }`}
                      >
                        <div className="shrink-0 leading-none">
                          <span className="font-black text-xs sm:text-sm text-[#F14635] block tracking-tight">
                            Kaspi
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-[#8a7267] font-semibold block mt-0.5">
                            {t.installmentWord}
                          </span>
                        </div>

                        <div className="text-center sm:text-left flex-1 px-1 min-w-0">
                          <span className="font-black font-mono text-sm sm:text-base md:text-lg xl:text-xl text-[#2a1a1f] whitespace-nowrap block truncate">
                            {kaspiPrice !== null ? formatPrice(kaspiPrice) : t.onRequest}
                          </span>
                        </div>

                        <div className="shrink-0 text-right leading-tight space-y-0.5">
                          <div className="flex items-center justify-end gap-1 sm:gap-1.5 text-right">
                            <span className="text-[10px] sm:text-xs text-[#8a7267] font-semibold">{t.months12}</span>
                            <span className="font-black text-[11px] sm:text-xs xl:text-sm text-[#7a0f2d] font-mono whitespace-nowrap">
                              {kaspi12 !== null ? formatPrice(kaspi12).replace(' ₸', '') : '—'}
                            </span>
                          </div>
                          <div className="flex items-center justify-end gap-1 sm:gap-1.5 text-right">
                            <span className="text-[10px] sm:text-xs text-[#8a7267] font-semibold">{t.months24}</span>
                            <span className="font-black text-[11px] sm:text-xs xl:text-sm text-[#7a0f2d] font-mono whitespace-nowrap">
                              {kaspi24 !== null ? formatPrice(kaspi24).replace(' ₸', '') : '—'}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* 3. Halyk Row (Warm Cream #ffead1 / #fff4e5) */}
                      <button
                        type="button"
                        onClick={() => updateCardSelection(model.id, { paymentMethod: 'halyk' })}
                        className={`w-full text-left rounded-2xl bg-[#ffead1] hover:bg-[#ffe3c2] text-[#2a1a1f] p-2 sm:p-2.5 transition-all flex items-center justify-between gap-1.5 sm:gap-2 shadow-2xs relative cursor-pointer active:scale-[0.99] min-w-0 overflow-hidden ${
                          itemPayment === 'halyk'
                            ? 'ring-2 ring-emerald-600 ring-offset-2 ring-offset-white dark:ring-offset-[#121622] scale-[1.01]'
                            : 'opacity-95 hover:opacity-100'
                        }`}
                      >
                        <div className="shrink-0 leading-none">
                          <span className="font-black text-xs sm:text-sm text-[#007A53] block tracking-tight">
                            Halyk
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-[#8a7267] font-semibold block mt-0.5">
                            {t.installmentWord}
                          </span>
                        </div>

                        <div className="text-center sm:text-left flex-1 px-1 min-w-0">
                          <span className="font-black font-mono text-sm sm:text-base md:text-lg xl:text-xl text-[#2a1a1f] whitespace-nowrap block truncate">
                            {halykPrice !== null ? formatPrice(halykPrice) : t.onRequest}
                          </span>
                        </div>

                        <div className="shrink-0 text-right leading-tight space-y-0.5">
                          <div className="flex items-center justify-end gap-1 sm:gap-1.5 text-right">
                            <span className="text-[10px] sm:text-xs text-[#8a7267] font-semibold">{t.months12}</span>
                            <span className="font-black text-[11px] sm:text-xs xl:text-sm text-[#7a0f2d] font-mono whitespace-nowrap">
                              {halyk12 !== null ? formatPrice(halyk12).replace(' ₸', '') : '—'}
                            </span>
                          </div>
                          <div className="flex items-center justify-end gap-1 sm:gap-1.5 text-right">
                            <span className="text-[10px] sm:text-xs text-[#8a7267] font-semibold">{t.months24}</span>
                            <span className="font-black text-[11px] sm:text-xs xl:text-sm text-[#7a0f2d] font-mono whitespace-nowrap">
                              {halyk24 !== null ? formatPrice(halyk24).replace(' ₸', '') : '—'}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* 4. Bottom 2 Blocks (АКЦИЯ & НАЛИЧНЫМИ side-by-side) */}
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        {/* Left: АКЦИЯ (Wine Crimson #7a0f2d) */}
                        <button
                          type="button"
                          onClick={() => updateCardSelection(model.id, { paymentMethod: 'promo' })}
                          className={`w-full text-left rounded-2xl bg-[#7a0f2d] hover:bg-[#8e1236] text-white p-2.5 sm:p-3 transition-all flex flex-col justify-between shadow-2xs relative cursor-pointer active:scale-[0.99] min-w-0 overflow-hidden ${
                            itemPayment === 'promo'
                              ? 'ring-2 ring-white ring-offset-2 ring-offset-white dark:ring-offset-[#121622] scale-[1.01]'
                              : 'opacity-95 hover:opacity-100'
                          }`}
                        >
                          <div>
                            <span className="font-black text-xs uppercase tracking-wide block leading-none">
                              {t.promoTitle}
                            </span>
                            <span className="text-[10px] text-[#ffead1]/90 font-medium block mt-1 leading-tight truncate">
                              {t.promoSubtitle}
                            </span>
                          </div>
                          <div className="mt-2.5">
                            <span className="font-black font-mono text-[13px] sm:text-base md:text-lg text-white block whitespace-nowrap leading-none truncate">
                              {promoPrice !== null ? formatPrice(promoPrice) : t.onRequest}
                            </span>
                          </div>
                        </button>

                        {/* Right: НАЛИЧНЫМИ (Obsidian #2a1a1f) */}
                        <button
                          type="button"
                          onClick={() => updateCardSelection(model.id, { paymentMethod: 'cash' })}
                          className={`w-full text-left rounded-2xl bg-[#2a1a1f] hover:bg-[#3d262d] text-white p-2.5 sm:p-3 transition-all flex flex-col justify-between shadow-2xs relative cursor-pointer active:scale-[0.99] min-w-0 overflow-hidden ${
                            itemPayment === 'cash'
                              ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-white dark:ring-offset-[#121622] scale-[1.01]'
                              : 'opacity-95 hover:opacity-100'
                          }`}
                        >
                          <div>
                            <span className="font-black text-xs uppercase tracking-wide block leading-none">
                              {t.cashTitle}
                            </span>
                            <span className="text-[10px] text-[#ffead1]/80 font-medium block mt-1 leading-tight truncate">
                              {t.cashSubtitle}
                            </span>
                          </div>
                          <div className="mt-2.5">
                            <span className="font-black font-mono text-[13px] sm:text-base md:text-lg text-white block whitespace-nowrap leading-none truncate">
                              {cashPrice !== null ? formatPrice(cashPrice) : t.onRequest}
                            </span>
                          </div>
                        </button>
                      </div>

                      {/* 5. Two Action Buttons: Direct 1-Click WhatsApp Order + Add to Cart */}
                      <div className="space-y-2 pt-2">
                        {/* Button 1: Order Now Directly via WhatsApp */}
                        <button
                          type="button"
                          onClick={() => handleOrderNowWhatsApp(model, activeVariant, itemPayment, activeColor)}
                          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#25D366] hover:bg-[#20ba59] transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                        >
                          <Zap className="w-4 h-4 fill-current" />
                          <span>{t.orderNowWa}</span>
                        </button>

                        {/* Button 2: Add to multi-product Cart */}
                        <button
                          type="button"
                          onClick={() => addToCart(model, activeVariant, itemPayment, activeColor)}
                          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-800 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 transition-all border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4 text-[#7a0f2d] dark:text-[#ffead1]" />
                          <span>
                            {cartQty > 0
                              ? t.inCartQty(cartQty)
                              : t.addToCart}
                          </span>
                        </button>

                        {/* Trade-In Quick Button or Applied Status */}
                        {model.category === 'apple' && (
                          <div className="pt-1">
                            {tradeInApplied ? (
                              <div className="py-1.5 px-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] flex items-center justify-between">
                                <span className="text-emerald-800 dark:text-emerald-300 font-semibold truncate">
                                  Trade-In ({tradeInApplied.modelName}):
                                </span>
                                <span className="font-mono font-black text-emerald-700 dark:text-emerald-300 ml-1 shrink-0">
                                  -{formatPrice(tradeInApplied.price)}
                                </span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => navigateTo('valuation')}
                                className="w-full py-1.5 px-2 rounded-xl text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <RefreshCw className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                <span>{t.tradeInCardBtn}</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* CALLOUT BANNER: SWITCH TO VALUATION PAGE */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-600/15 dark:from-amber-950/40 dark:via-yellow-950/20 dark:to-amber-900/40 border border-amber-300 dark:border-amber-600/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                {t.tradeInBannerEyebrow}
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {t.tradeInBannerTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                {t.tradeInBannerDesc}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('valuation')}
            className="shrink-0 w-full md:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 dark:bg-amber-400 dark:hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-center md:whitespace-nowrap"
          >
            <span>{t.tradeInBannerBtn}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* ====================================================================== */}
        {/* FOUNDER & STORE STORY: АРУЖАН ЖЕТКЕРГЕН                                */}
        {/* ====================================================================== */}
        <section id="founder" className="scroll-mt-20 rounded-3xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">
            
            {/* PHOTO FIELD WITH LUXURY GRADIENT EFFECT */}
            <div className="relative group shrink-0 self-center lg:self-start">
              {/* Outer Radiant Ambient Gradient Glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#7a0f2d]/40 via-[#b4401f]/35 via-[#ffead1]/30 to-[#7a0f2d]/30 rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

              {/* Iridescent Gradient Border Ring */}
              <div className="p-1 rounded-[28px] bg-gradient-to-tr from-[#7a0f2d] via-[#b4401f] via-[#ffead1] to-[#7a0f2d] shadow-xl">
                {/* Photo Container Frame */}
                <div className="relative w-40 h-52 sm:w-48 sm:h-60 md:w-52 md:h-64 rounded-[24px] overflow-hidden bg-gradient-to-b from-[#2a1a1f] to-black flex items-center justify-center">
                  
                  {/* Founder Photo Image with Graceful Stylized Fallback */}
                  <img
                    src={founderSrc}
                    alt={SITE_INFO.founder?.name || 'Аружан Жеткерген'}
                    className="w-full h-full object-cover object-top brightness-110 contrast-[1.03] group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                      const fallback = document.getElementById('founder-gradient-avatar');
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />

                  {/* Stylized Gradient Avatar Fallback (when local photo file is not yet placed) */}
                  <div
                    id="founder-gradient-avatar"
                    className="absolute inset-0 hidden flex-col items-center justify-center p-4 text-center bg-gradient-to-tr from-[#2a1a1f] via-[#7a0f2d] to-[#1a0f13] text-white"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#b4401f] via-[#7a0f2d] to-[#2a1a1f] flex items-center justify-center text-[#ffead1] font-black text-2xl shadow-lg ring-2 ring-white/20 mb-2">
                      АЖ
                    </div>
                    <span className="text-xs font-black tracking-tight text-[#ffead1]">Аружан Жеткерген</span>
                    <span className="text-[10px] text-[#ffead1]/80 font-bold mt-0.5">@zaagaru</span>
                  </div>

                  {/* Subtle Bottom Edge Gradient Only Behind Badge */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/65 via-black/20 to-transparent pointer-events-none" />

                  {/* Floating Identity Badge on Photo */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 pointer-events-none">
                    <div className="px-2.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-center shadow-xs">
                      <span className="text-[11px] font-black text-white block leading-tight truncate">
                        {SITE_INFO.founder?.name || 'Аружан Жеткерген'}
                      </span>
                      <span className="text-[9px] text-[#ffead1] font-extrabold uppercase tracking-wider block mt-0.5">
                        {t.founderRoleBadge}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* BIO & TEXT INFO */}
            <div className="space-y-3.5 flex-1 min-w-0 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffead1] dark:bg-[#7a0f2d]/40 text-[#7a0f2d] dark:text-[#ffead1] text-xs font-bold border border-[#7a0f2d]/20 dark:border-[#ffead1]/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.founderStoryBadge}</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {t.founderName}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.founderSubtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {t.founderBioStart} <strong className="text-slate-900 dark:text-white font-bold">@bylance_kz</strong>{t.founderBioRest}
              </p>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#181d2a] border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{t.founderStatYears}</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#181d2a] border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t.founderStatFollowers}
                </div>
              </div>
            </div>

            {/* Social Cards / Links */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 lg:min-w-[270px]">
              <a
                href="https://www.tiktok.com/@_zaag_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#181d2a] hover:bg-slate-100 dark:hover:bg-[#1e2536] border border-slate-200 dark:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-xs">
                    TT
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-blue-600 transition-colors">
                      TikTok @_zaag_ ↗
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t.subscribersText('280 000+')}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition-colors" />
              </a>

              <a
                href="https://www.instagram.com/zaagaru"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#181d2a] hover:bg-slate-100 dark:hover:bg-[#1e2536] border border-slate-200 dark:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-black text-xs">
                    IG
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-rose-600 transition-colors">
                      Instagram @zaagaru ↗
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t.subscribersText('80 000+')}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition-colors" />
              </a>

              <a
                href="https://www.instagram.com/bylance_kz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#181d2a] hover:bg-slate-100 dark:hover:bg-[#1e2536] border border-slate-200 dark:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-8 rounded-lg overflow-hidden bg-[#490203] border border-[#d4af5a]/40 shrink-0">
                    <img
                      src={logoSrc}
                      alt={SITE_INFO.shopName}
                      className="w-full h-full object-cover object-center scale-125"
                    />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-[#b4401f] transition-colors">
                      {t.shopAccountTitle}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t.shopAccountSubtitle}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition-colors" />
              </a>
            </div>

          </div>
        </section>

        {/* ====================================================================== */}
        {/* MESSENGERS BAR (RESPONSIVE TABLET/MOBILE LAYOUT — NO SQUEEZING)        */}
        {/* ====================================================================== */}
        <section className="bg-white dark:bg-[#121622] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {t.directContactTitle}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#229ED9] dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap">
                {t.tgOnlyUsedBadge}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              {t.directContactDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 shrink-0 w-full lg:w-auto">
            <a
              href={`https://wa.me/${SITE_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#25D366] hover:bg-[#20ba59] transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`https://t.me/${SITE_INFO.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#229ED9] hover:bg-[#1e8ec3] transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>{t.usedCatalogBtn}</span>
            </a>

            <a
              href={SITE_INFO.gis}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-[#181d2a] dark:hover:bg-[#202738] transition-all border border-slate-200 dark:border-white/10"
            >
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.gisAlmaty}</span>
            </a>
          </div>
        </section>

        {/* ====================================================================== */}
        {/* 6. FAQ SECTION (ACCORDION & EXPAND/COLLAPSE)                           */}
        {/* ====================================================================== */}
        <section id="faq" className="space-y-4 scroll-mt-20">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#7a0f2d] dark:text-[#ffead1] uppercase tracking-wider">
              {t.faqEyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2a1a1f] dark:text-[#ffead1] mt-1">
              {t.faqTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#ffead1]/70 mt-1">
              {t.faqSubtitle}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 pt-2">
            {getFaqList(lang).map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm sm:text-base text-[#2a1a1f] dark:text-white hover:text-[#7a0f2d] dark:hover:text-[#ffead1] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-[#7a0f2d] dark:text-[#ffead1]' : 'text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3 animate-fade-in space-y-3">
                      <p className="whitespace-pre-line">{faq.answer}</p>

                      {faq.hasTradeInLinks && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => navigateTo('valuation')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>{t.onlineCalcBtn}</span>
                          </button>

                          <a
                            href={`https://wa.me/${SITE_INFO.whatsapp}?text=${encodeURIComponent(t.waTradeInFaqMsg)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            <span>{t.evaluateWaBtn}</span>
                          </a>

                          <a
                            href={`https://t.me/${SITE_INFO.telegram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{t.tgTradeInChannelBtn}</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
                          >
                            <span>{t.backToCatalogTop}</span>
                          </button>
                        </div>
                      )}

                      {faq.hasTelegramLink && (
                        <div className="pt-1">
                          <a
                            href={`https://t.me/${SITE_INFO.telegram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{t.openTgChannel} @{SITE_INFO.telegram} ↗</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ВОПРОСЫ И БЫСТРЫЕ ССЫЛКИ: WHATSAPP, TELEGRAM, TRADE-IN */}
          <div className="max-w-3xl mx-auto space-y-3 pt-2">
            
            {/* 1. WHATSAPP: Вопросы по товару или покупке */}
            <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1 text-center sm:text-left min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  {t.otherQuestionsTitle}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t.otherQuestionsDesc}
                </p>
              </div>

              <a
                href={`https://wa.me/${SITE_INFO.whatsapp}?text=${encodeURIComponent(t.waGeneralQuestionMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 active:scale-95 text-center sm:whitespace-nowrap w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                <span>{t.askWaBtn}</span>
              </a>
            </div>

            {/* 2. TELEGRAM: Б/У техника и канал */}
            <div className="p-5 sm:p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1 text-center sm:text-left min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {t.lookingForUsedTitle}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#229ED9] text-white whitespace-nowrap hidden sm:inline-block">
                    {t.onlyUsedBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t.lookingForUsedDesc}
                </p>
              </div>

              <a
                href={`https://t.me/${SITE_INFO.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 active:scale-95 text-center sm:whitespace-nowrap w-full sm:w-auto"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>{t.tgUsedBtn}</span>
              </a>
            </div>

            {/* 3. TRADE-IN: Обмен старого iPhone */}
            <div className="p-5 sm:p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1 text-center sm:text-left min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {t.wantTradeInTitle}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white whitespace-nowrap hidden sm:inline-block">
                    Trade-In
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t.wantTradeInDesc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigateTo('valuation')}
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 active:scale-95 text-center sm:whitespace-nowrap w-full sm:w-auto cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 shrink-0" />
                <span>{t.calcOnlineBtn}</span>
              </button>
            </div>

          </div>
        </section>

        {/* ====================================================================== */}
        {/* 7. ADVANTAGES & GUARANTEES                                             */}
        {/* ====================================================================== */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              {t.whyTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.whySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#181d2a] border border-slate-100 dark:border-white/5 space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#7a0f2d] dark:text-[#ffead1]" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.adv1Title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.adv1Desc}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#181d2a] border border-slate-100 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-2">
                <KaspiIcon className="w-7 h-7 rounded-lg" />
                <HalykIcon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.adv2Title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.adv2Desc}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#181d2a] border border-slate-100 dark:border-white/5 space-y-2">
              <RefreshCw className="w-6 h-6 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.adv3Title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.adv3Desc}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#181d2a] border border-slate-100 dark:border-white/5 space-y-2">
              <MessageCircle className="w-6 h-6 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.adv4Title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.adv4Desc}
              </p>
            </div>
          </div>
        </section>

        {/* ====================================================================== */}
        {/* 8. CONTACTS SECTION (ДВА МАГАЗИНА: ДЛЯ НОВЫХ И ДЛЯ Б/У)                */}
        {/* ====================================================================== */}
        <section id="contacts" className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#7a0f2d] dark:text-[#ffead1] uppercase tracking-wider">
                {t.contactsEyebrow}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {t.contactsTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.contactsSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${SITE_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white transition-all shadow-sm flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{t.writeWhatsApp}</span>
              </a>

              <a
                href={SITE_INFO.gis}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-800 dark:text-white transition-all flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>2ГИС</span>
              </a>
            </div>
          </div>

          {/* TWO STORE LOCATION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {SITE_INFO.addresses.map((rawAddr) => {
              const addr = localizeStoreAddress(rawAddr, lang);
              const isUsed = addr.id === 'used-store';
              return (
                <div
                  key={addr.id}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                    isUsed
                      ? 'bg-amber-500/5 dark:bg-amber-950/25 border-amber-300/80 dark:border-amber-500/40 shadow-xs'
                      : 'bg-emerald-500/5 dark:bg-emerald-950/25 border-emerald-300/80 dark:border-emerald-500/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                      {isUsed ? (
                        <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      <span>{addr.title}</span>
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        isUsed
                          ? 'bg-amber-500 text-slate-950 shadow-2xs'
                          : 'bg-emerald-600 text-white shadow-2xs'
                      }`}
                    >
                      {addr.badge}
                    </span>
                  </div>
                  <p className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{addr.address}</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {addr.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      {t.schedulePrefix} <b className="text-slate-700 dark:text-slate-200 font-semibold">{addr.hours}</b>
                    </span>
                    <div className="flex items-center gap-3">
                      {addr.phoneFormatted && (
                        <a
                          href={`tel:${addr.phone}`}
                          className="text-[#7a0f2d] dark:text-[#ffead1] font-bold hover:underline inline-flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{addr.phoneFormatted}</span>
                        </a>
                      )}
                      <a
                        href={addr.gis}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-0.5"
                      >
                        2ГИС ↗
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-white/10 text-xs sm:text-sm">
            <div className="space-y-1">
              <span className="text-slate-400 block text-xs">{t.workHoursLabel}</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                10:00–22:00
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block text-xs">{t.phoneNumberLabel}</span>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${SITE_INFO.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{SITE_INFO.whatsappFormatted}</span>
                </a>
                <a
                  href={`https://t.me/${SITE_INFO.telegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#229ED9] hover:underline flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>@{SITE_INFO.telegram}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
        </>
        )}

        {/* ====================================================================== */}
        {/* DEDICATED VALUATION PAGE (ВЫКУП И TRADE-IN IPHONE)                     */}
        {/* ====================================================================== */}
        {activePage === 'valuation' && (
          <>
            {/* 1. ⭐️ ОЦЕНКА И ВЫКУП IPHONE (ИНТЕГРАЦИЯ ИЗ BYLANCE_VALUATION) */}
            <section id="valuation" className="space-y-6 pt-1 scroll-mt-20">
              
              {/* Section Header & Reset */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 bg-white dark:bg-[#121622] p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[11px] font-black uppercase tracking-wider mb-2 border border-amber-500/30">
                    <RefreshCw className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span>{t.valBadge}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {t.valTitle}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    {t.valDesc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResetValuation}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white self-start sm:self-auto px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#181d2a] hover:bg-slate-100 dark:hover:bg-[#202738] transition-colors cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.valReset}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                
                {/* LEFT COLUMN: 6 STEPS */}
                <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                  
                  {/* STEP 1: GENERATION */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xs">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-7 h-7 rounded-full bg-[#7a0f2d] text-[#ffead1] text-xs font-black flex items-center justify-center shrink-0">
                        1
                      </span>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                          {t.step1Title}
                        </h3>
                        <p className="text-[11px] text-slate-400">{t.step1Desc}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                      {USED_IPHONES_BUYBACK.map((g) => {
                        const isSelected = selectedGen.gen === g.gen;
                        return (
                          <button
                            key={g.gen}
                            type="button"
                            onClick={() => handleSelectGen(g)}
                            className={`py-3 px-2 rounded-2xl text-center font-black text-sm transition-all border cursor-pointer active:scale-95 ${
                              isSelected
                                ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] shadow-sm dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]'
                                : 'bg-slate-50 dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-[#202738] hover:border-slate-300'
                            }`}
                          >
                            {g.gen}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 2: VERSION / MODEL */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xs">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-7 h-7 rounded-full bg-[#7a0f2d] text-[#ffead1] text-xs font-black flex items-center justify-center shrink-0">
                        2
                      </span>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                          {t.step2Title}
                        </h3>
                        <p className="text-[11px] text-slate-400">{t.step2Desc(selectedGen.gen)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {selectedGen.models.map((m) => {
                        const isSelected = selectedModel.name === m.name;
                        return (
                          <button
                            key={m.name}
                            type="button"
                            onClick={() => handleSelectModel(m)}
                            className={`py-3 px-3 rounded-2xl text-center font-bold text-xs sm:text-sm transition-all border cursor-pointer active:scale-95 ${
                              isSelected
                                ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] shadow-sm dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]'
                                : 'bg-slate-50 dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-[#202738] hover:border-slate-300'
                            }`}
                          >
                            {localizeUsedModelLabel(m.label, lang)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 3: STORAGE */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xs">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-7 h-7 rounded-full bg-[#7a0f2d] text-[#ffead1] text-xs font-black flex items-center justify-center shrink-0">
                        3
                      </span>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                          {t.step3Title}
                        </h3>
                        <p className="text-[11px] text-slate-400">{t.step3Desc}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {Object.keys(selectedModel.prices).map((s) => {
                        const storageNum = Number(s);
                        const isSelected = selectedStorage === storageNum;
                        return (
                          <button
                            key={storageNum}
                            type="button"
                            onClick={() => setSelectedStorage(storageNum)}
                            className={`py-3 px-3 rounded-2xl text-center font-bold text-xs sm:text-sm transition-all border cursor-pointer active:scale-95 ${
                              isSelected
                                ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] shadow-sm dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]'
                                : 'bg-slate-50 dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-[#202738] hover:border-slate-300'
                            }`}
                          >
                            {formatStorage(storageNum)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 4: BATTERY */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#7a0f2d] text-[#ffead1] text-xs font-black flex items-center justify-center shrink-0">
                          4
                        </span>
                        <div>
                          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                            {t.step4Title}
                          </h3>
                          <p className="text-[11px] text-slate-400">
                            {t.step4Desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#181d2a] px-3.5 py-1.5 rounded-2xl border border-slate-200/60 dark:border-white/10">
                        <Battery className={`w-4 h-4 ${batteryPct >= 85 ? 'text-emerald-500' : batteryPct >= 80 ? 'text-amber-500' : 'text-rose-500'}`} />
                        <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                          {batteryPct}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 pt-3">
                      <input
                        type="range"
                        min={50}
                        max={100}
                        step={1}
                        value={batteryPct}
                        onChange={(e) => setBatteryPct(Number(e.target.value))}
                        className="slider-battery"
                        aria-label={t.step4Title}
                      />
                      <div className="flex justify-between text-xs font-semibold text-slate-400 px-1">
                        <span>50%</span>
                        <span>75%</span>
                        <span>85%</span>
                        <span>100%</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-white/5">
                        <span className="text-xs text-slate-500 dark:text-slate-400 mr-1 font-medium">
                          {t.quickSelect}
                        </span>
                        {BATTERY_PRESETS.map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setBatteryPct(pct)}
                            className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                              batteryPct === pct
                                ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] shadow-2xs dark:bg-[#7a0f2d] dark:text-[#ffead1]'
                                : 'bg-slate-50 dark:bg-[#181d2a] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-[#202738]'
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* STEP 5: BODY CONDITIONS */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#7a0f2d] text-[#ffead1] text-xs font-black flex items-center justify-center shrink-0">
                          5
                        </span>
                        <div>
                          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                            {t.step5Title}
                          </h3>
                          <p className="text-[11px] text-slate-400">{t.step5Desc}</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{t.gradations4}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {BODY_CONDITIONS.map((b) => {
                        const isSelected = selectedBody.id === b.id;
                        const bLoc = localizeBodyCondition(b.id, lang);
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBody(b)}
                            className={`p-3.5 rounded-2xl flex flex-col items-center text-center transition-all border cursor-pointer active:scale-95 ${
                              isSelected
                                ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] shadow-sm dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]'
                                : 'bg-slate-50 dark:bg-[#181d2a] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-[#202738]'
                            }`}
                          >
                            <span
                              className="w-4 h-4 rounded-full mb-2 border border-black/20 dark:border-white/20 shadow-xs"
                              style={{ backgroundColor: b.color }}
                            />
                            <span className="font-black text-xs sm:text-sm mb-1">{bLoc.label}</span>
                            <span className={`text-[11px] leading-tight ${isSelected ? 'text-[#ffead1]/80' : 'text-slate-400'}`}>
                              {bLoc.hint}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 6: EXTRAS & DEFECTS */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xs">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-7 h-7 rounded-full bg-[#7a0f2d] text-[#ffead1] text-xs font-black flex items-center justify-center shrink-0">
                        6
                      </span>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                          {t.step6Title}
                        </h3>
                        <p className="text-[11px] text-slate-400">{t.step6Desc}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                      {EXTRAS_OPTIONS.map((extra) => {
                        const isChecked = !!selectedExtras[extra.id];
                        return (
                          <button
                            key={extra.id}
                            type="button"
                            onClick={() => toggleExtra(extra.id)}
                            className={`p-3 rounded-2xl text-left flex items-center gap-3 transition-all border text-xs sm:text-sm font-bold cursor-pointer ${
                              isChecked
                                ? 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-600/60 shadow-2xs'
                                : 'bg-slate-50 dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-[#202738]'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center text-xs shrink-0 transition-colors ${
                                isChecked ? 'bg-amber-600 text-white' : 'border border-slate-300 dark:border-white/20'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="flex-1">{localizeExtraLabel(extra.id, extra.label, lang)}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Blocked Reason Switch */}
                    <button
                      type="button"
                      onClick={() => setIsBlocked(!isBlocked)}
                      className={`w-full p-3.5 rounded-2xl text-left flex items-center gap-3 transition-all border text-xs sm:text-sm font-bold cursor-pointer ${
                        isBlocked
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700 shadow-2xs'
                          : 'bg-slate-50 dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-[#202738]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center text-xs shrink-0 transition-colors ${
                          isBlocked ? 'bg-rose-600 text-white' : 'border border-slate-300 dark:border-white/20'
                        }`}
                      >
                        {isBlocked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="flex-1">
                        <span>{t.blockedReasonText}</span>
                        {isBlocked && (
                          <p className="text-[11px] text-rose-600 dark:text-rose-300 mt-1 font-normal leading-normal">
                            {t.blockedWarning}
                          </p>
                        )}
                      </div>
                    </button>
                  </div>

                </div>

                {/* RIGHT COLUMN: STICKY RESULT CARD */}
                <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
                  
                  <div className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#121826] text-slate-900 dark:text-white shadow-xl border border-slate-200/90 dark:border-white/10 relative overflow-hidden transition-colors">
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black text-[#7a0f2d] dark:text-amber-400 uppercase tracking-wider">
                        {t.prelimCalcTitle}
                      </span>
                      <button
                        type="button"
                        onClick={copyValuationSummary}
                        disabled={!calculation.canBuy}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors disabled:opacity-40 cursor-pointer font-bold"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedValuation ? t.copied : t.copy}</span>
                      </button>
                    </div>

                    <div className="mb-5">
                      {calculation.canBuy ? (
                        <div>
                          <div className="text-3xl sm:text-5xl font-black tracking-tight text-[#7a0f2d] dark:text-emerald-400 font-mono break-words">
                            {formatPrice(calculation.price)}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-snug">
                            {t.finalSumNote}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                            {t.buybackImpossible}
                          </div>
                          <p className="text-xs text-rose-500 dark:text-rose-300 mt-1">
                            {calculation.reason}
                          </p>
                        </div>
                      )}
                    </div>

                    {calculation.canBuy && (
                      <div className="py-3 px-3.5 rounded-2xl bg-slate-50 dark:bg-[#182033] border border-slate-200/70 dark:border-white/10 text-xs text-slate-700 dark:text-slate-200 space-y-2 mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">{t.modelLabel}</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {selectedModel.name} · {formatStorage(selectedStorage)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">{t.batteryShort}</span>
                          <span className="font-bold font-mono text-slate-900 dark:text-white">{batteryPct}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">{t.bodyShort}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{localizeBodyCondition(selectedBody.id, lang).label}</span>
                        </div>
                        {calculation.activeExtrasLabels.length > 0 && (
                          <div className="flex items-start justify-between pt-1.5 border-t border-slate-200/60 dark:border-white/10">
                            <span className="text-slate-500 dark:text-slate-400">{t.extrasShort}</span>
                            <span className="font-bold text-right text-slate-900 dark:text-white pl-2">
                              {calculation.activeExtrasLabels.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2.5">
                      {/* Button 1: Send to WhatsApp */}
                      <a
                        href={waUrlSell}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                          calculation.canBuy
                            ? 'bg-[#25D366] hover:bg-[#20ba59] text-white active:scale-[0.99] cursor-pointer'
                            : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 pointer-events-none opacity-60'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>{t.sendBuybackWa}</span>
                      </a>

                      {/* Button 2: Apply to Trade-In for New Device */}
                      <button
                        type="button"
                        onClick={handleApplyTradeIn}
                        disabled={!calculation.canBuy}
                        className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border ${
                          calculation.canBuy
                            ? 'bg-[#7a0f2d] hover:bg-[#b4401f] text-[#ffead1] border-[#7a0f2d] shadow-sm active:scale-[0.99] cursor-pointer'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-400 border-transparent pointer-events-none opacity-60'
                        }`}
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>{t.applyTradeInBtn(formatPrice(calculation.price))}</span>
                      </button>
                    </div>

                    {/* Guarantees List */}
                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{t.guarantee1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{t.guarantee2}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{t.guarantee3}</span>
                      </div>
                    </div>

                  </div>

                  {/* Direct Telegram & 2GIS Fast Links */}
                  {/* High-Visibility Telegram B/U Showcase Card */}
                  <a
                    href={`https://t.me/${SITE_INFO.telegram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#229ED9]/15 via-[#229ED9]/10 to-[#229ED9]/25 hover:from-[#229ED9]/25 hover:to-[#229ED9]/35 border-2 border-[#229ED9]/60 hover:border-[#229ED9] shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-[#229ED9] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                          <Send className="w-5 h-5 -rotate-12 translate-x-0.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] uppercase tracking-wider font-extrabold text-[#229ED9]">
                            {t.tgCardEyebrow}
                          </div>
                          <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                            @{SITE_INFO.telegram} ↗
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300">
                            {t.tgCardDesc}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 px-3 py-1.5 rounded-xl bg-[#229ED9] text-white text-xs font-black shadow-xs group-hover:bg-[#1a8bc0] transition-colors flex items-center gap-1">
                        <span>{t.openBtn}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </a>

                </div>

              </div>

            </section>

            {/* 3. HOW IT WORKS (КАК РАБОТАЕТ ВЫКУП И TRADE-IN) */}
            <section id="how" className="py-8 bg-white dark:bg-[#121622] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-xs scroll-mt-20">
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="text-xs font-black uppercase tracking-wider text-[#7a0f2d] dark:text-amber-400">
                  {t.howEyebrow}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {t.howTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {t.howSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#181d2a] border border-slate-200/70 dark:border-white/5 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7a0f2d] text-[#ffead1] flex items-center justify-center font-black text-base shadow-xs">
                    1
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {t.howStep1Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t.howStep1Desc}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#181d2a] border border-slate-200/70 dark:border-white/5 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7a0f2d] text-[#ffead1] flex items-center justify-center font-black text-base shadow-xs">
                    2
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {t.howStep2Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t.howStep2Desc}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#181d2a] border border-slate-200/70 dark:border-white/5 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7a0f2d] text-[#ffead1] flex items-center justify-center font-black text-base shadow-xs">
                    3
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {t.howStep3Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t.howStep3Desc}
                  </p>
                </div>
              </div>
            </section>

            {/* 4. VALUATION / TRADE-IN FAQ */}
            <section className="space-y-4">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  {t.valFaqEyebrow}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2a1a1f] dark:text-[#ffead1] mt-1">
                  {t.valFaqTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#ffead1]/70 mt-1">
                  {t.valFaqSubtitle}
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-3 pt-2">
                {getValuationFaqList(lang).map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-2xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-xs transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm sm:text-base text-[#2a1a1f] dark:text-white hover:text-[#7a0f2d] dark:hover:text-[#ffead1] transition-colors"
                      >
                        <span>{faq.question}</span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                            isOpen ? 'rotate-180 text-amber-600 dark:text-amber-400' : 'text-slate-400'
                          }`}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3 space-y-2">
                          <p className="whitespace-pre-line">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 5. PROMINENT TELEGRAM B/U SHOWCASE */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#229ED9]/20 via-[#229ED9]/15 to-[#229ED9]/25 border-2 border-[#229ED9]/60 dark:border-[#229ED9]/50 shadow-md flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-14 h-14 rounded-2xl bg-[#229ED9] text-white flex items-center justify-center shrink-0 shadow-lg">
                  <Send className="w-7 h-7 -rotate-12 translate-x-0.5" />
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#229ED9] flex items-center justify-center md:justify-start gap-1.5">
                    <span>{t.verifiedChannelBadge}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    {t.tgShowcaseTitle} <span className="text-[#229ED9] underline decoration-2">@{SITE_INFO.telegram} ↗</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                    {t.tgShowcaseDesc}
                  </p>
                </div>
              </div>
              <a
                href={`https://t.me/${SITE_INFO.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-full md:w-auto px-6 py-3.5 rounded-2xl bg-[#229ED9] hover:bg-[#1a8bc0] text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-center md:whitespace-nowrap"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>{t.goToTg} @{SITE_INFO.telegram} ↗</span>
              </a>
            </div>

            {/* 6. CALLOUT: GO TO STORE CATALOG */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#7a0f2d]/15 via-[#7a0f2d]/10 to-[#ffead1]/20 dark:from-[#7a0f2d]/40 dark:via-[#2a1a1f] dark:to-[#ffead1]/10 border border-[#7a0f2d]/30 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#7a0f2d] text-[#ffead1] flex items-center justify-center shrink-0 shadow-sm">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#7a0f2d] dark:text-[#ffead1]">
                    {t.catalogInStockEyebrow}
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {t.readyToChooseTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                    {t.readyToChooseDesc}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('catalog')}
                className="shrink-0 w-full md:w-auto px-6 py-3 rounded-2xl bg-[#7a0f2d] hover:bg-[#8e1236] text-[#ffead1] font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-center md:whitespace-nowrap"
              >
                <span>{t.goToCatalogBtn}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </>
        )}
      </main>

      {/* ====================================================================== */}
      {/* 9. FOOTER                                                              */}
      {/* ====================================================================== */}
      <footer className="mt-12 border-t border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0a0d14] py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 max-w-full">
            <div className="h-9 w-20 sm:h-10 sm:w-28 rounded-xl overflow-hidden bg-[#490203] border border-[#d4af5a]/40 shadow-xs shrink-0">
              <img
                src={logoSrc}
                alt="BYLANCE — Байланыста Zaagaru"
                className="w-full h-full object-cover object-center scale-125"
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
              <span className="font-black text-[#7a0f2d] dark:text-[#ffead1] text-sm">
                {SITE_INFO.shopName}
              </span>
              <span>·</span>
              <span>{t.footerDesc}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => navigateTo('catalog')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${activePage === 'catalog' ? 'text-[#7a0f2d] dark:text-[#ffead1] font-bold' : ''}`}
            >
              {t.navCatalog}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('valuation')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${activePage === 'valuation' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}
            >
              {t.navValuationShort}
            </button>
            <a href="#founder" onClick={() => { if (activePage !== 'catalog') navigateTo('catalog'); }} className="hover:text-slate-900 dark:hover:text-white transition-colors">
              {t.navFounder}
            </a>
            <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              {t.navFaq}
            </a>
            <a href="#contacts" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              {t.navContacts}
            </a>
            <a
              href={`https://wa.me/${SITE_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline"
            >
              WhatsApp
            </a>
            <a
              href={`https://t.me/${SITE_INFO.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#229ED9] hover:underline"
            >
              Telegram (Б/У)
            </a>
          </div>
        </div>
      </footer>

      {/* ====================================================================== */}
      {/* 10. FIXED BOTTOM NAVIGATION BAR ("ОТДЕЛЬНАЯ СТРАНИЦА СНИЗУ")           */}
      {/* ====================================================================== */}
      <nav
        aria-label={t.navCatalog}
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c101a]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-white/10 shadow-2xl px-1.5 sm:px-6 py-2 transition-colors md:hidden"
      >
        <div className="max-w-xl mx-auto flex items-center justify-around gap-1 sm:gap-2">
          {/* 1. Каталог */}
          <button
            type="button"
            onClick={() => navigateTo('catalog')}
            className={`flex-1 min-w-0 py-1 px-1 sm:px-2 rounded-2xl flex flex-col items-center justify-center gap-0.5 text-center transition-all cursor-pointer ${
              activePage === 'catalog'
                ? 'text-[#7a0f2d] dark:text-[#ffead1] font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                activePage === 'catalog'
                  ? 'bg-[#7a0f2d]/10 dark:bg-[#7a0f2d]/40 text-[#7a0f2d] dark:text-[#ffead1]'
                  : ''
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-[11px] sm:text-xs tracking-tight truncate max-w-full">{t.navCatalog}</span>
          </button>

          {/* 2. Оценка iPhone */}
          <button
            type="button"
            onClick={() => navigateTo('valuation')}
            className={`flex-1 min-w-0 py-1 px-1 sm:px-2 rounded-2xl flex flex-col items-center justify-center gap-0.5 text-center transition-all cursor-pointer ${
              activePage === 'valuation'
                ? 'text-amber-600 dark:text-amber-400 font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                activePage === 'valuation'
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  : ''
              }`}
            >
              <RefreshCw className="w-5 h-5" />
            </div>
            <span className="text-[11px] sm:text-xs tracking-tight truncate max-w-full">{t.navValuationShort}</span>
          </button>

          {/* 3. Корзина */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex-1 min-w-0 py-1 px-1 sm:px-2 rounded-2xl flex flex-col items-center justify-center gap-0.5 text-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold transition-all cursor-pointer relative"
          >
            <div className="relative">
              <div className="p-1.5 rounded-xl">
                <ShoppingCart className="w-5 h-5" />
              </div>
              {cartTotals.totalCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full bg-[#7a0f2d] text-[#ffead1] text-[10px] font-black font-mono shadow-2xs">
                  {cartTotals.totalCount}
                </span>
              )}
            </div>
            <span className="text-[11px] sm:text-xs tracking-tight truncate max-w-full">
              {cartTotals.totalCount > 0 ? (
                <span className="font-bold text-[#7a0f2d] dark:text-[#ffead1] font-mono">
                  {cartTotals.totalPrice > 0 ? formatPrice(cartTotals.totalPrice) : t.cartLabel}
                </span>
              ) : (
                t.cartLabel
              )}
            </span>
          </button>

          {/* 4. WhatsApp */}
          <a
            href={`https://wa.me/${SITE_INFO.whatsapp}?text=${encodeURIComponent(t.waDefaultConsult)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0 py-1 px-1 sm:px-2 rounded-2xl flex flex-col items-center justify-center gap-0.5 text-center text-slate-500 dark:text-slate-400 hover:text-[#25D366] font-semibold transition-all"
          >
            <div className="p-1.5 rounded-xl text-[#25D366]">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <span className="text-[11px] sm:text-xs tracking-tight truncate max-w-full">WhatsApp</span>
          </a>
        </div>
      </nav>

      {/* ====================================================================== */}
      {/* 11. CART DRAWER (FULL HEIGHT ON TABLET & MOBILE, BODY SCROLL LOCKED,    */}
      {/*     NOWRAP ON PRICE SO ₸ NEVER BREAKS)                                 */}
      {/* ====================================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop with touch lock */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer Content — 100dvh for exact mobile & tablet viewport height */}
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0e121c] text-slate-900 dark:text-white h-[100dvh] max-h-[100dvh] shadow-2xl flex flex-col z-10 transition-transform overscroll-contain touch-pan-y">
            
            {/* Header (Non-scrolling) */}
            <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#7a0f2d] dark:text-[#ffead1]" />
                <h2 className="text-lg font-black tracking-tight">
                  {t.cartHeader}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#ffead1] dark:bg-[#7a0f2d]/50 font-bold text-[#7a0f2d] dark:text-[#ffead1]">
                  {cartTotals.totalCount} {t.piecesShort}
                </span>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                aria-label={t.closeCartAria}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Helper Note (Non-scrolling) */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#121622] border-b border-slate-200/80 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-400 shrink-0">
              {t.cartHelperNote}
            </div>

            {/* Cart Items List (Smooth, isolated scroll on mobile & tablet) */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-3.5 -webkit-overflow-scrolling-touch touch-pan-y">
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 mx-auto flex items-center justify-center text-slate-400">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <p className="text-base font-bold text-slate-700 dark:text-[#ffead1]">
                    {t.cartEmptyTitle}
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    {t.cartEmptyDesc}
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#7a0f2d] text-[#ffead1] text-xs font-bold hover:bg-[#b4401f] transition-colors"
                  >
                    {t.goCatalogBtn}
                  </button>
                </div>
              ) : (
                cart.map((item, index) => {
                  const unitPrice = item.prices[item.paymentMethod];
                  const itemTotal = unitPrice !== null && unitPrice !== undefined
                    ? unitPrice * item.quantity
                    : null;

                  return (
                    <div
                      key={`${item.variantId}-${item.paymentMethod}-${index}`}
                      className="p-3.5 rounded-xl bg-white dark:bg-[#181d2a] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        {/* Thumbnail: white bg, rounded-xl */}
                        <div className="w-14 h-14 rounded-xl bg-white p-1 shrink-0 overflow-hidden border border-slate-200/60 dark:border-white/10 flex items-center justify-center shadow-2xs">
                          <ProductImage
                            src={item.image}
                            alt={localizeProductName(item.fullName, lang)}
                            size="thumb"
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                            {localizeProductName(item.fullName, lang)}
                          </h4>
                          {item.colorName && (
                            <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 mt-0.5">
                              {t.colorPrefix} {localizeColorName(item.colorName, lang)}
                            </div>
                          )}
                          <div className="text-[11px] text-slate-400 mt-0.5 break-words">
                            {unitPrice !== null && unitPrice !== undefined
                              ? `${formatPrice(unitPrice)} ${t.perPieceSuffix}`
                              : t.onRequest}
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => removeFromCart(index)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                          aria-label={t.removeItemAria}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* INDIVIDUAL PAYMENT METHOD SELECTION */}
                      <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-white/5">
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                          {t.paymentForItemLabel}
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                          {PAYMENT_METHODS.map((pm) => {
                            const isSelected = item.paymentMethod === pm.id;
                            const pmLoc = localizePaymentMethod(pm.id, lang);
                            return (
                              <button
                                key={pm.id}
                                type="button"
                                onClick={() => updateItemPaymentMethod(index, pm.id)}
                                className={`py-1.5 px-1.5 rounded-lg text-[10px] font-bold transition-all border flex items-center justify-center gap-1 truncate ${
                                  isSelected
                                    ? pm.id === 'cash'
                                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                      : 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] dark:bg-[#7a0f2d] dark:border-[#b4401f] shadow-xs'
                                    : 'bg-slate-50 dark:bg-[#121622] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:border-slate-300'
                                }`}
                              >
                                <PaymentMethodIcon method={pm.id} className="w-3 h-3 shrink-0" />
                                <span className="truncate">{pmLoc.shortLabel}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Stepper & Line Total (Nowrap Price) */}
                      <div className="flex items-center justify-between pt-1 gap-2">
                        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#121622] rounded-lg p-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(index, -1)}
                            className="p-1 rounded bg-white dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                            aria-label={t.decreaseQtyAria}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(index, 1)}
                            className="p-1 rounded bg-[#7a0f2d] text-[#ffead1] hover:bg-[#b4401f]"
                            aria-label={t.increaseQtyAria}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-black font-mono text-[#7a0f2d] dark:text-[#ffead1] whitespace-nowrap shrink-0">
                            {itemTotal !== null ? formatPrice(itemTotal) : t.onRequest}
                          </div>
                          {item.paymentMethod === 'cash' && item.prices.kaspi && itemTotal !== null && (
                            <div className="text-[10px] text-rose-500 dark:text-rose-400 line-through font-bold">
                              {formatPrice(item.prices.kaspi * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer with Checkout (Non-scrolling, Nowrap Price) */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-[#0e121c] space-y-3 shrink-0">
                
                {/* Trade-In in Cart */}
                {tradeInApplied ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                        {t.tradeInCartDiscount(tradeInApplied.modelName)}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        {t.tradeInPrelimNote}
                      </span>
                    </div>
                    <span className="font-mono font-black text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                      -{formatPrice(tradeInApplied.price)}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateTo('valuation');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{t.tradeInFromCartBtn}</span>
                  </button>
                )}

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-3 text-base sm:text-lg font-black">
                    <span className="text-slate-900 dark:text-white shrink-0">
                      {tradeInApplied ? t.totalToPayWithTradeIn : t.totalToPay}
                    </span>
                    <span className="text-[#7a0f2d] dark:text-[#ffead1] font-mono text-xl whitespace-nowrap shrink-0 text-right">
                      {formatPrice(Math.max(0, cartTotals.totalPrice - (tradeInApplied ? tradeInApplied.price : 0)))}
                    </span>
                  </div>
                  {cartTotals.hasUnpricedItems && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400">
                      {t.unpricedNote}
                    </p>
                  )}
                </div>

                {/* Primary Button: WhatsApp Checkout */}
                <button
                  type="button"
                  onClick={handleCheckoutWhatsApp}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base text-white bg-[#25D366] hover:bg-[#20ba59] transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>{t.checkoutWaBtn}</span>
                </button>

                {/* Secondary Actions */}
                <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                  <button
                    onClick={handleCopyOrder}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedNotification ? t.orderCopied : t.copyOrderText}</span>
                  </button>

                  <button
                    onClick={clearCart}
                    className="text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline"
                  >
                    {t.clearCartBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
