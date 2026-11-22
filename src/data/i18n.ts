import type { PaymentMethodId, MainCategory, StoreAddress } from './prices';

export type Lang = 'ru' | 'kk';

export interface Translations {
  // Meta
  pageTitle: string;
  // Header & Navigation
  brandSubtitle: string;
  openMenu: string;
  toCatalogAria: string;
  navCatalog: string;
  navTradeIn: string;
  navFounder: string;
  navFaq: string;
  navContacts: string;
  toggleTheme: string;
  themeToLight: string;
  themeToDark: string;
  openCartAria: string;
  cartLabel: string;
  // Mobile drawer
  catalogCategories: string;
  allProducts: string;
  appleTech: string;
  dysonDevices: string;
  photoAndGadgets: string;
  sectionsLabel: string;
  howBuybackWorks: string;
  founderName: string;
  founderBadge: string;
  faqFull: string;
  contactsAlmaty: string;
  tgUsedTitle: string;
  tgUsedDesc: string;
  tgOpenChannel: string;
  writeWhatsApp: string;
  // Catalog Header & Filters
  catalogTrustBadge: string;
  catalogTitle: string;
  searchPlaceholder: string;
  clearSearch: string;
  tradeInAppliedTitle: string;
  tradeInDiscountPrefix: string;
  tradeInDiscountSuffix: string;
  changeValuation: string;
  resetBtn: string;
  catalogPricesLabel: string;
  discountBadge: string;
  subcategoryLabel: string;
  allLabel: string;
  nothingFound: string;
  resetFilters: string;
  // Product Card
  warranty1Year: string;
  colorLabel: string;
  specialColorPrice: string;
  simTypeLabel: string;
  simEsim: string;
  simPhysical: string;
  storageLabel: string;
  sizeLabel: string;
  installmentWord: string;
  months12: string;
  months24: string;
  onRequest: string;
  promoTitle: string;
  promoSubtitle: string;
  cashTitle: string;
  cashSubtitle: string;
  orderNowWa: string;
  inCartQty: (qty: number) => string;
  addToCart: string;
  tradeInCardBtn: string;
  piecesShort: string;
  // Valuation Banner
  tradeInBannerEyebrow: string;
  tradeInBannerTitle: string;
  tradeInBannerDesc: string;
  tradeInBannerBtn: string;
  // Founder Section
  founderRoleBadge: string;
  founderStoryBadge: string;
  founderSubtitle: string;
  founderBioStart: string;
  founderBioRest: string;
  founderStatYears: string;
  founderStatFollowers: string;
  subscribersText: (count: string) => string;
  shopAccountTitle: string;
  shopAccountSubtitle: string;
  // Messengers Bar
  directContactTitle: string;
  tgOnlyUsedBadge: string;
  directContactDesc: string;
  usedCatalogBtn: string;
  gisAlmaty: string;
  // FAQ
  faqEyebrow: string;
  faqTitle: string;
  faqSubtitle: string;
  onlineCalcBtn: string;
  evaluateWaBtn: string;
  tgTradeInChannelBtn: string;
  backToCatalogTop: string;
  openTgChannel: string;
  // FAQ Quick Cards
  otherQuestionsTitle: string;
  otherQuestionsDesc: string;
  askWaBtn: string;
  lookingForUsedTitle: string;
  onlyUsedBadge: string;
  lookingForUsedDesc: string;
  tgUsedBtn: string;
  wantTradeInTitle: string;
  wantTradeInDesc: string;
  calcOnlineBtn: string;
  // Advantages
  whyTitle: string;
  whySubtitle: string;
  adv1Title: string;
  adv1Desc: string;
  adv2Title: string;
  adv2Desc: string;
  adv3Title: string;
  adv3Desc: string;
  adv4Title: string;
  adv4Desc: string;
  // Contacts
  contactsEyebrow: string;
  contactsTitle: string;
  contactsSubtitle: string;
  schedulePrefix: string;
  workHoursLabel: string;
  phoneNumberLabel: string;
  // Valuation Page
  valBadge: string;
  valTitle: string;
  valDesc: string;
  valReset: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: (gen: string) => string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  quickSelect: string;
  step5Title: string;
  step5Desc: string;
  gradations4: string;
  step6Title: string;
  step6Desc: string;
  blockedWarning: string;
  blockedReasonText: string;
  blockedCalcReason: string;
  prelimCalcTitle: string;
  copied: string;
  copy: string;
  finalSumNote: string;
  buybackImpossible: string;
  modelLabel: string;
  batteryShort: string;
  bodyShort: string;
  extrasShort: string;
  sendBuybackWa: string;
  applyTradeInBtn: (price: string) => string;
  guarantee1: string;
  guarantee2: string;
  guarantee3: string;
  tgCardEyebrow: string;
  tgCardDesc: string;
  openBtn: string;
  // How it works
  howEyebrow: string;
  howTitle: string;
  howSubtitle: string;
  howStep1Title: string;
  howStep1Desc: string;
  howStep2Title: string;
  howStep2Desc: string;
  howStep3Title: string;
  howStep3Desc: string;
  // Valuation FAQ
  valFaqEyebrow: string;
  valFaqTitle: string;
  valFaqSubtitle: string;
  // Telegram Showcase & Catalog Callout
  verifiedChannelBadge: string;
  tgShowcaseTitle: string;
  tgShowcaseDesc: string;
  goToTg: string;
  catalogInStockEyebrow: string;
  readyToChooseTitle: string;
  readyToChooseDesc: string;
  goToCatalogBtn: string;
  // Footer & Bottom Nav
  footerDesc: string;
  navValuationShort: string;
  // Cart Drawer
  cartHeader: string;
  closeCartAria: string;
  cartHelperNote: string;
  cartEmptyTitle: string;
  cartEmptyDesc: string;
  goCatalogBtn: string;
  colorPrefix: string;
  perPieceSuffix: string;
  removeItemAria: string;
  paymentForItemLabel: string;
  decreaseQtyAria: string;
  increaseQtyAria: string;
  tradeInCartDiscount: (model: string) => string;
  tradeInPrelimNote: string;
  tradeInFromCartBtn: string;
  totalToPayWithTradeIn: string;
  totalToPay: string;
  unpricedNote: string;
  checkoutWaBtn: string;
  orderCopied: string;
  copyOrderText: string;
  clearCartBtn: string;
  // WhatsApp / Copy messages
  waOneClickGreeting: (shopName: string) => string;
  waModel: string;
  waColor: string;
  waPaymentMethod: string;
  waPrice: string;
  waAvailabilityAsk: string;
  waCartGreeting: string;
  waMyItems: string;
  waQuantity: string;
  waManagerClarify: string;
  waUnpricedSuffix: string;
  waItemsSum: string;
  waTradeInOffset: (model: string) => string;
  waTotalWithTradeIn: string;
  waTotalPay: string;
  waSellGreeting: (shopName: string) => string;
  waBattery: string;
  waBody: string;
  waExtras: string;
  waSiteValuation: string;
  waVisitAsk: string;
  waDefaultConsult: string;
  waTradeInFaqMsg: string;
  waGeneralQuestionMsg: string;
  copyValuationSummaryText: (model: string, storage: string, battery: number, body: string, price: string) => string;
  onlyEsimLabel: (deduction: string) => string;
}

export const TRANSLATIONS: Record<Lang, Translations> = {
  ru: {
    pageTitle: 'Bylance — Каталог техники и оценка iPhone в Алматы',
    brandSubtitle: 'Электроника в Алматы',
    openMenu: 'Открыть меню',
    toCatalogAria: 'В каталог Bylance',
    navCatalog: 'Каталог',
    navTradeIn: 'Trade-In',
    navFounder: 'Об основательнице',
    navFaq: 'FAQ',
    navContacts: 'Контакты',
    toggleTheme: 'Сменить тему',
    themeToLight: 'Переключить на светлую тему',
    themeToDark: 'Переключить на тёмную тему',
    openCartAria: 'Открыть корзину',
    cartLabel: 'Корзина',

    catalogCategories: 'Категории каталога:',
    allProducts: 'Все товары',
    appleTech: 'Техника Apple',
    dysonDevices: 'Устройства Dyson',
    photoAndGadgets: 'Фото и гаджеты',
    sectionsLabel: 'Разделы:',
    howBuybackWorks: 'Как работает выкуп (3 шага)',
    founderName: 'Аружан Жеткерген',
    founderBadge: 'Основательница',
    faqFull: 'Частые вопросы (FAQ)',
    contactsAlmaty: 'Контакты в Алматы',
    tgUsedTitle: 'Каталог Б/У техники в Telegram',
    tgUsedDesc: 'В нашем Telegram публикуются исключительно проверенные Б/У устройства и Trade-In с фото и АКБ.',
    tgOpenChannel: 'Перейти в Telegram-канал ↗',
    writeWhatsApp: 'Написать в WhatsApp',

    catalogTrustBadge: '100% Оригинальная техника с официальной гарантией 1 год',
    catalogTitle: 'Каталог устройств в наличии',
    searchPlaceholder: 'Поиск по названию модели...',
    clearSearch: 'Очистить поиск',
    tradeInAppliedTitle: 'Учтен ваш Trade-In:',
    tradeInDiscountPrefix: 'Скидка',
    tradeInDiscountSuffix: 'на покупку любого нового устройства!',
    changeValuation: 'Изменить оценку',
    resetBtn: 'Сбросить',
    catalogPricesLabel: 'Цены в каталоге:',
    discountBadge: 'Скидка',
    subcategoryLabel: 'Подкатегория:',
    allLabel: 'Все',
    nothingFound: 'Ничего не найдено по запросу',
    resetFilters: 'Сбросить фильтры',

    warranty1Year: '1 год официальной гарантии',
    colorLabel: 'Цвет:',
    specialColorPrice: 'Спеццена для цвета',
    simTypeLabel: 'Тип SIM-карты:',
    simEsim: 'eSIM',
    simPhysical: 'Физическая SIM',
    storageLabel: 'Объём памяти:',
    sizeLabel: 'Размер корпуса:',
    installmentWord: 'рассрочка',
    months12: '12 мес',
    months24: '24 мес',
    onRequest: 'По запросу',
    promoTitle: 'АКЦИЯ',
    promoSubtitle: 'при онлайн-оплате',
    cashTitle: 'НАЛИЧНЫМИ',
    cashSubtitle: 'бумажные деньги',
    orderNowWa: 'Заказать сразу в WhatsApp',
    inCartQty: (qty) => `В корзине (${qty} шт.) +`,
    addToCart: 'В корзину',
    tradeInCardBtn: 'Сдать старый iPhone по Trade-In',
    piecesShort: 'шт.',

    tradeInBannerEyebrow: 'Trade-In и Выкуп iPhone в Алматы',
    tradeInBannerTitle: 'Хотите сдать свой старый iPhone или обменять на новый?',
    tradeInBannerDesc: 'Узнайте точную стоимость вашего устройства в нашем онлайн-калькуляторе на отдельной странице оценки. Выплата сразу деньгами или скидка на новый товар!',
    tradeInBannerBtn: 'Перейти к оценке iPhone',

    founderRoleBadge: 'Основательница Bylance',
    founderStoryBadge: 'Основательница магазина Bylance',
    founderSubtitle: 'Казахстанский блогер и предпринимательница (Алматы & Астана)',
    founderBioStart: 'Основательница магазина',
    founderBioRest: ', который уже более трех лет специализируется на продаже оригинальной техники брендов Apple и Dyson. В социальных сетях Аружан делится честными обзорами гаджетов, бэкстейджами ведения бизнеса, лайфстайлом и путешествиями.',
    founderStatYears: 'Более 3 лет в бизнесе',
    founderStatFollowers: '360 000+ подписчиков',
    subscribersText: (count) => `${count} подписчиков`,
    shopAccountTitle: 'Магазин @bylance_kz ↗',
    shopAccountSubtitle: 'Оригинал Apple & Dyson',

    directContactTitle: 'Прямая связь и каталог Б/У техники',
    tgOnlyUsedBadge: 'Telegram: только Б/У',
    directContactDesc: 'Новая техника в WhatsApp с моментальной консультацией, а свежие поступления проверенной Б/У техники — в Telegram.',
    usedCatalogBtn: 'Каталог Б/У ↗',
    gisAlmaty: '2ГИС Алматы',

    faqEyebrow: 'Помощь покупателю',
    faqTitle: 'Часто задаваемые вопросы (FAQ)',
    faqSubtitle: 'Ответы на популярные вопросы о рассрочке, гарантии, способах оплаты и получении заказов',
    onlineCalcBtn: 'Онлайн-калькулятор оценки →',
    evaluateWaBtn: 'Оценить в WhatsApp у сотрудника',
    tgTradeInChannelBtn: 'Канал Trade-In и Б/У в Telegram',
    backToCatalogTop: 'Наверх к каталогу ↑',
    openTgChannel: 'Открыть Telegram-канал',

    otherQuestionsTitle: 'Остались другие вопросы по товару или покупке?',
    otherQuestionsDesc: 'Напишите нам в WhatsApp — наши ответят',
    askWaBtn: 'Задать вопрос в WhatsApp',
    lookingForUsedTitle: 'Ищете проверенную Б/У технику или Trade-In?',
    onlyUsedBadge: 'Только Б/У',
    lookingForUsedDesc: 'Вся проверенная Б/У техника и устройства по Trade-In выкладываются исключительно в нашем Telegram-канале с живыми фото, процентом АКБ и актуальными ценами.',
    tgUsedBtn: 'Канал Б/У в Telegram ↗',
    wantTradeInTitle: 'Хотите обменять старый iPhone на новую технику с доплатой?',
    wantTradeInDesc: 'По программе Trade-In принимаются исключительно оригинальные Apple iPhone. Оценка онлайн на сайте и точный осмотр в магазине!',
    calcOnlineBtn: 'Оценить в калькуляторе онлайн →',

    whyTitle: 'Почему технику выбирают в Bylance',
    whySubtitle: 'Надёжный магазин в Алматы с честными ценами и официальной гарантией',
    adv1Title: '100% Оригинал',
    adv1Desc: 'Исключительно новые запечатанные устройства в заводской упаковке. Официальная гарантия 1 год на Apple и Dyson.',
    adv2Title: 'Рассрочка Kaspi и Halyk',
    adv2Desc: 'Оформление через Kaspi.kz и Halyk Bank на 3, 6, 12 или 24 месяца удаленно в WhatsApp или в магазине.',
    adv3Title: 'Программа Trade-In',
    adv3Desc: 'Принимаются исключительно оригинальные Apple iPhone: предварительный расчёт на сайте и точная оценка в магазине.',
    adv4Title: 'Быстрый заказ в WhatsApp',
    adv4Desc: 'Заказ в 1 клик с карточки или отправка списка покупок из корзины прямо нашему менеджеру.',

    contactsEyebrow: 'Контакты и адреса',
    contactsTitle: 'Магазины Bylance',
    contactsSubtitle: 'Один магазин продает только новые устройства, второй — б/у iPhone',
    schedulePrefix: 'Режим:',
    workHoursLabel: 'График работы:',
    phoneNumberLabel: 'Номер телефона',

    valBadge: 'Оценка iPhone · Скупка и Trade-In в Алматы',
    valTitle: 'Узнайте, за сколько мы купим ваш iPhone',
    valDesc: 'Выберите поколение, память и состояние. Расчёт появится сразу, а заявку можно мгновенно отправить в WhatsApp или зачесть в Trade-In на новую технику.',
    valReset: 'Сбросить параметры',
    step1Title: 'Поколение iPhone',
    step1Desc: 'Выберите линейку вашего телефона',
    step2Title: 'Версия модели',
    step2Desc: (gen) => `Выберите модификацию для iPhone ${gen}`,
    step3Title: 'Объём встроенной памяти',
    step3Desc: 'Указан в Настройки → Основные → Об этом устройстве',
    step4Title: 'Ёмкость аккумулятора (АКБ)',
    step4Desc: 'Настройки → Аккумулятор → Состояние аккумулятора',
    quickSelect: 'Быстрый выбор:',
    step5Title: 'Состояние корпуса и стекла',
    step5Desc: 'Оцените внешний вид устройства',
    gradations4: '4 градации',
    step6Title: 'Дополнительные параметры и нюансы',
    step6Desc: 'Отметьте, если есть особенности комплектации или ремонта',
    blockedWarning: 'Внимание: устройства с чужим Apple ID или блокировкой активации не выкупаются.',
    blockedReasonText: 'Заблокирован iCloud / чужой Apple ID',
    blockedCalcReason: 'Телефоны с блокировкой iCloud или чужим Apple ID мы не покупаем.',
    prelimCalcTitle: 'Предварительный расчет',
    copied: 'Скопировано!',
    copy: 'Копировать',
    finalSumNote: 'Итоговая сумма подтверждается после 5-минутного осмотра в магазине (ул. Василия Клочкова, 119 или 2 этаж, 20 сектор, 23 витрина)',
    buybackImpossible: 'Выкуп невозможен',
    modelLabel: 'Модель:',
    batteryShort: 'АКБ:',
    bodyShort: 'Корпус:',
    extrasShort: 'Особенности:',
    sendBuybackWa: 'Отправить заявку на выкуп в WhatsApp',
    applyTradeInBtn: (price) => `Обменять на новый по Trade-In (скидка ${price})`,
    guarantee1: 'Деньги сразу: наличными или переводом на Kaspi Gold',
    guarantee2: 'Быстрая диагностика за 5–10 минут при вас',
    guarantee3: 'Честный расчет без скрытых комиссий',
    tgCardEyebrow: 'Каталог Б/У в Telegram:',
    tgCardDesc: 'Реальные фото устройств и остаток АКБ',
    openBtn: 'Открыть',

    howEyebrow: 'Прозрачный процесс',
    howTitle: 'Как работает скупка и Trade-In в Bylance',
    howSubtitle: 'Всего 3 простых шага от онлайн-оценки до получения денег или нового телефона',
    howStep1Title: 'Оцените онлайн',
    howStep1Desc: 'Выберите вашу модель iPhone, объём памяти и состояние аккумулятора в калькуляторе выше. Это занимает ровно минуту.',
    howStep2Title: 'Отправьте заявку в WhatsApp',
    howStep2Desc: 'Нажмите «Отправить заявку» — откроется WhatsApp с заполненной спецификацией вашего устройства. Менеджер подтвердит время визита.',
    howStep3Title: 'Приезжайте и получите оплату',
    howStep3Desc: 'Мастер проверит телефон за 5–10 минут в магазине Bylance. Сразу выплачиваем деньги наличными/Kaspi или оформляем новый гаджет с зачетом суммы.',

    valFaqEyebrow: 'Частые вопросы по выкупу',
    valFaqTitle: 'Вопросы о выкупе и Trade-In iPhone',
    valFaqSubtitle: 'Всё о диагностике, расчёте стоимости, способах выплаты и обмене на новый гаджет',

    verifiedChannelBadge: 'Канал проверенной техники',
    tgShowcaseTitle: 'Каталог Б/У в Telegram:',
    tgShowcaseDesc: 'Каждый день выкладываем проверенные iPhone с остатком аккумулятора, подробными фото и ценой выкупа/продажи.',
    goToTg: 'Перейти в',
    catalogInStockEyebrow: 'Каталог техники в наличии',
    readyToChooseTitle: 'Готовы выбрать новое устройство?',
    readyToChooseDesc: 'В нашем каталоге представлены новые запечатанные Apple iPhone, MacBook, iPad, стайлеры Dyson и фототехника с гарантией и рассрочкой.',
    goToCatalogBtn: 'Перейти в каталог магазина',

    footerDesc: 'Магазин оригинальной электроники в Алматы',
    navValuationShort: 'Оценка iPhone',

    cartHeader: 'Корзина товаров',
    closeCartAria: 'Закрыть корзину',
    cartHelperNote: 'Вы можете выбрать разный способ оплаты для каждого товара (например, один через Kaspi, другой за наличные).',
    cartEmptyTitle: 'В корзине пока ничего нет',
    cartEmptyDesc: 'Выберите нужные товары в каталоге и добавьте их в корзину для быстрой отправки заказа в WhatsApp.',
    goCatalogBtn: 'Перейти в каталог',
    colorPrefix: 'Цвет:',
    perPieceSuffix: 'за шт.',
    removeItemAria: 'Удалить товар',
    paymentForItemLabel: 'Способ оплаты для этого товара:',
    decreaseQtyAria: 'Уменьшить количество',
    increaseQtyAria: 'Увеличить количество',
    tradeInCartDiscount: (model) => `Скидка Trade-In (${model})`,
    tradeInPrelimNote: 'Учтено по предварительной оценке',
    tradeInFromCartBtn: 'Сдать свой старый iPhone в Trade-In (минус от цены)',
    totalToPayWithTradeIn: 'Итого к доплате:',
    totalToPay: 'Итого к оплате:',
    unpricedNote: '* В заказе есть позиции с ценой по запросу, менеджер уточнит их стоимость в WhatsApp.',
    checkoutWaBtn: 'Оформить заказ через WhatsApp',
    orderCopied: 'Текст заказа скопирован!',
    copyOrderText: 'Скопировать текст заказа',
    clearCartBtn: 'Очистить корзину',

    waOneClickGreeting: (shopName) => `Здравствуйте! Хочу оформить заказ в ${shopName}:`,
    waModel: 'Модель',
    waColor: 'Цвет',
    waPaymentMethod: 'Способ оплаты',
    waPrice: 'Цена',
    waAvailabilityAsk: 'Подскажите, есть ли в наличии и как оформить доставку/самовывоз?',
    waCartGreeting: 'Здравствуйте! Хочу оформить заказ.',
    waMyItems: 'Мои товары:',
    waQuantity: 'Количество',
    waManagerClarify: 'Уточняется у менеджера',
    waUnpricedSuffix: ' (без учета позиций с ценой по запросу)',
    waItemsSum: 'Сумма товаров',
    waTradeInOffset: (model) => `• Зачет Trade-In (${model})`,
    waTotalWithTradeIn: '• Итого к доплате с учетом Trade-In',
    waTotalPay: 'Итого к оплате',
    waSellGreeting: (shopName) => `Здравствуйте! Хочу продать iPhone в ${shopName}.`,
    waBattery: 'Аккумулятор',
    waBody: 'Корпус',
    waExtras: 'Особенности',
    waSiteValuation: 'Оценка на сайте',
    waVisitAsk: '\nКогда можно приехать на проверку в магазин?',
    waDefaultConsult: 'Здравствуйте! Хочу проконсультироваться по покупке или Trade-In в магазине Bylance.',
    waTradeInFaqMsg: 'Здравствуйте! Хочу оценить свой iPhone по программе Trade-In в магазине Bylance.',
    waGeneralQuestionMsg: 'Здравствуйте! У меня есть вопрос по покупке техники в Bylance.',
    copyValuationSummaryText: (model, storage, battery, body, price) =>
      `${model} ${storage}, АКБ ${battery}%, ${body}. Оценка Bylance: ${price}`,
    onlyEsimLabel: (deduction) => `только eSIM (-${deduction})`,
  },
  kk: {
    pageTitle: 'Bylance — Алматыдағы түпнұсқа техника және iPhone бағалау',
    brandSubtitle: 'Алматыдағы техника',
    openMenu: 'Мәзірді ашу',
    toCatalogAria: 'Bylance каталогына өту',
    navCatalog: 'Каталог',
    navTradeIn: 'Trade-In',
    navFounder: 'Негізін қалаушы',
    navFaq: 'FAQ',
    navContacts: 'Байланыс',
    toggleTheme: 'Түнгі / күндізгі режимді ауыстыру',
    themeToLight: 'Күндізгі режимге ауыстыру',
    themeToDark: 'Түнгі режимге ауыстыру',
    openCartAria: 'Себетті ашу',
    cartLabel: 'Себет',

    catalogCategories: 'Санаттар:',
    allProducts: 'Барлық тауарлар',
    appleTech: 'Apple техникасы',
    dysonDevices: 'Dyson техникасы',
    photoAndGadgets: 'Фото және гаджеттер',
    sectionsLabel: 'Бөлімдер:',
    howBuybackWorks: 'Сатып алу тәртібі (3 қадам)',
    founderName: 'Аружан Жеткерген',
    founderBadge: 'Негізін қалаушы',
    faqFull: 'Жиі қойылатын сұрақтар (FAQ)',
    contactsAlmaty: 'Алматыдағы дүкендер',
    tgUsedTitle: 'Telegram-дағы Б/У техника',
    tgUsedDesc: 'Telegram-арнамызда тек тексерілген Б/У құрылғылар мен Trade-In телефондар нақты фотосымен, батарея күйімен жарияланады.',
    tgOpenChannel: 'Telegram-арнаға өту ↗',
    writeWhatsApp: 'WhatsApp-қа жазу',

    catalogTrustBadge: '100% түпнұсқа техника · 1 жыл ресми кепілдік',
    catalogTitle: 'Қолда бар техника каталогы',
    searchPlaceholder: 'Модель атауын жазып іздеңіз...',
    clearSearch: 'Тазалау',
    tradeInAppliedTitle: 'Trade-In жеңілдігі қосылды:',
    tradeInDiscountPrefix: 'Жаңа құрылғы бағасынан',
    tradeInDiscountSuffix: 'жеңілдік шегеріледі!',
    changeValuation: 'Бағалауды өзгерту',
    resetBtn: 'Болдырмау',
    catalogPricesLabel: 'Төлем түрі:',
    discountBadge: 'Жеңілдік',
    subcategoryLabel: 'Бөлім:',
    allLabel: 'Барлығы',
    nothingFound: 'Іздеу бойынша ештеңе табылмады:',
    resetFilters: 'Барлығын көрсету',

    warranty1Year: '1 жыл ресми кепілдік',
    colorLabel: 'Түсі:',
    specialColorPrice: 'Арнайы баға:',
    simTypeLabel: 'SIM түрі:',
    simEsim: 'eSIM',
    simPhysical: 'Физикалық SIM',
    storageLabel: 'Жад көлемі:',
    sizeLabel: 'Өлшемі:',
    installmentWord: 'бөліп төлеу',
    months12: '12 ай',
    months24: '24 ай',
    onRequest: 'Нақтыланады',
    promoTitle: 'АКЦИЯ',
    promoSubtitle: 'онлайн төлемде',
    cashTitle: 'ҚОЛМА-ҚОЛ',
    cashSubtitle: 'ақша не аударым',
    orderNowWa: 'WhatsApp арқылы бірден тапсырыс беру',
    inCartQty: (qty) => `Себетте (${qty} дана) +`,
    addToCart: 'Себетке қосу',
    tradeInCardBtn: 'Ескі iPhone-ды Trade-In-ге өткізу',
    piecesShort: 'дана',

    tradeInBannerEyebrow: 'Алматыда Trade-In және iPhone қабылдау',
    tradeInBannerTitle: 'Ескі iPhone-ыңызды сатқыңыз келе ме немесе жаңасына ауыстырғыңыз келе ме?',
    tradeInBannerDesc: 'Онлайн-калькулятор арқылы телефоныңыздың шамамен бағасын 1 минутта біліңіз. Ақшаны бірден алыңыз немесе жаңа техникаға жеңілдік ретінде қолданыңыз!',
    tradeInBannerBtn: 'iPhone-ды бағалау',

    founderRoleBadge: 'Bylance негізін қалаушы',
    founderStoryBadge: 'Bylance дүкенінің негізін қалаушы',
    founderSubtitle: 'Қазақстандық блогер әрі кәсіпкер (Алматы & Астана)',
    founderBioStart: 'Үш жылдан астам уақыт бойы Apple және Dyson брендтерінің түпнұсқа техникасын сатып келе жатқан',
    founderBioRest: ' дүкенінің негізін қалаушы. Аружан әлеуметтік желілерінде гаджеттерге шынайы шолу жасап, бизнес жүргізу тәжірибесімен, күнделікті өмірімен және саяхаттарымен бөліседі.',
    founderStatYears: 'Нарықта 3 жылдан астам',
    founderStatFollowers: '360 000+ оқырман',
    subscribersText: (count) => `${count} оқырман`,
    shopAccountTitle: 'Дүкен @bylance_kz ↗',
    shopAccountSubtitle: 'Түпнұсқа Apple & Dyson',

    directContactTitle: 'Тікелей байланыс және Б/У каталог',
    tgOnlyUsedBadge: 'Telegram: тек Б/У',
    directContactDesc: 'Жаңа техника бойынша лезде кеңес алу үшін WhatsApp-қа жазыңыз, ал тексерілген Б/У құрылғылардың жаңа түсімдерін Telegram-нан қараңыз.',
    usedCatalogBtn: 'Б/У каталог ↗',
    gisAlmaty: '2ГИС Алматы',

    faqEyebrow: 'Тұтынушыға көмек',
    faqTitle: 'Жиі қойылатын сұрақтар',
    faqSubtitle: 'Бөліп төлеу, кепілдік, төлем тәсілдері және тапсырыс беру туралы маңызды ақпарат',
    onlineCalcBtn: 'Онлайн бағалау калькуляторы →',
    evaluateWaBtn: 'WhatsApp-та бағалату',
    tgTradeInChannelBtn: 'Telegram-дағы Trade-In және Б/У арнасы',
    backToCatalogTop: 'Жоғарыға, каталогқа ↑',
    openTgChannel: 'Telegram-арнаны ашу:',

    otherQuestionsTitle: 'Тауар немесе тапсырыс бойынша сұрағыңыз бар ма?',
    otherQuestionsDesc: 'WhatsApp-қа жазыңыз — менеджерлеріміз бірден жауап береді',
    askWaBtn: 'WhatsApp-тан сұрау',
    lookingForUsedTitle: 'Тексерілген Б/У техника іздеп жүрсіз бе?',
    onlyUsedBadge: 'Тек Б/У',
    lookingForUsedDesc: 'Trade-In бойынша қабылданған және тексерілген барлық Б/У техника тек Telegram-арнамызда нақты фотосымен, батарея пайызымен және бағасымен жарияланады.',
    tgUsedBtn: 'Telegram-дағы Б/У арна ↗',
    wantTradeInTitle: 'Ескі iPhone-ды қосымша ақымен жаңасына ауыстырғыңыз келе ме?',
    wantTradeInDesc: 'Trade-In бағдарламасы бойынша тек түпнұсқа Apple iPhone қабылданады. Сайтта алдын ала есептеп, дүкенде нақты тексертіп алыңыз!',
    calcOnlineBtn: 'Онлайн калькуляторда бағалау →',

    whyTitle: 'Неге техниканы Bylance-тан алады',
    whySubtitle: 'Алматыдағы адал бағасы мен ресми кепілдігі бар сенімді дүкен',
    adv1Title: '100% Түпнұсқа',
    adv1Desc: 'Зауыттық қаптамасы ашылмаған су жаңа құрылғылар ғана. Apple және Dyson техникасына 1 жыл ресми кепілдік беріледі.',
    adv2Title: 'Kaspi және Halyk бөліп төлеуі',
    adv2Desc: 'Kaspi.kz пен Halyk Bank арқылы 3, 6, 12 немесе 24 айға WhatsApp арқылы қашықтан не дүкеннен рәсімдеуге болады.',
    adv3Title: 'Trade-In бағдарламасы',
    adv3Desc: 'Тек түпнұсқа Apple iPhone қабылдаймыз: сайтта алдын ала есептеу, дүкенде 5–10 минутта нақты бағалау.',
    adv4Title: 'WhatsApp арқылы жылдам тапсырыс',
    adv4Desc: 'Ұнаған тауарға бір батырмамен тапсырыс беріңіз немесе себеттегі тізімді тікелей менеджерге жіберіңіз.',

    contactsEyebrow: 'Байланыс және мекенжайлар',
    contactsTitle: 'Bylance дүкендері',
    contactsSubtitle: 'Бір дүкенде тек жаңа техника, екіншісінде тексерілген Б/У iPhone сатылады',
    schedulePrefix: 'Жұмыс уақыты:',
    workHoursLabel: 'Жұмыс уақыты:',
    phoneNumberLabel: 'Байланыс нөмірі',

    valBadge: 'iPhone бағалау · Алматыда сатып алу және Trade-In',
    valTitle: 'iPhone-ыңызды қаншаға қабылдайтынымызды біліңіз',
    valDesc: 'Моделін, жад көлемін және күйін таңдаңыз. Есептеу бірден шығады — өтінімді WhatsApp-қа жіберіп ақша алыңыз немесе жаңа техникаға Trade-In жеңілдігін қолданыңыз.',
    valReset: 'Тазалау',
    step1Title: 'iPhone сериясы',
    step1Desc: 'Телефоныңыздың буынын таңдаңыз',
    step2Title: 'Модель нұсқасы',
    step2Desc: (gen) => `iPhone ${gen} моделін таңдаңыз`,
    step3Title: 'Ішкі жад көлемі',
    step3Desc: 'Баптаулар (Настройки) → Негізгі (Основные) → Құрылғы туралы бөлімінен қараңыз',
    step4Title: 'Аккумулятор сыйымдылығы (АКБ)',
    step4Desc: 'Баптаулар (Настройки) → Аккумулятор → Аккумулятор күйі',
    quickSelect: 'Жылдам таңдау:',
    step5Title: 'Корпус пен экран күйі',
    step5Desc: 'Сыртқы күйін бағалаңыз',
    gradations4: '4 нұсқа',
    step6Title: 'Қосымша ерекшеліктері',
    step6Desc: 'Қорабы жоқ немесе жөндеуден өткен болса белгілеңіз',
    blockedWarning: 'Назар аударыңыз: бөтен Apple ID тіркелген немесе iCloud бұғатталған құрылғылар қабылданбайды.',
    blockedReasonText: 'iCloud бұғатталған / бөтен Apple ID',
    blockedCalcReason: 'iCloud бұғатталған немесе бөтен Apple ID бар телефондарды қабылдамаймыз.',
    prelimCalcTitle: 'Алдын ала бағасы',
    copied: 'Көшірілді!',
    copy: 'Көшіру',
    finalSumNote: 'Нақты бағасы дүкенде 5 минуттық тексеруден кейін расталады (Василий Клочков көш., 119 немесе 2-қабат, 20-сектор, 23-витрина)',
    buybackImpossible: 'Қабылдау мүмкін емес',
    modelLabel: 'Моделі:',
    batteryShort: 'АКБ:',
    bodyShort: 'Корпусы:',
    extrasShort: 'Ерекшеліктері:',
    sendBuybackWa: 'WhatsApp-қа сату өтінімін жіберу',
    applyTradeInBtn: (price) => `Trade-In-мен жаңасына ауыстыру (-${price})`,
    guarantee1: 'Төлем бірден: қолма-қол немесе Kaspi Gold аударымымен',
    guarantee2: 'Көз алдыңызда 5–10 минутта жылдам тексеру',
    guarantee3: 'Жасырын комиссиясыз әділ баға',
    tgCardEyebrow: 'Telegram-дағы Б/У каталог:',
    tgCardDesc: 'Шынайы фотолар және батарея қалдығы',
    openBtn: 'Ашу',

    howEyebrow: 'Ашық әрі оңай',
    howTitle: 'Bylance-та сатып алу мен Trade-In қалай өтеді',
    howSubtitle: 'Онлайн бағалаудан бастап ақша немесе жаңа телефон алғанға дейін бар болғаны 3 қадам',
    howStep1Title: 'Онлайн бағалаңыз',
    howStep1Desc: 'Жоғарыдағы калькуляторда iPhone моделін, жад көлемін және батарея күйін таңдаңыз. Бар болғаны 1 минут уақыт алады.',
    howStep2Title: 'WhatsApp-қа өтінім жіберіңіз',
    howStep2Desc: '«WhatsApp-қа сату өтінімін жіберу» батырмасын бассаңыз, барлық дерек толтырылған хабарлама ашылады. Менеджер келу уақытын келіседі.',
    howStep3Title: 'Келіңіз де төлем алыңыз',
    howStep3Desc: 'Маманымыз Bylance дүкенінде телефонды 5–10 минутта тексереді. Ақшасын бірден қолма-қол/Kaspi арқылы береміз не жаңа гаджет бағасынан шегереміз.',

    valFaqEyebrow: 'Қабылдау шарттары',
    valFaqTitle: 'iPhone сатып алу және Trade-In сұрақтары',
    valFaqSubtitle: 'Тексеру тәртібі, баға есептеу, төлем және жаңа құрылғыға ауыстыру туралы',

    verifiedChannelBadge: 'Тексерілген техника арнасы',
    tgShowcaseTitle: 'Telegram-дағы Б/У каталог:',
    tgShowcaseDesc: 'Күн сайын батарея пайызы, нақты фотосы және бағасы көрсетілген тексерілген iPhone-дарды салып отырамыз.',
    goToTg: 'Арнаға өту —',
    catalogInStockEyebrow: 'Қолда бар техника',
    readyToChooseTitle: 'Жаңа құрылғы таңдауға дайынсыз ба?',
    readyToChooseDesc: 'Каталогымызда кепілдігі мен бөліп төлеуі бар су жаңа Apple iPhone, MacBook, iPad, Dyson стайлерлері мен фототехника бар.',
    goToCatalogBtn: 'Дүкен каталогына өту',

    footerDesc: 'Алматыдағы түпнұсқа электроника дүкені',
    navValuationShort: 'iPhone бағалау',

    cartHeader: 'Себет',
    closeCartAria: 'Себетті жабу',
    cartHelperNote: 'Әр тауарға бөлек төлем түрін таңдауға болады (мысалы, бірін Kaspi-мен, екіншісін қолма-қол).',
    cartEmptyTitle: 'Себет әзірге бос',
    cartEmptyDesc: 'Каталогтан қалаған тауарыңызды таңдап, WhatsApp арқылы жылдам тапсырыс беру үшін себетке салыңыз.',
    goCatalogBtn: 'Каталогқа өту',
    colorPrefix: 'Түсі:',
    perPieceSuffix: 'данасы',
    removeItemAria: 'Тауарды өшіру',
    paymentForItemLabel: 'Осы тауардың төлем түрі:',
    decreaseQtyAria: 'Санын азайту',
    increaseQtyAria: 'Санын көбейту',
    tradeInCartDiscount: (model) => `Trade-In жеңілдігі (${model})`,
    tradeInPrelimNote: 'Алдын ала бағалау бойынша',
    tradeInFromCartBtn: 'Ескі iPhone-ды Trade-In-ге өткізу (бағадан шегеру)',
    totalToPayWithTradeIn: 'Қосымша төлем:',
    totalToPay: 'Барлығы төлемге:',
    unpricedNote: '* Тапсырыста бағасы нақтыланатын тауарлар бар, нақты құнын менеджер WhatsApp-та хабарлайды.',
    checkoutWaBtn: 'WhatsApp арқылы тапсырыс беру',
    orderCopied: 'Тапсырыс мәтіні көшірілді!',
    copyOrderText: 'Тапсырыс мәтінін көшіру',
    clearCartBtn: 'Себетті тазалау',

    waOneClickGreeting: (shopName) => `Сәлеметсіз бе! ${shopName} дүкенінен тапсырыс бергім келеді:`,
    waModel: 'Модель',
    waColor: 'Түсі',
    waPaymentMethod: 'Төлем түрі',
    waPrice: 'Бағасы',
    waAvailabilityAsk: 'Қолда бар ма? Жеткізу немесе алып кетуді қалай рәсімдесек болады?',
    waCartGreeting: 'Сәлеметсіз бе! Тапсырыс бергім келеді.',
    waMyItems: 'Таңдаған тауарларым:',
    waQuantity: 'Саны',
    waManagerClarify: 'Менеджер нақтылайды',
    waUnpricedSuffix: ' (бағасы нақтыланатын тауарларды қоспағанда)',
    waItemsSum: 'Тауарлар сомасы',
    waTradeInOffset: (model) => `• Trade-In шегерімі (${model})`,
    waTotalWithTradeIn: '• Trade-In шегерілгеннен кейінгі қосымша төлем',
    waTotalPay: 'Барлығы төлемге',
    waSellGreeting: (shopName) => `Сәлеметсіз бе! ${shopName} дүкеніне iPhone сатқым келеді.`,
    waBattery: 'Аккумулятор',
    waBody: 'Корпусы',
    waExtras: 'Ерекшеліктері',
    waSiteValuation: 'Сайттағы бағалау',
    waVisitAsk: '\nДүкенге тексертуге қашан келсем болады?',
    waDefaultConsult: 'Сәлеметсіз бе! Bylance дүкенінде техника сатып алу немесе Trade-In бойынша кеңес алғым келеді.',
    waTradeInFaqMsg: 'Сәлеметсіз бе! Bylance дүкенінде Trade-In бағдарламасы бойынша iPhone-ымды бағалатқым келеді.',
    waGeneralQuestionMsg: 'Сәлеметсіз бе! Bylance дүкенінен техника алу бойынша сұрағым бар еді.',
    copyValuationSummaryText: (model, storage, battery, body, price) =>
      `${model} ${storage}, АКБ ${battery}%, ${body}. Bylance бағасы: ${price}`,
    onlyEsimLabel: (deduction) => `тек eSIM (-${deduction})`,
  },
};

export function localizePaymentMethod(id: PaymentMethodId, lang: Lang): {
  name: string;
  shortLabel: string;
  badge: string;
  description: string;
} {
  if (lang === 'ru') {
    switch (id) {
      case 'kaspi':
        return { name: 'Kaspi рассрочка', shortLabel: 'Kaspi', badge: '0-0-12 / 0-0-24', description: 'Оформление рассрочки или кредита через Kaspi Bank' };
      case 'halyk':
        return { name: 'Halyk рассрочка', shortLabel: 'Halyk', badge: '0-0-12 / 0-0-24', description: 'Рассрочка без переплат через приложение Halyk Bank' };
      case 'promo':
        return { name: 'Акционная цена', shortLabel: 'Акция', badge: 'Спеццена', description: 'Специальная сниженная цена по текущей акции магазина' };
      case 'cash':
        return { name: 'Скидка за наличную оплату', shortLabel: 'Наличный расчёт', badge: 'Скидка', description: 'Лучшая цена при оплате наличными или прямым переводом' };
    }
  }
  switch (id) {
    case 'kaspi':
      return { name: 'Kaspi бөліп төлеу', shortLabel: 'Kaspi', badge: '0-0-12 / 0-0-24', description: 'Kaspi Bank арқылы бөліп төлеу не несиеге рәсімдеу' };
    case 'halyk':
      return { name: 'Halyk бөліп төлеу', shortLabel: 'Halyk', badge: '0-0-12 / 0-0-24', description: 'Halyk Bank қосымшасы арқылы пайызсыз бөліп төлеу' };
    case 'promo':
      return { name: 'Акциялық баға', shortLabel: 'Акция', badge: 'Арнайы баға', description: 'Дүкеннің арнайы акциясы бойынша төмендетілген баға' };
    case 'cash':
      return { name: 'Қолма-қол жеңілдік', shortLabel: 'Қолма-қол', badge: 'Жеңілдік', description: 'Қолма-қол ақшамен не тікелей аударым кезіндегі ең тиімді баға' };
  }
}

export function localizeCategory(id: MainCategory, lang: Lang): { name: string; description: string } {
  if (lang === 'ru') {
    switch (id) {
      case 'apple': return { name: 'Apple', description: 'iPhone, iPad, MacBook, AirPods, Apple Watch' };
      case 'dyson': return { name: 'Dyson', description: 'Стайлеры и выпрямители волос' };
      case 'other': return { name: 'Фото и гаджеты', description: 'Фотокамеры, Ray-Ban Meta, DJI, Яндекс Станция' };
    }
  }
  switch (id) {
    case 'apple': return { name: 'Apple', description: 'iPhone, iPad, MacBook, AirPods, Apple Watch' };
    case 'dyson': return { name: 'Dyson', description: 'Стайлерлер мен шаш түзеткіштер' };
    case 'other': return { name: 'Фото және гаджеттер', description: 'Фотокамералар, Ray-Ban Meta, DJI, Яндекс Станция' };
  }
}

export function localizeStoreAddress(addr: StoreAddress, lang: Lang): StoreAddress {
  if (lang === 'ru') return addr;
  if (addr.id === 'new-store') {
    return {
      ...addr,
      title: 'Жаңа техника дүкені',
      address: 'Василий Клочков көш., 119, 1-қабат (Бостандық ауданы, 050057)',
      description: 'Қорабы ашылмаған су жаңа түпнұсқа Apple, Dyson және басқа да гаджеттер — 1 жыл ресми кепілдікпен және бөліп төлеумен.',
      badge: 'Жаңа техника',
    };
  }
  return {
    ...addr,
    title: 'Б/У iPhone дүкені',
    address: 'Алматы қ., 2-қабат, 20-сектор, 23-витрина',
    description: 'Кепілдігі бар тексерілген Б/У iPhone-дар, көз алдыңызда жылдам тексеру және қолма-қол не Kaspi арқылы бірден төлем.',
    badge: 'Б/У iPhone',
  };
}

export function localizeBodyCondition(id: string, lang: Lang): { label: string; hint: string } {
  if (lang === 'ru') {
    switch (id) {
      case 'perfect': return { label: 'Идеальное', hint: 'Как новый, без следов' };
      case 'good': return { label: 'Хорошее', hint: 'Еле заметные потёртости' };
      case 'average': return { label: 'Среднее', hint: 'Мелкие царапины' };
      default: return { label: 'Плохое', hint: 'Заметные царапины, вмятины' };
    }
  }
  switch (id) {
    case 'perfect': return { label: 'Мінсіз', hint: 'Жаңа сияқты, ізі жоқ' };
    case 'good': return { label: 'Жақсы', hint: 'Аздаған ғана іздер бар' };
    case 'average': return { label: 'Орташа', hint: 'Ұсақ сызаттар бар' };
    default: return { label: 'Нашар', hint: 'Байқалатын сызат не соққы' };
  }
}

export function localizeExtraLabel(id: string, fallback: string, lang: Lang): string {
  if (lang === 'ru') return fallback;
  switch (id) {
    case 'esim_only': return 'Тек eSIM (АҚШ)';
    case 'no_box': return 'Қорабы мен қуаттағышы жоқ';
    case 'broken_biometrics': return 'Face ID / Touch ID істемейді';
    case 'replaced_glass': return 'Артқы панелі (әйнегі) ауысқан';
    case 'replaced_screen_orig': return 'Экраны ауысқан (түпнұсқа)';
    case 'replaced_screen': return 'Экраны ауысқан (түпнұсқа емес)';
    default: return fallback;
  }
}

export function localizeUsedModelLabel(label: string, lang: Lang): string {
  if (lang === 'ru') return label;
  if (label === 'Обычный') return 'Стандарт';
  return label;
}

const COLOR_KK_MAP: Record<string, string> = {
  'Burgundy (Бургунди/Бордовый)': 'Burgundy (Бордо)',
  'Glacier (Светло-голубой)': 'Glacier (Ашық көгілдір)',
  'Silver (Серебристый)': 'Silver (Күміс)',
  'Black (Чёрный)': 'Black (Қара)',
  'Lavender (Лавандовый)': 'Lavender (Лаванда)',
  'Sage (Зелёный шалфей)': 'Sage (Жасыл сәлбен)',
  'Mist Blue (Дымчато-голубой)': 'Mist Blue (Тұманды көгілдір)',
  'White (Белый)': 'White (Ақ)',
  'Sky Blue (Небесно-голубой)': 'Sky Blue (Аспан көк)',
  'Light Gold (Светло-золотистый)': 'Light Gold (Ашық алтын)',
  'Cloud White (Облачно-белый)': 'Cloud White (Ақша бұлт)',
  'Space Black (Космический чёрный)': 'Space Black (Қою қара)',
  'Cosmic Orange (Космический оранжевый)': 'Cosmic Orange (Қызғылт сары)',
  'Deep Blue (Глубокий синий)': 'Deep Blue (Қою көк)',
  'Pure White (Белоснежный)': 'Pure White (Аппақ)',
  'Light Blue (Голубой)': 'Light Blue (Көгілдір)',
  'Pink (Розовый)': 'Pink (Қызғылт)',
  'Yellow (Лимонный)': 'Yellow (Сары)',
  'Blue (Синий)': 'Blue (Көк)',
  'Purple (Фиолетовый)': 'Purple (Күлгін)',
  'Space Gray (Серый космос)': 'Space Gray (Сұр)',
  'Starlight (Сияющая звезда)': 'Starlight (Ақшыл алтын)',
  'Midnight Blue (Тёмно-синий)': 'Midnight Blue (Қара-көк)',
  'Starlight Gold (Золотистый)': 'Starlight Gold (Алтын)',
  'Sky Blue (Небесный)': 'Sky Blue (Аспан көк)',
  'Neo Blue (Нео-синий)': 'Neo Blue (Нео-көк)',
  'Neo Pink (Нео-розовый)': 'Neo Pink (Нео-қызғылт)',
  'Neo Silver (Серебристый)': 'Neo Silver (Күміс)',
  'Neo Yellow (Солнечный)': 'Neo Yellow (Сары)',
  'Jet Black (Глянцевый чёрный)': 'Jet Black (Жылтыр қара)',
  'Space Grey (Космический серый)': 'Space Grey (Қою сұр)',
  'Rose Pink (Розовый)': 'Rose Pink (Қызғылт)',
  'Midnight Black (Тёмная ночь)': 'Midnight Black (Қою қара)',
  'Starlight Gold (Сияющая звезда)': 'Starlight Gold (Ақшыл алтын)',
  'Ceramic Pink (Керамический розовый)': 'Ceramic Pink (Керамикалық қызғылт)',
  'Prussian Blue (Синий индиго)': 'Prussian Blue (Индиго көк)',
  'Red Velvet (Красный бархат)': 'Red Velvet (Қызыл барқыт)',
  'Jasper Plum (Яшмовая слива)': 'Jasper Plum (Қою күлгін)',
  'Chocolate (Шоколадный)': 'Chocolate (Шоколад түстес)',
  'Apricot (Абрикосовый)': 'Apricot (Шабдалы түстес)',
  'Nickel / Copper (Никель и медь)': 'Nickel / Copper (Никель мен мыс)',
  'Strawberry Bronze (Клубничная бронза)': 'Strawberry Bronze (Қола қызғылт)',
  'Серый (Silver Grey)': 'Сұр (Silver Grey)',
  'Черный (Black)': 'Қара (Black)',
  'Лимитированная серия': 'Шектеулі серия',
};

export function localizeColorName(name: string, lang: Lang): string {
  if (lang === 'ru') return name;
  return COLOR_KK_MAP[name] || name;
}

export function localizeProductName(name: string, lang: Lang): string {
  if (lang === 'ru') return name;
  return name
    .replace('(базовый)', '(базалық)')
    .replace('(новый)', '(жаңа)')
    .replace('с беспроводной зарядкой', 'сымсыз қуатталатын')
    .replace('хамелеон очки с бриллиантом', 'гауһар тасты хамелеон көзілдірік')
    .replace(' серый', ' сұр')
    .replace(' черный', ' қара')
    .replace(' лимит', ' лимит')
    .replace('Яндекс станция лайт2', 'Яндекс Станция Лайт 2')
    .replace('Яндекс станция Стрит', 'Яндекс Станция Стрит')
    .replace('Яндекс станция Миди', 'Яндекс Станция Миди');
}

export function localizeProductSubtitle(subtitle: string | undefined, lang: Lang): string | undefined {
  if (!subtitle || lang === 'ru') return subtitle;
  if (subtitle === 'В помещении прозрачные / на солнце темнеют') {
    return 'Бөлмеде мөлдір · күн сәулесінде қараяды';
  }
  return subtitle;
}

export function localizeSubcategory(subcat: string, lang: Lang): string {
  if (lang === 'ru') return subcat;
  return subcat
    .replace('(Базовый)', '(Базалық)')
    .replace('(Новый)', '(Жаңа)');
}
