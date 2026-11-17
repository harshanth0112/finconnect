import React, { Suspense } from 'react';
import PageLoader from './PageLoader';

const LazyPage = ({ component: Component, ...props }) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component {...props} />
    </Suspense>
  );
};

export default LazyPage;

