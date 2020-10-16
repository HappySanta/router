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
export function withParams<T>(Component: ComponentType<RouterParams & T>, panelId: string|boolean = false): ComponentType<T> {
  function WithParams(props: T) {
    let proxyPanelId: string|undefined = undefined;
    if (typeof panelId === 'string') {
      proxyPanelId = panelId;
    } else if (panelId) {
      const p = props as any as {id: string};
      if (p && p.id) {
        proxyPanelId = p.id;
      }
    }
    const params = useParams(proxyPanelId);
    return <Component {...props} params={params} />;
  }
  WithParams.displayName = `WithParams(${getDisplayName(Component)})`;
  return WithParams;
}
