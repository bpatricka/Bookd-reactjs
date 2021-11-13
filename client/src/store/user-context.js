import { createContext, useEffect, useState } from "react";
import { callMsGraph } from "../graph";


const UserContext = createContext({
    username: null,
    mail: null,
    id: null,
    gName: null,
    getUsername: (user) => {},
    getEmail: (ue) => {},
    getUID: (uid) => {},
    getGname: (gn) => {},
    getUserDeets: () => {}
});

export function UserContextProvider(props) {
    const [username, setUsername] = useState(null);
    const [userEmail, setUseremail] = useState(null);
    const [userID, setUserid] = useState(null);
    const [givenName, setGivenname] = useState(null);

    useEffect(() => {
        if (userEmail === null || userEmail === 'undefined'){
            getUserDetails();
        }
    },[]);

    function getUserDetails(){
        // got to be a better way
            for (const item in sessionStorage){
                if (typeof sessionStorage[item] === 'string'){
                    let temp = sessionStorage[item].split(",");
                    for (const sitem in temp){
                        for (const fitem in temp[sitem].split(':')[1]){
                            if(temp[sitem].split(':')[1].endsWith('@southernct.edu"')){
                                let t = temp[sitem].split(':')[1].replace('"','').replace('"','')
                                sessionStorage.setItem('email', t);
                                setUseremail(t);
                            }
                        }
                    }
                }
            };
        }

    function getUsernameHandler(data){
        setUsername(data);
    }

    function getEmailHandler(ue){
        setUseremail(ue);
    }

    function getUIDHandler(uid){
        setUserid(uid);
    }

    function getGNHandler(gn){
        setGivenname(gn);
    }
    

    const context = {
        username: username,
        mail: userEmail,
        id: userID,
        gName: givenName,
        getUsername: getUsernameHandler,
        getEmail: getEmailHandler,
        getUID: getUIDHandler,
        getGname: getGNHandler,
        getUserDeets: getUserDetails
    };

    return (
        <UserContext.Provider value={context}>
            {props.children}
        </UserContext.Provider>
    )

}

export default UserContext;