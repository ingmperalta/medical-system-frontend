import { Prescription, PrescriptionDetail } from '@/types'
import './prescription.css'

interface Params {
    prescriptionData: Prescription|null
}

const PrintPrescription = ( { prescriptionData } : Params ) => {
    const currentDate = new Date(prescriptionData?.createdAt!)
    const day = currentDate.getDate().toString().length>1?`${currentDate.getDate()}`:`0${currentDate.getDate()}`
    const month = currentDate.getMonth().toString().length>1?`${currentDate.getMonth()}`:`0${currentDate.getMonth()}`
    const currentDateLabel = `${day}-${month}-${currentDate.getFullYear()}`
    const getMedicalList = (medicals : PrescriptionDetail[]) => {
        let medicalQuery = ''
        if ( medicals )
            for ( let counter = 0; counter < medicals.length; counter++ )
            {
                const medicalObject = medicals[counter]
                console.log('medicalObject>',medicalObject)
                medicalQuery += `${medicalObject.medicalName} | Dosis: ${medicalObject.dose} | Duración: ${medicalObject.duration} | Frecuencia: ${medicalObject.frequency} | Nota: ${medicalObject.notes};`
            }

        return medicalQuery
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="prescription-container" style={{borderColor: prescriptionData?.doctor?.color}}>
            <div className="corner-decoration top-left" style={{borderColor: prescriptionData?.doctor?.color}}></div>
            <div className="corner-decoration top-right" style={{borderColor: prescriptionData?.doctor?.color}}></div>
            <div className="corner-decoration bottom-left" style={{borderColor: prescriptionData?.doctor?.color}}></div>
            <div className="corner-decoration bottom-right" style={{borderColor: prescriptionData?.doctor?.color}}></div>

            <div className="watermark">⚕</div>

            <div className="header" style={{borderColor: prescriptionData?.doctor?.color}}>
                <div className="logo-container">
                    <div className="medical-symbol">⚕</div>
                </div>
                <div className="doctor-info">
                    <div className="doctor-name" style={{color: prescriptionData?.doctor?.color}}>{prescriptionData?.doctor?.firstName} {prescriptionData?.doctor?.lastName?prescriptionData?.doctor?.lastName:null}</div>
                    <div className="specialty" style={{color: prescriptionData?.doctor?.color}}>GINECÓLOGO - COLPOSCOPISTA</div>
                    <div className="contact-info">
                        <div><strong>Consultorio:</strong> {prescriptionData?.doctor?.office}</div>
                        <div><strong>Dirección:</strong> {prescriptionData?.doctor?.address}</div>
                        <div style={{marginTop: 5}}>
                            <strong>Tel:</strong> {prescriptionData?.doctor?.phoneNumber}, {prescriptionData?.doctor?.extNumber?`Ext: ${prescriptionData?.doctor?.extNumber} | `:''}
                            <strong>Cel:</strong> {prescriptionData?.doctor?.mobileNumber}
                        </div>
                    </div>
                </div>
            </div>

            <div className="date-box" style={{borderColor: prescriptionData?.doctor?.color}}>
                <div className="date-label" style={{color: prescriptionData?.doctor?.color}}>FECHA</div>
                <div className="date-value" id="currentDate">{currentDateLabel}</div>
            </div>

            {/* <div className="rx-symbol">℞</div> */}
            <div className="rx-symbol" style={{color: prescriptionData?.doctor?.color}}>Rᵡ</div>

            <div className="content-area" style={{borderColor: prescriptionData?.doctor?.color}}>
                <div className="prescription-lines">
                    {
                        prescriptionData?.diagnosis?
                            <div className="prescription-line" style={{borderColor: prescriptionData?.doctor?.color}}><strong>Diagnostico:</strong> {prescriptionData?.diagnosis}</div>
                        :null
                    }
                    {
                        prescriptionData?.generalInstructions?
                            <div className="prescription-line" style={{borderColor: prescriptionData?.doctor?.color}}><strong>Instrucciones Generales:</strong> {prescriptionData?.generalInstructions}</div>
                        :null
                    }
                    {
                        prescriptionData?.details?
                            <div className="prescription-line" style={{borderColor: prescriptionData?.doctor?.color}}><strong>Medicamentos:</strong> {getMedicalList(prescriptionData?.details)}</div>
                        :null
                    }
                    {
                        prescriptionData?.aditionalNotes?
                            <div className="prescription-line" style={{borderColor: prescriptionData?.doctor?.color}}><strong>Notas:</strong> {prescriptionData?.aditionalNotes}</div>
                        :null
                    }
                    {/* <div className="prescription-line"></div>
                    <div className="prescription-line"></div>
                    <div className="prescription-line"></div>
                    <div className="prescription-line"></div>
                    <div className="prescription-line"></div>
                    <div className="prescription-line"></div>
                    <div className="prescription-line"></div>
                    <div className="prescription-line"></div> */}
                </div>
            </div>

            {/* <div className="notes-section">
                <div className="notes-title">⚠️ INSTRUCCIONES IMPORTANTES</div>
                <div className="notes-content">
                    • Esta receta es válida por 30 días desde la fecha de emisión<br />
                    • Debe presentar documento de identidad al momento de adquirir los medicamentos<br />
                    • No automedicarse. Consultar al médico en caso de reacciones adversas
                </div>
            </div> */}

            <div className="footer-section">
                <div className="footer-grid">
                    <div className="field" style={{borderColor: prescriptionData?.doctor?.color}}>
                        <div className="field-label" style={{color: prescriptionData?.doctor?.color}}>Nombre del Paciente</div>
                        <div className="field-value" style={{borderColor: prescriptionData?.doctor?.color}}>{prescriptionData?.patient?.firstName} {prescriptionData?.patient?.lastName?prescriptionData?.patient?.lastName:''}</div>
                    </div>
                    <div className="field" style={{borderColor: prescriptionData?.doctor?.color}}>
                        <div className="field-label" style={{color: prescriptionData?.doctor?.color}}>Edad</div>
                        <div className="field-value" style={{borderColor: prescriptionData?.doctor?.color}}>{prescriptionData?.patient?.age}</div>
                    </div>
                    <div className="field" style={{borderColor: prescriptionData?.doctor?.color}}>
                        <div className="field-label" style={{color: prescriptionData?.doctor?.color}}>Cédula / Pasaporte</div>
                        <div className="field-value" style={{borderColor: prescriptionData?.doctor?.color}}>{prescriptionData?.patient?.idNumber}</div>
                    </div>
                    <div className="field" style={{borderColor: prescriptionData?.doctor?.color}}>
                        <div className="field-label" style={{color: prescriptionData?.doctor?.color}}>Teléfono</div>
                        <div className="field-value" style={{borderColor: prescriptionData?.doctor?.color}}>-</div>
                    </div>
                    {/* <div className="field full-width">
                        <div className="field-label">Próxima Cita</div>
                        <div className="field-value"></div>
                    </div> */}
                </div>

                <div className="signature-box">
                    <div className="signature-label">Firma y Sello del Médico</div>
                </div>

                <button className='boton-imprimir' onClick={handlePrint}>Imrpimir</button>

                <button className='boton-cerrar' onClick={()=>window.close()}>Cerrar</button>
            </div>
        </div>
    )
}

export default PrintPrescription