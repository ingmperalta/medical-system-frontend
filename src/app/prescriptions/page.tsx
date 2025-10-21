'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Plus, Trash2 } from 'lucide-react';
import type { Medication, Patient, Prescription } from '@/types';
import { api } from '@/lib/api';
import { errorHandler } from '@/errors'

const defaultFormData = {
  patientId: '',
  patientInfo: {
    firstName: '',
    lastName: '',
    idNumber: '',
    age: '',
    gender: 'M',
    // bloodType: ''
  },
  doctorName: '',
  doctorLicense: '',
  specialty: '',
  issueDate: new Date().toISOString().split('T')[0],
  diagnosis: '',
  instructions: '',
  notes: '',
}

const defaultMedication = { 
  name: '', 
  dosage: '', 
  frequency: '', 
  duration: '', 
  instructions: '' 
}

export default function NewPrescriptionPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [usePatient, setUsePatient] = useState(true);
  const [medications, setMedications] = useState<Medication[]>([defaultMedication]);  
  const [formData, setFormData] = useState(defaultFormData);

  let logUser = null
  if (typeof window !== 'undefined')
  {
    console.log('localStorage')
    if ( localStorage !== undefined && localStorage !== null && localStorage.getItem('user') !== undefined && localStorage.getItem('user') !== null)
    {
      const logObject = JSON.parse(localStorage.getItem('user')!)
      logUser = `${logObject.firstName} ${logObject.lastName}`
    }
  }

  useEffect(() => {
    loadPatients();
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setFormData(prev => ({
        ...prev,
        doctorName: `${user.firstName} ${user.lastName}`,
        doctorLicense: user.licenseNumber || '',
        specialty: user.specialty || 'Medicina General',
      }));
    }
  }, []);

  const loadPatients = async () => {
    setLoading(true)
    try {
      const { data } = await api.get<Patient[], any>(`/v1.0/patient`)
      setPatients(data);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('Error loading patients:', error);
    }
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
    ]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const selectPatient = (patientId: string) => {
    const patient = patients.find(p => p.id === Number(patientId));
    if (patient) {
      // const age = calculateAge(patient.birthDate);
      setFormData(prev => ({
        ...prev,
        patientId,
        patientInfo: {
          firstName: patient.firstName,
          lastName: patient.lastName?patient.lastName!:'',
          idNumber: patient.idNumber?patient.idNumber!:'',
          age: patient.age?patient.age!.toString():'',
          gender: patient.gender?patient.gender:'',
          // bloodType: patient.bloodType || ''
        }
      }));
    }
  };

  const savePrescription = async () => {
    console.log('formData >> ',formData)
    console.log('medications >> ',medications)

    if ( formData.diagnosis.length < 1 && formData.instructions.length < 1 && medications[0].name.length < 1 )
    {
      alert("Debe ingresar al menos una Instrucción, Diagnóstico ó Medicamento")
      return
    }

    setLoading(true)
    try {

        if ( medications.length < 1 )
        {
            alert("Debe ingresar al menos un medicamento")
            return
        }            

        const prescription : Prescription = {
            idPatient: 0,
            diagnosis: formData.diagnosis,
            generalInstructions: formData.instructions,
            aditionalNotes: formData.notes,
            idStatus: 1,
            details: []
        }

        for ( let counter = 0; counter < medications.length; counter++ )
        {
            const medication = medications[counter]  
            if ( medication.name !== undefined && medication.name !== null && medication.name.length )
            {
              prescription.details.push({
                  medicalName: medication.name,
                  dose: medication.dosage,
                  frequency: medication.frequency,
                  duration: medication.duration,
                  notes: medication.instructions!
              })
            }
        }
        
        if ( formData.patientId.length <= 0 )
        {
          const { data } = await api.post<{
              patientId: number,
              message: string,
              status: boolean
          }, any>(`/v1.0/patient`, {
              firstName: formData.patientInfo.firstName,
              lastName: formData.patientInfo.lastName,
              idNumber: formData.patientInfo.idNumber,
              gender: formData.patientInfo.gender,
              age: parseInt(formData.patientInfo.age)
          })
          prescription.idPatient = Number(data.patientId)
        }
        else
        {
          prescription.idPatient = Number(formData.patientId)
        }

        const { data } = await api.post(`/v1.0/prescription`, prescription)

        setLoading(false)

        window.open(`${process.env.NEXT_PUBLIC_APP_URL}/prescriptions/print/${data.prescriptionId}`, "_blank", "width=1024,height=768")        

        clearForm()
        loadPatients()

    } catch (error : any) {
        setLoading(false)
        console.log('error', error)
        console.log('error', error.response.data.message)
        console.log('error', error.response.data.statusCode)
        alert(errorHandler(error)?.message)
    }
  }

  const clearForm = () => {
    setFormData(defaultFormData)
    setMedications([defaultMedication])
  }

  const logOut = async () => {
    setLoading(true)
    try{
      const { data } = await api.post('/v1.0/doctor/logout')
      console.log('code>>',data)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Redireccionar al dashboard
      setLoading(false)
      router.push('/login');
    } catch (err) {
      setLoading(false)
      console.log('err', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 mt-5 px-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Generador de Recetas Médicas</h1>
          <p className="text-gray-600 mt-1 mb-5">Complete el formulario para generar una receta</p>
          <p className="text-black-600 mt-1">Bienvenido: {logUser}</p>
        </div>
        <button
          disabled={loading}        
          onClick={() => logOut()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {loading?'Cargando...':<LogOut size={24} />}          
        </button>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Patient Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="flex items-center gap-3 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={usePatient}
                  onChange={(e) => setUsePatient(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="font-semibold text-gray-800">Usar paciente registrado</span>
              </label>

              {usePatient ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Paciente
                  </label>
                  <select
                    value={formData.patientId}
                    onChange={(e) => selectPatient(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar paciente...</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} - {patient.idNumber}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Datos del Paciente</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nombre *"
                      required
                      value={formData.patientInfo.firstName}
                      onChange={(e) => setFormData({
                        ...formData,
                        patientInfo: { ...formData.patientInfo, firstName: e.target.value }
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Apellido"
                      required
                      value={formData.patientInfo.lastName}
                      onChange={(e) => setFormData({
                        ...formData,
                        patientInfo: { ...formData.patientInfo, lastName: e.target.value }
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Cédula"
                      required
                      value={formData.patientInfo.idNumber}
                      onChange={(e) => setFormData({
                        ...formData,
                        patientInfo: { ...formData.patientInfo, idNumber: e.target.value }
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Edad *"
                      required
                      value={formData.patientInfo.age}
                      onChange={(e) => setFormData({
                        ...formData,
                        patientInfo: { ...formData.patientInfo, age: e.target.value }
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={formData.patientInfo.gender}
                      onChange={(e) => setFormData({
                        ...formData,
                        patientInfo: { ...formData.patientInfo, gender: e.target.value }
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
                    {/* <input
                      type="text"
                      placeholder="Tipo de Sangre"
                      value={formData.patientInfo.bloodType}
                      onChange={(e) => setFormData({
                        ...formData,
                        patientInfo: { ...formData.patientInfo, bloodType: e.target.value }
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    /> */}
                  </div>
                </div>
              )}
            </div>

            {/* Doctor Info */}
            {/* <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Información del Médico</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Médico
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Licencia Médica
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.doctorLicense}
                      onChange={(e) => setFormData({ ...formData, doctorLicense: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialidad
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div> */}

            {/* Diagnosis and Instructions */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnóstico
                </label>
                <textarea
                  required
                  placeholder="Diagnóstico del paciente..."
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instrucciones Generales
                </label>
                <textarea
                  placeholder="Instrucciones para el paciente..."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  placeholder="Notas adicionales..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Medications Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Medicamentos</h3>
              <button
                type="button"
                onClick={addMedication}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={18} />
                Agregar
              </button>
            </div>

            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
              {medications.map((med, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm">
                        {index + 1}
                      </span>
                      Medicamento {index + 1}
                    </span>
                    {medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nombre del medicamento *"
                      required
                      value={med.name}
                      onChange={(e) => updateMedication(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Dosis (ej: 500mg) *"
                        required
                        value={med.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Frecuencia *"
                        required
                        value={med.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Duración (ej: 7 días) *"
                      required
                      value={med.duration}
                      onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Instrucciones específicas"
                      value={med.instructions || ''}
                      onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => savePrescription()}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                {loading ? 'Guardando...' : 'Guardar e Imprimir Prescripción'}
              </button>

              {/* <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-semibold"
                >
                  Cancelar
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </form>
      
    </div>
  );
}