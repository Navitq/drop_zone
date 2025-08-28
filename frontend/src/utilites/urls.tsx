interface Urls {
    [key: string]: string | ((id: string) => string);
}

interface FrontendPaths {
    home: string;
    contracts: string;
    battles: string;
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
}



export const FRONTEND_PATHS: FrontendPaths = {
    home: '/',
    contracts: '/contracts',
    battles: '/battles',
    raffles: '/raffles',
    faq: '/faq',
    upgrades: '/upgrades',
    privacyPolicy: '/privacy-policy',
    termsOfService: '/terms-of-service',
    battlesCreate: '/battles/create',
    battlesConnect: (id: string) => `/battles/${id}`
};
