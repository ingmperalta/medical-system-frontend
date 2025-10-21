export const errorHandler = ( error : any ) : {
    message: string,
    code: number
}|null => {
    if ( error !== undefined && error !== null ) 
    {
        //Axios Error
        if ( 
            ( error.response !== undefined && error.response !== null ) &&
            ( error.response.data !== undefined && error.response.data !== null )
        )
        {
            const data = error.response.data
            let message : string = ''
            if ( Array.isArray(data.message) )
            {
                message = data.message.join('; ')
            }
            else
            {
                message = data.message
            }

            return {
                message: message,
                code: data.statusCode
            }
        }
    }

    return null
} 