interface Urls {
    [props: string]: string
}

export const BACKEND_PATHS: Urls = {
    getUser: '',
    getPosts: '',
    createPost: '',
}

export const FRONTEND_PATHS: Urls = {
    home: '/',
    contracts: '/contracts',
    battles: '/battles',
    raffles: '/raffles',
    faq: '/faq',
    upgrades: '/upgrades',
    privacyPolicy: '/privacy-policy',
    termsOfService: '/terms-of-service',
}
