import loadable from '@loadable/component';
import { useEffect } from 'react';

const Olark = loadable(() => import('./olark'));
const Stripe = loadable(() => import('./stripe'));

const useExternals = () => {
    useEffect(() => {
        Stripe.preload();
        setTimeout(() => {
            Olark.preload();
        }, 4000);
    }, []);
};

export default useExternals;
