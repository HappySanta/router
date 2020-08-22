export interface RouterConfig {
    /**
     * Добавить вывод логов для отладки переходов
     */
    enableLogging?: boolean;
    enableErrorThrowing?: boolean;
    defaultPage?: string;
    defaultView?: string;
    defaultPanel?: string;
    /**
     * всегда используйте `true` чтобы избежать путаницы с адресами vk.com/app123#product/123 и vk.com/app123#/product/123
     */
    noSlash?: boolean;
}
