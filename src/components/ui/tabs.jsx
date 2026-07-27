import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext({ activeTab: '', setActiveTab: () => {} });

export function Tabs({ defaultValue, value, onValueChange, className, children }) {
  const [currentTab, setCurrentTab] = React.useState(defaultValue || '');
  const activeTab = value !== undefined ? value : currentTab;
  
  const handleTabChange = (val) => {
    if (value === undefined) setCurrentTab(val);
    if (onValueChange) onValueChange(val);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }) {
  return (
    <div className={cn("inline-flex items-center justify-center rounded-xl bg-secondary/80 p-1 text-muted-foreground", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children, ...props }) {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all focus-visible:outline-none cursor-pointer",
        isActive
          ? "bg-card text-foreground shadow-xs font-semibold"
          : "text-muted-foreground hover:text-foreground hover:bg-card/50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children }) {
  const { activeTab } = React.useContext(TabsContext);
  if (activeTab !== value) return null;

  return (
    <div className={cn("mt-3 outline-none focus-visible:ring-2", className)}>
      {children}
    </div>
  );
}
