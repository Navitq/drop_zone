import localFont from 'next/font/local'

export const headBold = localFont({
    src: [
        {
            path: './play/Play-Bold.woff2',
            weight: '700',
            style: 'normal',
        },
        {
            path: './play/Play-Bold.woff',
            weight: '700',
            style: 'normal',
        },
        {
            path: './play/Play-Bold.otf',
            weight: '700',
            style: 'normal',
        },
        {
            path: './play/Play-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
    ],
    variable: '--font-headBold',
})

export const headRegular = localFont({
    src: [
        {
            path: './play/Play-Regular.woff2',
            weight: '700',
            style: 'normal',
        },
        {
            path: './play/Play-Regular.woff',
            weight: '700',
            style: 'normal',
        },
        {
            path: './play/Play-Regular.otf',
            weight: '700',
            style: 'normal',
        },
        {
            path: './play/Play-Regular.ttf',
            weight: '700',
            style: 'normal',
        },
    ],
    variable: '--font-headRegular',
})

export const textRegular = localFont({
    src: [
        {
            path: './carlito/Carlito-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './carlito/Carlito-Regular.woff',
            weight: '400',
            style: 'normal',
        },
        {
            path: './carlito/Carlito-Regular.otf',
            weight: '400',
            style: 'normal',
        },
        {
            path: './carlito/Carlito-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-textRegular',
})
