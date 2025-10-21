type caseType = "bloger_case" | "season_case" | "standart_case" | "all"

interface BackendPaths {
    totalActivities: string,
    logout: string,
    getCases: string,
    vkAuth: string,
    googleAuth: string,
    steamAuth: string,
    refreshTocken: string,
    advertisement: string,
    me: string,
    getRaffles: string,
    homePageBackground: string,
    takePartRaffles: string,
    getInventoryStaff: string,
    getServerInventoryStaff: string,
    upgradeItem: string,
    makeContract: string,
    createBattle: string,
    generalBattlesInfo: string,
    getActiveBattles: string,
    profile: string,
    setTradeLink: string,
    sellItem: string,
    makeBooking: string,
    getGameData: (typed: string) => string,
    playCaseGame: (typed: string) => string,
    getCaseItems: (typed: string) => string,
    getCase: (typed: caseType) => string,
    battleGameWSS: (typed: string, guest: boolean) => string,
    dropSliderWSS: () => string,
}



export const BACKEND_PATHS: BackendPaths = {

    totalActivities: "total-activities/",
    logout: '/logout/',
    getCases: '/cases/<str:case_type>/',
    vkAuth: '/oauth2/vk/login/',
    googleAuth: `/oauth2/google/login/`,
    steamAuth: `/oauth2/steam/login/`,
    refreshTocken: '/token/refresh/',
    advertisement: '/advertisement/',
    me: '/me/',
    getRaffles: '/raffles/',
    homePageBackground: "/main-page-background/",
    takePartRaffles: "/raffles/take-a-part/",
    getInventoryStaff: "/get-inventory-items/",
    getServerInventoryStaff: "/get-server-inventory-items/",
    upgradeItem: "/upgrade-item/",
    makeContract: "/make-contract/",
    createBattle: "/create-battles/",
    generalBattlesInfo: '/global-battle-info/',
    getActiveBattles: '/active-battle-info/',
    profile: '/profile-info/',
    setTradeLink: '/set-trade-link/',
    sellItem: "/sell-inventory-item/",
    makeBooking: "/book-inventory-item/",
    getGameData: (typed: string) => `/battles/game/${typed}/`,
    playCaseGame: (typed: string) => `/cases/open_case/${typed}/`,
    getCaseItems: (typed: string) => `/cases/get_case_content/${typed}/`,
    getCase: (typed: caseType) => `/cases/${typed}/`,
    battleGameWSS: (typed: string, guest: boolean) => `${process.env.NEXT_PUBLIC_API_WSS_BASE_URL}battle/${typed}/?guest=${guest}`,
    dropSliderWSS: () => `${process.env.NEXT_PUBLIC_API_WSS_BASE_URL}drop-slider/`,
}

interface FrontendPaths {
    home: string;
    contracts: string;
    battles: string;
    profile: string;
    raffles: string;
    faq: string;
    upgrades: string;
    privacyPolicy: string;
    termsOfService: string;
    battlesCreate: string;
    battlesConnect: (id: string) => string;
}

export const FRONTEND_PATHS: FrontendPaths = {
    home: '/',
    contracts: '/contracts',
    battles: '/battles',
    raffles: '/raffles',
    profile: '/profile',
    faq: '/faq',
    upgrades: '/upgrades',
    privacyPolicy: '/privacy-policy',
    termsOfService: '/terms-of-service',
    battlesCreate: '/battles/create',
    battlesConnect: (id: string) => `/battles/${id}`
};
