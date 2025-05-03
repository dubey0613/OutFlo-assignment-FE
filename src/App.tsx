import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/Tabs';
import CampaignDashboard from './features/campaigns/CampaignDashboard';
import LinkedInGenerator from './features/linkedin/LinkedInGenerator';
import Header from './components/layout/Header';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [activeTab, setActiveTab] = useState('campaigns');

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="campaigns">Campaign Management</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn Generator</TabsTrigger>
            </TabsList>
            <TabsContent value="campaigns" className="animate-in fade-in-50 duration-300">
              <CampaignDashboard />
            </TabsContent>
            <TabsContent value="linkedin" className="animate-in fade-in-50 duration-300">
              <LinkedInGenerator />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;