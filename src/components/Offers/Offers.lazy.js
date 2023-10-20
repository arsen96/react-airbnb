import React, { lazy, Suspense } from 'react';

const LazyOffers = lazy(() => import('./Offers'));

const Offers = props => (
  <Suspense fallback={null}>
    <LazyOffers {...props} />
  </Suspense>
);

export default Offers;
