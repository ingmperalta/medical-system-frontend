'use client';

import { useEffect, useRef, useState } from 'react';
// import { doctorsApi } from '@/lib/api';
import type { Doctor } from '@/types';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

const defaultDoctor = {
    firstName: '',
    lastName: '',
    idSpecialty: 0,
    idInstitution: 0,
    office: '',
    address: '',
    phoneNumber: '',
    mobileNumber: '',
    extNumber: '',
    color: '#3B82F6',
    userName: '',
    userPass: ''
}

export default function DoctorsPage() {  
  const router = useRouter();
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Doctor>>(defaultDoctor);
  const [showModal, ] = useState<boolean>(false)
  const prefxRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    loadSpecialties();
    loadInstitutions();
  }, []);

  const loadSpecialties = async () => {
    setLoading(true)
    try {
      // Cargar especialidades desde la API
      const { data } = await api.get('/v1.0/doctor/specialties');
      setSpecialties(data);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('Error loading specialties:', error);
    }
  };

  const loadInstitutions = async () => {
    setLoading(true)
    try {
      // Cargar especialidades desde la API
      const { data } = await api.get('/v1.0/doctor/institutions');
      setInstitutions(data);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('Error loading specialties:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();    
    try {
      let prefix = ''
      if ( prefxRef.current ) {
        prefix = prefxRef.current.value
      }
      formData.firstName = `${prefix} ${formData.firstName}`
      const { data } = await api.post(`/v1.0/doctor`, formData)
      console.log('data>>',data)
      router.push('/login');
    } catch (error) {
      console.error('Error saving doctor:', error);
      alert('Error al guardar el médico');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mt-5"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between gap-4 mt-4 ml-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Registro de Médicos</h1>
          <p className="text-gray-600 mt-1">Crea una cuenta para la gestión médica</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Información Personal */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prefx
                    </label>
                    <select
                        ref={prefxRef}
                        required                      
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={'Dr.'}>Dr.</option>
                      <option value={'Dra.'}>Dra.</option>
                      <option value={'MD.'}>MD.</option>
                      <option value={'PhD.'}>PhD.</option>
                      <option value={'Enf.'}>Enf.</option>
                      <option value={'Nut.'}>Nut.</option>
                      <option value={'Fisiot.'}>Fisiot.</option>
                      <option value={'Psic.'}>Psic.</option>
                      <option value={'Odont.'}>Odont.</option>
                      <option value={'Psic.'}>Farm.</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institución *
                    </label>
                    <select
                        required
                        value={formData.idInstitution || 0}
                        onChange={(e) => setFormData({ ...formData, idInstitution: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={0}>Seleccionar...</option>
                        {institutions.map((institution) => (
                        <option key={institution.id} value={institution.id}>
                            {institution.institutionName}
                        </option>
                        ))}
                    </select>
                    <span className='text-gray-500 text-xm'>Más adelante, se agregarán mas instituciones</span>
                  </div>

                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.firstName || ''}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.lastName || ''}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Especialidad *
                    </label>
                    <select
                        required
                        value={formData.idSpecialty || 0}
                        onChange={(e) => setFormData({ ...formData, idSpecialty: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={0}>Seleccionar...</option>
                        {specialties.map((specialty) => (
                        <option key={specialty.id} value={specialty.id}>
                            {specialty.description}
                        </option>
                        ))}
                    </select>
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color de Identificación *
                    </label>
                    <input
                        type="color"
                        value={formData.color || '#3B82F6'}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-full h-10 px-1 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                </div>
            </div>

            {/* Información de Contacto */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de Contacto</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Consultorio *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.office || ''}
                        onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                    </label>
                    <input
                        type="tel"
                        value={formData.phoneNumber || ''}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Celular *
                    </label>
                    <input
                        type="tel"
                        required
                        value={formData.mobileNumber || ''}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Extensión
                    </label>
                    <input
                        type="text"
                        value={formData.extNumber || ''}
                        onChange={(e) => setFormData({ ...formData, extNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                    <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección *
                    </label>
                    <textarea
                        required
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                </div>
            </div>

            {/* Credenciales de Acceso */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Credenciales de Acceso</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de Usuario *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.userName || ''}
                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña *
                    </label>
                    <input
                        type="password"
                        required
                        value={formData.userPass || ''}
                        onChange={(e) => setFormData({ ...formData, userPass: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">                

              <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-4 py-3 border-2 border-danger-300 rounded-lg text-danger-700 hover:bg-gray-50 transition font-semibold"
                >
                  Cancelar
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 border-2 border-green-300 rounded-lg text-green-700 hover:bg-gray-50 transition font-semibold"
                >
                    {loading?'Cargando...':'Crear Cuenta'}
                </button>
            </div>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-grey bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 ml-5">Información Personal</h3>                
            </div>

            <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de Contacto</h3>
            
            </div>
          </div>
        </div>
      )}

    </div>
  );
}