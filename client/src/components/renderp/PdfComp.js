import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, ButtonGroup } from 'react-bootstrap'; 
import classes from './PdfComp.module.css';


export default function PdfComp(props) {
    const url =
    "http://localhost:5000/account/rental/"+props.media_key;
    pdfjs.GlobalWorkerOptions.workerSrc =
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    const [numPages, setNumPages] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [tdata, setData] = useState(null);
    const [tURL, setURL] =  useState(null);
    const pdfRef = useRef();
    const pnRef = useRef();
    const btnRef = useRef();

        
    /*When document gets loaded successfully*/
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage(e) {
        changePage(-1);
    }

    function nextPage(e) {
        changePage(1);
    }

    function handlePageReq(){
        console.log(pnRef.current.value);
    }

    return (
        <>
        <div className="main" >        
            <div className={classes.buttongroup}>
                <div className="pagec">
                    Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                </div>
                <div className="buttonc">
                    <ButtonGroup>
                        <Button
                            type="button"
                            disabled={pageNumber <= 1}
                            onClick={(event) => previousPage(event)}
                            className="Pre"  
                        >
                        Previous
                        </Button>
                        <Button
                            type="button"
                            disabled={pageNumber >= numPages}
                            onClick={(event) => nextPage(event)}
                        >
                        Next
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
            <Document
                file={url}
                onLoadError={console.error}
                onLoadSuccess={onDocumentLoadSuccess}
                height={'200px'}
                className={classes.pdfcanvas}
            >
                <span style={{ display: 'flex'}}>
                <Page pageNumber={pageNumber} />
                <Page pageNumber={pageNumber+1} />
                </span>
            </Document>

        </div>
        </>
    );
}
