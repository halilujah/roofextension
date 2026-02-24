'use client';

import dynamic from 'next/dynamic';

const ConfiguratorLayout = dynamic(
  () => import('@/components/layout/ConfiguratorLayout'),
  { ssr: false }
);

export default function Home() {
  return <ConfiguratorLayout />;
}
