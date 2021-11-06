import MediaList from "../components/media/MediaList";
import { Row, Col, Card } from "react-bootstrap";
import { useCallback, useEffect } from "react";

const DUMMY_DATA =[
    {
        id: '1',
        copies: '1',
        title: 'Bilbo Bagging\'s Journey',
        author: 'Bilbo Baggin',
        publisher: 'Puffin',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Tolkien_Reading_Day_2020_-_Bilbo_Baggins_%2849716916853%29.jpg/800px-Tolkien_Reading_Day_2020_-_Bilbo_Baggins_%2849716916853%29.jpg',
        category: 'Academic',
        department: 'Language Arts',
        professor: 'Joan Stein',
        course: 'LIT-400',
        description: 'Don\'t miss out on this incredible journey to the Middle Earth. Bilbo and his friends get into all sorts of trouble.'
    },
    {
        id: '2',
        copies: '1',
        title: 'Gandalf\'s Cookbook',
        author: 'Gandalf the Grey',
        publisher: 'Magicks',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/GANDALF.jpg/86px-GANDALF.jpg',
        category: 'Entertainment',
        department: 'Library Services',
        professor: 'Parker Freuhan',
        course: '',
        description: 'Follow along with Gandalf\'s never-before-seen recipes. Rumors have it there are instructions to cook the Legendary Sweetroll...'
    },
    {
        id: '3',
        copies: '1',
        title: 'Bilbo Bagging\'s Journey',
        author: 'Bilbo Baggin',
        publisher: 'Puffin',
        image: '',
        category: 'Entertainment',
        department: 'Library Services',
        professor: 'Parker Freuhan',
        course: '',
        description: 'Don\'t miss out on this incredible journey to the Middle Earth. Bilbo and his friends get into all sorts of trouble.'
    },
    {
        id: '4',
        copies: '1',
        title: 'Bilbo Bagging\'s Journey',
        author: 'Bilbo Baggin',
        publisher: 'Puffin',
        image: '',
        category: 'Entertainment',
        department: 'Library Services',
        professor: 'Parker Freuhan',
        course: '',
        description: 'Don\'t miss out on this incredible journey to the Middle Earth. Bilbo and his friends get into all sorts of trouble.'
    },
    {
        id: '5',
        copies: '1',
        title: 'Bilbo Bagging\'s Journey',
        author: 'Bilbo Baggin',
        publisher: 'Puffin',
        image: '',
        category: 'Entertainment',
        department: 'Library Services',
        professor: 'Parker Freuhan',
        course: '',
        description: 'Don\'t miss out on this incredible journey to the Middle Earth. Bilbo and his friends get into all sorts of trouble.'
    }
];

function AllMediaPage() {
    const { BlobServiceClient, AnonymousCredential  } = require("@azure/storage-blob");

    const getMediaHandler= useCallback(async () => {
        // Enter your storage account name and SAS
        const account = process.env.REACT_APP_ACCOUNT_NAME || "";
        const accountSas = process.env.REACT_APP_ACCOUNT_SAS || "";

        // Use AnonymousCredential when url already includes a SAS signature
        const anonymousCredential = new AnonymousCredential();

        // List containers
        const blobServiceClient = new BlobServiceClient(
            // When using AnonymousCredential, following url should include a valid SAS or support public access
            `https://${account}.blob.core.windows.net/${accountSas}`,
            anonymousCredential
        );
        let i = 1;
        for await (const container of blobServiceClient.listContainers()) {
          console.log(`Container ${i++}: ${container.name}`);
        }
    },[]);
    useEffect(() => {
        getMediaHandler();
    }, []);
    return (
    <section>
        <h1>Media Page</h1>
        <ul>
            <MediaList mediaitems={DUMMY_DATA} />
        </ul>
    </section>
)}   

export default AllMediaPage;