
import React from 'react';
import TikTokDownloadPage from './components/TikTokDownloadPage';
import { LiquidGlassParams } from './types';

const App: React.FC = () => {
  const liquidGlassParams: LiquidGlassParams = {
    tintHex: '#ffffff',
    tintOpacity: 0.05, // Slightly visible by default for blur to work
    blur: 12,
    noiseFrequency: 0.45,
    noiseScale: 0,
    noiseOctaves: 2,
    innerShadowBlur: 43,
    innerShadowSpread: -10,
    highlightOpacity: 0.2
  };

  return (
    <div className="w-full h-full flex justify-center bg-zinc-950 overflow-hidden relative">
      <main className="w-full max-w-[420px] h-full bg-black shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden relative border-x border-white/5">
        <TikTokDownloadPage liquidGlassParams={liquidGlassParams} />
      </main>
    </div>
  );
};

export default App;
