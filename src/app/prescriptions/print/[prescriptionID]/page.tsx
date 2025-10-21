'use client'

// import PrintPrescription from "@/components/templates/prescription";
import PrescriptionV2 from "@/components/templates/v2/prescription";
import { api } from "@/lib/api";
import { Prescription as PrescriptionFromType } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PrescriptionPrintPage() {
    const { prescriptionID } = useParams()
    const [prescriptionData,setPrescriptionData] = useState<PrescriptionFromType|null>(null)
    const getPrescription = async () => {
        const { data } = await api.get<PrescriptionFromType>(`/v1.0/prescription/${prescriptionID}`)
        console.log ( data )
        setPrescriptionData(data)
    }
    useEffect(()=>{
        getPrescription()
    }, [])
    return <PrescriptionV2 prescriptionData={prescriptionData} />
}