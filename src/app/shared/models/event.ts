export interface Event {
  id: number;
  title: string;
  description: string;
  nextControl: string;
  startTime: string;
  endTime: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  nextControl: string;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  nextControl?: string;
}