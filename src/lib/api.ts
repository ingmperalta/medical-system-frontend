// frontend/src/lib/api.ts
import axios from 'axios';
// import type { Patient, Appointment, Prescription, MedicalRecord, LoginResponse, User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Interceptor para agregar el token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
// export const authApi = {
//   login: async (email: string, password: string) => {
//     const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
//     localStorage.setItem('token', data.access_token);
//     localStorage.setItem('user', JSON.stringify(data.user));
//     return data;
//   },

//   register: async (userData: any) => {
//     const { data } = await api.post('/auth/register', userData);
//     return data;
//   },

//   getProfile: async () => {
//     const { data } = await api.get<User>('/auth/profile');
//     return data;
//   },

//   logout: () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   },
// };

// Patients API
// export const patientsApi = {
//   getAll: async (search?: string) => {
//     const { data } = await api.get<Patient[]>('/patients', {
//       params: { search },
//     });
//     return data;
//   },

//   getById: async (id: string) => {
//     const { data } = await api.get<Prescription>(`/prescriptions/${id}`);
//     return data;
//   },

//   getByPatient: async (patientId: string) => {
//     const { data } = await api.get<Prescription[]>(`/prescriptions/patient/${patientId}`);
//     return data;
//   },

//   create: async (prescription: Partial<Prescription>) => {
//     const { data } = await api.post<Prescription>('/prescriptions', prescription);
//     return data;
//   },

//   update: async (id: string, prescription: Partial<Prescription>) => {
//     const { data } = await api.put<Prescription>(`/prescriptions/${id}`, prescription);
//     return data;
//   },

//   delete: async (id: string) => {
//     await api.delete(`/prescriptions/${id}`);
//   },

//   getPDF: async (id: string) => {
//     const { data } = await api.get(`/prescriptions/${id}/pdf`);
//     return data;
//   },
// };

// Medical History API
// export const medicalHistoryApi = {
//   getByPatient: async (patientId: string) => {
//     const { data } = await api.get<MedicalRecord[]>(`/medical-history/patient/${patientId}`);
//     return data;
//   },

//   getById: async (id: string) => {
//     const { data } = await api.get<MedicalRecord>(`/medical-history/${id}`);
//     return data;
//   },

//   getPatientSummary: async (patientId: string) => {
//     const { data } = await api.get(`/medical-history/patient/${patientId}/summary`);
//     return data;
//   },

//   create: async (record: Partial<MedicalRecord>) => {
//     const { data } = await api.post<MedicalRecord>('/medical-history', record);
//     return data;
//   },

//   update: async (id: string, record: Partial<MedicalRecord>) => {
//     const { data } = await api.put<MedicalRecord>(`/medical-history/${id}`, record);
//     return data;
//   },

//   delete: async (id: string) => {
//     await api.delete(`/medical-history/${id}`);
//   },
// };

// export default api async (id: string) => {
//     const { data } = await api.get<Patient>(`/patients/${id}`);
//     return data;
//   },

//   create: async (patient: Partial<Patient>) => {
//     const { data } = await api.post<Patient>('/patients', patient);
//     return data;
//   },

//   update: async (id: string, patient: Partial<Patient>) => {
//     const { data } = await api.put<Patient>(`/patients/${id}`, patient);
//     return data;
//   },

//   delete: async (id: string) => {
//     await api.delete(`/patients/${id}`);
//   },
// };


// Appointments API
// export const appointmentsApi = {
//   getAll: async (startDate?: string, endDate?: string) => {
//     const { data } = await api.get<Appointment[]>('/appointments', {
//       params: { startDate, endDate },
//     });
//     return data;
//   },

//   getById: async (id: string) => {
//     const { data } = await api.get<Appointment>(`/appointments/${id}`);
//     return data;
//   },

//   getByPatient: async (patientId: string) => {
//     const { data } = await api.get<Appointment[]>(`/appointments/patient/${patientId}`);
//     return data;
//   },

//   create: async (appointment: Partial<Appointment>) => {
//     const { data } = await api.post<Appointment>('/appointments', appointment);
//     return data;
//   },

//   update: async (id: string, appointment: Partial<Appointment>) => {
//     const { data } = await api.put<Appointment>(`/appointments/${id}`, appointment);
//     return data;
//   },

//   delete: async (id: string) => {
//     await api.delete(`/appointments/${id}`);
//   },
// };