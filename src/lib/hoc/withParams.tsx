import React, { ComponentType } from 'react';
import { RouterParams, useParams } from '../..';
import { getDisplayName } from '../tools';

/**
 * HOC для добавления
 * params:{@link PageParams}
 * в компонент
 * параметры не обновляются при переходах по страницам
 * @param Component
 * @param panelId если true, то из props будет взято свойство id для передачи в {@link useParams}, если строка то она будет передана
 */
export function withParams<T extends RouterParams>(Component: ComponentType<T>, panelId: string | boolean = false): ComponentType<Omit<T, keyof RouterParams>> {
  function WithParams(props: Omit<T, keyof RouterParams>) {
    let proxyPanelId: string | undefined = undefined;
    if (typeof panelId === 'string') {
      proxyPanelId = panelId;
    } else if (panelId) {
      const p = props as any as { id: string };
      if (p && p.id) {
        proxyPanelId = p.id;
      }
    }
    const params: RouterParams = {
      params: useParams(proxyPanelId),
    };
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const allProps: T = { ...props, ...params } as T;
    return <Component {...allProps} />;
  }

  WithParams.displayName = `WithParams(${getDisplayName(Component)})`;
  return WithParams;
}
