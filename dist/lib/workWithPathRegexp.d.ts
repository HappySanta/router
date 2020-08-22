/**
 * Создание пути из шаблона
 * @param pageId /user/:id
 * @param params {id:5,name:Ivan}
 * @return {string} /user/5?name=Ivan
 * @ignore
 */
export declare function generatePath(pageId: string, params?: Object): string;
/**
 * @ignore
 */
export interface MatchInterface {
    isExact: boolean;
    path: string;
    url: string;
    params: {
        [key: string]: string;
    };
}
/**
 * Проверка что строка удовлетворяет шаблону
 * @param location /user/5
 * @param pageId /user/:id([0-9]+)
 * @ignore
 */
export declare function matchPath(location: string, pageId: string): null | MatchInterface;
