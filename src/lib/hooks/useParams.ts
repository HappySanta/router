import {PageParams, useLocation} from '../..';
import {useRef} from 'react';

/**
 * Возвращает {@link PageParams} текущего {@link Location}
 * если передать panelId то можно получить правильные параметры для "предыдущей" панели во время жеста swipe back
 * https://github.com/HappySanta/router/issues/16
 * @param {string} panelId id панели для которой надо получить параметры
 */
export function useParams(panelId?: string): PageParams {
  const location = useLocation(false, panelId);
  const params = useRef(location.getParams());
  return params.current;
}
