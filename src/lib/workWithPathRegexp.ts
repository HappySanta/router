/**
 * @ignore
 * @packageDocumentation
 */

import * as ptr from 'path-to-regexp';
import * as qs from 'querystring';

const cache: Map<string, [ptr.PathFunction, ptr.Token[]]> = new Map<string, [ptr.PathFunction, ptr.Token[]]>();
const cacheLimit = 10000;
let cacheCount = 0;

function parsePath(pageId: string): [ptr.PathFunction, ptr.Token[]] {
  const cached = cache.get(pageId);
  if (cached) {
    return cached;
  }
  const tokens = ptr.parse(pageId);
  const generator = ptr.tokensToFunction(tokens);

  if (cacheCount < cacheLimit) {
    cache.set(pageId, [generator, tokens]);
    cacheCount++;
  }
  return [generator, tokens];
}

interface CachedPath {
  regexp: RegExp;
  keys: ptr.Token[];
}

const convertCache = new Map<string, CachedPath>();

function convertPath(path: string, options?: ptr.TokensToRegexpOptions & ptr.ParseOptions): CachedPath {
  const cacheKey = `${options?.end ? '1' : '0'}${options?.strict}${options?.sensitive}${path}`;
  const pathCache = convertCache.get(cacheKey);

  if (pathCache) {
    return pathCache;
  }

  const keys: ptr.Key[] = [];
  const regexp = ptr.pathToRegexp(path, keys);
  const result = { regexp, keys };

  if (cacheCount < cacheLimit) {
    convertCache.set(cacheKey, result);
    cacheCount++;
  }
  return result;
}

/**
 * Создание пути из шаблона
 * @param pageId /user/:id
 * @param params {id:5,name:Ivan}
 * @return {string} /user/5?name=Ivan
 * @ignore
 */
export function generatePath(pageId: string, params?: {}): string {
  if (!params) {
    params = {};
  }
  params = { ...params };

  const [generatePath, tokens] = parsePath(pageId);
  const path = generatePath(params);
  const restParams: { [key: string]: any } = { ...params };
  tokens.forEach((t) => {
    if (typeof t === 'object') {
      delete restParams[t.name.toString()];
    }
  });
  const result = `${path}?${qs.stringify(restParams as qs.ParsedUrlQueryInput)}`;
  return result.replace(/\?$/gmu, '');
}

/**
 * @ignore
 */
export interface MatchInterface {
  isExact: boolean;
  path: string;
  url: string;
  params: { [key: string]: string };
}

/**
 * Проверка что строка удовлетворяет шаблону
 * @param location /user/5
 * @param pageId /user/:id([0-9]+)
 * @ignore
 */
export function matchPath(location: string, pageId: string): null | MatchInterface {
  const { regexp, keys } = convertPath(pageId, {
    end: false,
    strict: false,
    sensitive: false,
  });
  let match = regexp.exec(location);

  if (!match) {
    return null;
  }

  const [url, ...values] = match;
  const isExact = location === url;

  return {
    path: pageId, // the path used to match
    url: pageId === '/' && url === '' ? '/' : url, // the matched portion of the URL
    isExact, // whether or not we matched exactly
    params: keys.reduce<{ [key: string]: string }>((memo, key, index) => {
      if (typeof key === 'object') {
        memo[key.name] = values[index];
      }
      return memo;
    }, {}),
  };
}
