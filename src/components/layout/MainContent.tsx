import type { ReactNode } from 'react';

type MainContentProps = {
  children: ReactNode;
};

export function MainContent({ children }: MainContentProps) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-w-0 flex-1 overflow-x-hidden bg-linear-to-br from-[#F7FBFF] via-white to-[#EEF6FF]"
    >
      <div className="mx-auto min-h-[calc(100vh-80px)] w-full max-w-[1800px] px-4 py-6 pb-28 sm:px-6 sm:py-8 lg:px-8 lg:pb-12 xl:px-10">
        {children}
      </div>
    </main>
  );
}