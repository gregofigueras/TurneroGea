export type UserRole = 'ADMIN' | 'PROFESSIONAL';

export type AppointmentStatus = 
  | 'CONFIRMED' 
  | 'CANCELLED_BY_CLIENT' 
  | 'CANCELLED_BY_PRO' 
  | 'RESCHEDULED' 
  | 'COMPLETED' 
  | 'NO_SHOW';

export type AppointmentSource = 
  | 'ONLINE' 
  | 'MANUAL_WPP' 
  | 'MANUAL_IG' 
  | 'MANUAL_LOCAL';

export interface Professional {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  is_active: boolean;
  services?: Service[];
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  color?: string;
  is_active: boolean;
}

export interface Schedule {
  id: string;
  professional_id: string;
  day_of_week: number; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  start_time: string;  // "14:00"
  end_time: string;    // "20:00"
}

export interface ScheduleOverride {
  id: string;
  professional_id: string;
  date: string;        // "YYYY-MM-DD"
  start_time?: string;
  end_time?: string;
  is_available: boolean;
  reason?: string;
}

export interface Appointment {
  id: string;
  cancellation_code: string;
  professional_id: string;
  service_id: string;
  start_datetime: string; // ISO String
  end_datetime: string;   // ISO String
  client_name: string;
  client_email: string;
  client_phone: string;
  status: AppointmentStatus;
  cancel_reason?: string;
  cancelled_at?: string;
  cancelled_by?: string;
  original_appointment_id?: string;
  source: AppointmentSource;
  notes?: string;
  created_at: string;
  
  // Relaciones cargadas opcionales
  professional?: Professional;
  service?: Service;
}
