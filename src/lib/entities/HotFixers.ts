
/*
 * В сафари есть баг: во время вызова history.back() происходит перезагрузка страницы
 * Визуально выглядит как будто при закрытии модалок на крестик страница перезагружается
 * https://bugs.webkit.org/show_bug.cgi?id=209753
 * Предлагаемое решение: запушить лишнюю страницу после старта роутера
 */
export const USE_DESKTOP_SAFARI_BACK_BUG = 'desktop-safari-back-bug';

export const USE_ALL_FIXES = '*';

export type Fixer = typeof USE_DESKTOP_SAFARI_BACK_BUG|typeof USE_ALL_FIXES;
export type UsedFixers = Fixer[];
