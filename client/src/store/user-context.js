import { createContext, useEffect, useState } from "react";
import { callMsGraph } from "../graph";


const UserContext = createContext({
    username: null,
    mail: null,
    id: null,
    gName: null,
    role: null,
    registered: null,
    getUsername: (user) => {},
    getEmail: (ue) => {},
    getUID: (uid) => {},
    getGname: (gn) => {},
    getUserDeets: () => {},
    setUserRole: (user) => {}
});

export function UserContextProvider(props) {
    const [role, setRole] = useState('user');
    const [username, setUsername] = useState(null);
    const [userEmail, setUseremail] = useState(null);
    const [userID, setUserid] = useState(null);
    const [givenName, setGivenname] = useState(null);

    // useEffect(() => {
    // },[]);

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

    function getRoleHandler(user){
        setRole(user);
    }

    function getSavedDetails(user){
        if (!user){return console.log('no user defined');}
        fetch('http://localhost:5000/newuser/'+user)
        .then(response => response.json())
        .then(data => {
            setRole(data.role);
        });
    }
    

    const context = {
        username: userEmail ? userEmail.split('@')[0] : null ,
        mail: userEmail,
        id: userID,
        gName: givenName,
        role: role,
        getUsername: getUsernameHandler,
        getEmail: getEmailHandler,
        getUID: getUIDHandler,
        getGname: getGNHandler,
        getUserDeets: getSavedDetails,
        getUserRole: getRoleHandler
    };

    return (
        <UserContext.Provider value={context}>
            {props.children}
        </UserContext.Provider>
    )

}

export default UserContext;