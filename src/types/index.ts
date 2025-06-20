export interface MedicalSummary {
  id: string;
  summary: string;
  ipfsCid?: string;
  qrCode?: string;
  timestamp: Date;
  originalData: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}