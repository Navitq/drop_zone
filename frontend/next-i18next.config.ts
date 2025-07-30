import path from 'path';

const nextI18NextConfig = {
  i18n: {
    defaultLocale: 'ru',
    locales: ['en', 'ru'],
  },
  localePath: path.resolve('./src/locales'),
  localeStructure: '{{lng}}/{{ns}}',
};

export default nextI18NextConfig;
