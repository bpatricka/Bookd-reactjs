import { useCallback, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

export const PdfComp = (props) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tdata, setData] = useState(null);
    
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    const fetchRenderHandler = useCallback(async () =>{
        let isMounted = true;
        setLoading(true);

        // //start error and data handling
        try{
            const response = await fetch(
                props.url
            );

            if (!response.ok) {
                throw new Error('Somethings wronnnggg...');
            }
            let temp = [];
            const data = await response;
            setData(data.map(chunk => chunk));
            for (const item in data){
                temp.push({...data[item]})
            }
            setData(temp);


        }catch(error){
            setError(error.message);
        }
        setLoading(false);
    },[]);

    useEffect(()=>{
        let isMounted = true;
        fetchRenderHandler()
        return () => {
            isMounted = false;
        }
    },[]);


    let content;
    if(loading){
        content = <p>Loading...</p>
    }
    else{
        content = <span><Document file={props.url}/></span>
    }
    return (
        <div>
            {content}
        </div>
    )
}

export default PdfComp;