type caseType = "bloger_case" | "season_case" | "standart_case"
interface BackendPaths {
    getCases: string,
    vkAuth: string,
    googleAuth: string,
    steamAuth: string,
    refreshTocken: string,
    me: string,
    getCase: (typed: caseType) => string,
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

export const BACKEND_PATHS: BackendPaths = {
    getCases: '/cases/<str:case_type>/',
    vkAuth: '/oauth2/vk/login/',
    googleAuth: `/oauth2/google/login/`,
    steamAuth: `/oauth2/steam/login/`,
    refreshTocken: '/token/refresh/',
    me: '/me/',
    getCase: (typed: caseType) => `/cases/${typed}/`,
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
