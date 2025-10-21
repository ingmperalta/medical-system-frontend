// frontend/src/types/index.ts

export interface Prescription {
    idPatient: number       
    idDoctor?: number
    diagnosis: string
    generalInstructions: string
    aditionalNotes: string
    createdBy?: number
    idStatus: number
    createdAt?: string
    details: PrescriptionDetail[]
    doctor?: Doctor
    patient?: Patient
}

export interface PrescriptionDetail {
    medicalName: string
    dose: string
    frequency: string
    duration: string
    notes: string
}

export interface Doctor {
  active: boolean
  createdAt: string
  createdBy: number
  firstName: string
  office?: string
  address?: string
  phoneNumber?: string
  mobileNumber?: string
  extNumber?: string
  color?: string
  userName?: string
  userPass?: string
  id?: number
  idSpecialty: number
  specialty?: Specialty
  idInstitution: number
  institution?: Institution
  lastName?: string
  updatedAt?: string
  updatedBy?: number
}

export interface Specialty {
  id: number
  description: string
  active: boolean
}

export interface Institution {
  active: boolean
  address: string
  id: number
  institutionName: string
  logo: string
  phoneNumber: string
}

export interface Patient {
    id?: number
    firstName: string
    lastName?: string
    idNumber?: string
    gender: string
    age?: number
    createdBy: number
    createdAt: Date
    updatedBy?: number
    updatedAt?: Date
    active?: boolean
}

// export interface Patient {
//   id: string;
//   firstName: string;
//   lastName: string;
//   idNumber: string;
//   birthDate: string;
//   gender: string;
//   phone: string;
//   email: string;
//   address: string;
//   bloodType?: string;
//   allergies?: string[];
//   chronicConditions?: string[];
//   emergencyContactName?: string;
//   emergencyContactPhone?: string;
//   createdAt: string;
//   updatedAt: string;
// }

export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  appointmentDate: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  doctorName: string;
  createdAt: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

// export interface Prescription {
//   id: string;
//   patientId: string;
//   patient?: Patient;
//   doctorName: string;
//   doctorLicense: string;
//   issueDate: string;
//   diagnosis: string;
//   medications: Medication[];
//   instructions?: string;
//   notes?: string;
//   createdAt: string;
// }

// export interface VitalSigns {
//   bloodPressure?: string;
//   heartRate?: number;
//   temperature?: number;
//   weight?: number;
//   height?: number;
//   oxygenSaturation?: number;
// }

// export interface MedicalRecord {
//   id: string;
//   patientId: string;
//   patient?: Patient;
//   consultationDate: string;
//   doctorName: string;
//   chiefComplaint: string;
//   symptoms: string;
//   physicalExamination: string;
//   diagnosis: string;
//   treatment: string;
//   labResults?: string;
//   notes?: string;
//   vitalSigns?: VitalSigns;
//   followUpDate?: string;
//   createdAt: string;
// }

// export interface User {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: 'admin' | 'doctor' | 'nurse';
//   licenseNumber?: string;
//   specialty?: string;
// }

// export interface LoginResponse {
//   access_token: string;
//   user: User;
// }