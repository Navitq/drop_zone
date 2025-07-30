
export async function loadMessages(
  locale: string,
  pages: string[]
): Promise<Record<string, string>> {
  const generalMessagesPromise: Promise<Record<string, string>> = import(`../locales/${locale}/general.json`).then(mod => mod.default);

  const otherMessagesPromises: Promise<Record<string, string>>[] = pages.map(page =>
    import(`../locales/${locale}/${page}.json`).then(mod => mod.default)
  );

  const messagesArray: Record<string, string>[] = await Promise.all([generalMessagesPromise, ...otherMessagesPromises]);

  return Object.assign({}, ...messagesArray);
}
