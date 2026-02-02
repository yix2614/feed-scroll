
export interface VideoData {
  id: string;
  username: string;
  avatar: string;
  caption: string;
  music: string;
  likes: string;
  comments: string;
  shares: string;
  thumbnail: string;
}

export interface LiquidGlassParams {
  tintHex: string;
  tintOpacity: number;
  blur: number;
  noiseFrequency: number;
  noiseScale: number;
  noiseOctaves: number;
  innerShadowBlur: number;
  innerShadowSpread: number;
  highlightOpacity: number;
}
