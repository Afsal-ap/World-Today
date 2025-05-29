import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* 🚧 Work in Progress Banner */}
      <div className="bg-yellow-100 text-yellow-800 text-center py-2 font-medium shadow-sm">
        🚧 This site is a work in progress. Some features may not work as expected.
      </div>
      {children}
    </>
  );
};

export default MainLayout;
