interface Urls {
    [key: string]: string;
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

export const BACKEND_PATHS: Urls = {
    getActualCases: "",
    getBlogerCases: "",
    getUser: '',
    getPosts: '',
    createPost: '',
    vkAuth: '/oauth2/vk/login/',
    googleAuth: `/oauth2/google/login/`,
    steamAuth: `/oauth2/steam/login/`,
    refreshTocken: '/token/refresh/',
    me: '/me/',
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
