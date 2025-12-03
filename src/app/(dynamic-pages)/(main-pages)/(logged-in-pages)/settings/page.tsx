'use client';

import { SimulationControls } from '@/components/Settings/SimulationControls';
import { DataSourceSettings } from '@/components/Settings/DataSourceSettings';
import { ModelSettings } from '@/components/Settings/ModelSettings';
import { TradingPreferences } from '@/components/Settings/TradingPreferences';
import { mockSimulationSettings } from '@/lib/mock-data';
import { useState } from 'react';
import type { SimulationSettings } from '@/types/trading';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SimulationSettings>(mockSimulationSettings);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <div className="space-y-4">
        <SimulationControls settings={settings} onSettingsChange={setSettings} />
        <DataSourceSettings settings={settings} onSettingsChange={setSettings} />
        <ModelSettings settings={settings} onSettingsChange={setSettings} />
        <TradingPreferences settings={settings} onSettingsChange={setSettings} />
      </div>
    </div>
  );
}

