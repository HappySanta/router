import { useContext, useEffect, useState } from 'react';
import { Router, RouterContext } from '../..';

const useForceUpdate = () => useState<number>(0)[1];

export function useRouter(withUpdate = false): Router {
  const router = useContext(RouterContext);
  if (!router) {
    throw new Error('Use useRoute without context');
  }
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    const fn = () => {
      if (withUpdate) {
        forceUpdate(Date.now());
      }
    };
    router.on('update', fn);
    return () => {
      router.off('update', fn);
    };
  }, []);
  return router;
}
