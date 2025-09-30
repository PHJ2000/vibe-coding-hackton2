export type Metadata = {
  source: string;
  updatedAt: string;
  reliability: number;
};

export type ObservationData = {
  observedAt: string;
  seaSurfaceTemp: number;
  waveHeight: number;
  windSpeed: number;
  tideLevel: number;
};

export type ObservationResponse = {
  data: ObservationData;
  meta: Metadata;
};

export type SafetyAlert = {
  alertType: string;
  severity: "info" | "warning" | "high" | string;
  message: string;
  startsAt: string;
  endsAt?: string | null;
};

export type SafetyAlertResponse = {
  data: SafetyAlert[];
  meta: Metadata;
};

export type EventItem = {
  id: number;
  title: string;
  description: string;
  startsAt: string;
  endsAt?: string | null;
  latitude: number;
  longitude: number;
  tags: string[];
  price?: string | null;
};

export type Beach = {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  openSeason?: string | null;
  safetyLevel?: string | null;
};

export type RecommendationItem = {
  beach: Beach;
  score: number;
  reason: string;
  meta: Metadata;
};
