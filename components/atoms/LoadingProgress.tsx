'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
});

function LoadingProgress() {
  const pathname = usePathname();
  const [searchParamValue, setSearchParamValue] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setSearchParamValue(searchParams.toString());
  }, []);

  useEffect(() => {
    NProgress.start();

    const timer = setTimeout(() => {
      NProgress.done();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname, searchParamValue]);

  return null;
}

export { LoadingProgress };
