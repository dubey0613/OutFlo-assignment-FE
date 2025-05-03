import React, { createContext, useContext, useState } from 'react';

type TabsContextType = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const Tabs = ({ 
  children, 
  value, 
  onValueChange,
  className = '' 
}: { 
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ 
  children,
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`flex border-b border-slate-200 dark:border-slate-700 ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ 
  children, 
  value,
  className = '' 
}: { 
  children: React.ReactNode;
  value: string;
  className?: string;
}) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }
  
  const { value: selectedValue, onValueChange } = context;
  const isActive = selectedValue === value;
  
  return (
    <button
      className={`px-4 py-2 font-medium text-sm transition-all duration-200 relative
      ${isActive 
        ? 'text-blue-600 dark:text-blue-400' 
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}
      ${className}`}
      onClick={() => onValueChange(value)}
    >
      {children}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 transform transition-transform duration-200" />
      )}
    </button>
  );
};

export const TabsContent = ({ 
  children, 
  value,
  className = '' 
}: { 
  children: React.ReactNode;
  value: string;
  className?: string;
}) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }
  
  const { value: selectedValue } = context;
  
  if (selectedValue !== value) {
    return null;
  }
  
  return <div className={`py-4 ${className}`}>{children}</div>;
};