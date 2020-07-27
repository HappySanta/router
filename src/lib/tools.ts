import * as ptr from 'path-to-regexp';
import * as qs from 'querystring';

const cache: Map<string, [ptr.PathFunction, ptr.Token[]]> = new Map<string, [ptr.PathFunction, ptr.Token[]]>();
const cacheLimit: number = 10000;
let cacheCount: number = 0;

export function parsePath(pageId: string): [ptr.PathFunction, ptr.Token[]] {
	const cached = cache.get(pageId);
	if (cached) return cached;
	const tokens = ptr.parse(pageId);
	const generator = ptr.tokensToFunction(tokens);

	if (cacheCount < cacheLimit) {
		cache.set(pageId, [generator, tokens]);
		cacheCount++;
	}
	return [generator, tokens];
}

export function compilePath(pageId: string): ptr.PathFunction {
	return parsePath(pageId)[0];
}

export function generatePath(pageId: string, params?: Object) {
	if (!params) {
		params = {};
	}

	if (pageId === "/") return pageId;

	const [generatePath, tokens] = parsePath(pageId);
	const path = generatePath(params);
	const restParams: { [key: string]: any } = {...params};
	tokens.forEach(t => {
		if (typeof t === "object") {
			delete restParams[t.name.toString()]
		}
	});
	return path + "?" + qs.stringify(restParams as qs.ParsedUrlQueryInput)
}

interface CachedPath {
	regexp: ptr.PathRegExp,
	keys: ptr.Token[]
}

const convertCache = new Map<string, CachedPath>();

function convertPath(path: string, options?: ptr.RegExpOptions): CachedPath {
	const cacheKey = `${options?.end ? "1" : "0"}${options?.strict}${options?.sensitive}${path}`;
	const pathCache = convertCache.get(cacheKey);

	if (pathCache) return pathCache;

	const keys: ptr.Key[] = [];
	const regexp = ptr.tokensToRegExp(ptr.parse(path), keys, options);
	const result = {regexp, keys};

	if (cacheCount < cacheLimit) {
		convertCache.set(cacheKey, result);
		cacheCount++;
	}
	return result;
}

export interface MatchInterface {
	isExact: boolean
	path: string
	url: string
	params: { [key: string]: string }
}

export function matchPath(location: string, pageId: string): null | MatchInterface {
	const {regexp, keys} = convertPath(pageId, {
		end: false,
		strict: false,
		sensitive: false
	});
	const match = regexp.exec(location);
	if (!match) return null;

	const [url, ...values] = match;
	const isExact = location === url;

	return {
		path: pageId, // the path used to match
		url: pageId === "/" && url === "" ? "/" : url, // the matched portion of the URL
		isExact, // whether or not we matched exactly
		params: keys.reduce((memo, key, index) => {
			if (typeof key === "object") {
				memo[key.name] = values[index];
			}
			return memo;
		}, {} as { [key: string]: string })
	};
}

export default matchPath;


export function preventBlinkingBySettingScrollRestoration() {
	if ('scrollRestoration' in window.history && window.history.scrollRestoration === 'auto') {
		window.history.scrollRestoration = 'manual'
	}
}
