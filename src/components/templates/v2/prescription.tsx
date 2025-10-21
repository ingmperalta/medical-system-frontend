import React from 'react';
import { Prescription, PrescriptionDetail } from '@/types';
import './prescription.css'
import Image from 'next/image';

interface Params {
    prescriptionData: Prescription|null
}

const PrescriptionV2 = ( { prescriptionData } : Params ) => {
    const currentDate = new Date(prescriptionData?.createdAt!)
    const day = currentDate.getDate().toString().length>1?`${currentDate.getDate()}`:`0${currentDate.getDate()}`
    const month = currentDate.getMonth().toString().length>1?`${currentDate.getMonth()}`:`0${currentDate.getMonth()}`
    const currentDateLabel = `${day}-${month}-${currentDate.getFullYear()}`
//   const [prescriptionData, setPrescriptionData] = useState({
//     doctorName: 'Dr. Rafael E. Calderón Castro',
//     specialty: 'Pediatra',
//     institution: 'INSTITUTO MATERNO INFANTIL Y ESP. SAN MARTIN DE PORRES',
//     building: 'EDIFICIO PROFESIONAL 2DA PLANTA',
//     address: 'CALLE PEDRO BISONO TORIBIO #8. SANTIAGO,',
//     phone: '809-581-4445',
//     ext: '5206',
//     mobile: '809-707-1962',
//     patientName: '',
//     date: new Date().toLocaleDateString('es-DO'),
//     prescription: ''
//   });

    const getMedicalList = (medicals : PrescriptionDetail[]) => {
        let medicalQuery = ''
        if ( medicals )
            for ( let counter = 0; counter < medicals.length; counter++ )
            {
                const medicalObject = medicals[counter]
                medicalQuery += `${medicalObject.medicalName}, Dosis: ${medicalObject.dose}, Duración: ${medicalObject.duration}, Frecuencia: ${medicalObject.frequency}, Nota: ${medicalObject.notes};`
            }

        return medicalQuery
    }

    let prescription = ''

    if ( prescriptionData?.diagnosis )
    {
        prescription += `${prescriptionData?.diagnosis}; `
    }

    if ( prescriptionData?.generalInstructions )
    {
        prescription += `${prescriptionData?.generalInstructions}; `
    }

    if ( prescriptionData?.details )
    {
        prescription += getMedicalList(prescriptionData?.details)
    }

    if ( prescriptionData?.aditionalNotes )
    {
        prescription += `${prescriptionData?.aditionalNotes}; `
    }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="prescription-container">
        <div className="header">
            <div className="header-top">

                <div className="logo">
                    <Image
                        src={prescriptionData?.doctor?.institution?.logo!}
                        width={120}
                        height={120}
                        alt="Picture of the author"
                        />                    
                </div>

                <div className="doctor-name">
                    {prescriptionData?.doctor?.firstName} {prescriptionData?.doctor?.lastName} <br />
                    {prescriptionData?.doctor?.specialty?.description}
                </div>
                                
            </div>

            {/* <div className="specialty">{prescriptionData?.doctor?.specialty?.description}</div> */}

            <div className="header-bottom">

                <div className="institution-info">
                    <p className="institution-name">{prescriptionData?.doctor?.institution?.institutionName}</p>
                    <p className="building">{prescriptionData?.doctor?.office}</p>
                    <p>{prescriptionData?.doctor?.address}</p>
                </div>

                <div className="contact-info">
                    <p><span>TELF:</span> {prescriptionData?.doctor?.phoneNumber} <span>EXT.</span> {prescriptionData?.doctor?.extNumber}</p>
                    <p><span>CEL.</span> {prescriptionData?.doctor?.mobileNumber}</p>
                </div>

            </div>
            
            {/* <div className="doctor-info">
                <div className="doctor-name">{prescriptionData?.doctor?.firstName} {prescriptionData?.doctor?.lastName}</div>
                <div className="specialty">{prescriptionData?.doctor?.specialty?.description}</div>
                <div className="contact-info">
                    <p><span>TELF:</span> {prescriptionData?.doctor?.phoneNumber} <span>EXT.</span> {prescriptionData?.doctor?.extNumber}</p>
                    <p><span>CEL.</span> {prescriptionData?.doctor?.mobileNumber}</p>
                </div>
            </div> */}
        </div>

        {/* <div className="rx-symbol">Rᵡ</div> */}

        <div className="prescription-box" style={{borderColor: prescriptionData?.doctor?.color}}>
            <div className="rx-symbol">Rᵡ</div>
            <div className="prescription-content">                
                {prescription}
            </div>
        </div>

        <div className="footer-fields">
            <div className="field-row">
                <span className="field-label">NOMBRE:</span>
                <div className="field-line">{prescriptionData?.patient?.firstName} {prescriptionData?.patient?.lastName}</div>
            </div>
            
            <div className="field-row">
                <span className="field-label">FECHA:</span>
                <div className="field-line">{currentDateLabel}</div>
            </div>
        </div>

        <button className='boton-imprimir' onClick={handlePrint}>Imrpimir</button>

        <button className='boton-cerrar' onClick={()=>window.close()}>Cerrar</button>
    </div>
  );
};

export default PrescriptionV2;