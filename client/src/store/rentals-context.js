import { useMsal } from "@azure/msal-react";
import { createContext, useContext, useCallback, useEffect, useState } from "react";
import { formatDate, addHours, subHours, addMinutes } from "../components/utils/DateHelp";
import { loginRequest, msalConfig } from "../authConfig";
import UserContext from "./user-context";
import { PublicClientApplication } from "@azure/msal-browser";

const RentalsContext = createContext({
    rentals: [],
    totalRentals: 0,
    setRentals: (rental) => {},
    addRental: (rentedMedia) => {},
    itemIsRented: (mediaId) => {},
    checkinRental: () => {},
    getCurrent: () => {},
    updateRentals: (mediaId) => {}
});

export function RentalsContextProvider(props) {
    const userCtx = useContext(UserContext);
    const [userRentals, setUserRentals] = useState([]);

    useEffect(() => {
        getCurrentRentals( userCtx.mail );
        checkinRentalHandler();
    },[userRentals.length]);

    async function addRentalHandler(rentedMedia) {
        const now = new Date();
        const due = addMinutes(new Date(), 5);

        return fetch(
            'http://localhost:5000/media',
            {
                method: "POST",
                body: JSON.stringify(rentedMedia),
                headers: {
                    "Content-Type": "application/json"
                },
            }
        )
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setUserRentals((prevUserRentals) => {
                    return prevUserRentals.concat({ ///add new rentals to our current
                        ...rentedMedia,
                        date_rented: now,
                        date_returned: due
                    });
                });
            });
    }

    // returns all items that are currently rented
    function itemIsRentedHandler(mediaId) {
        const result = userRentals.some((media)=> 
            media.media_id === mediaId);
        return result;
    }

    async function getCurrentRentals(u){
        // THIS IS FOR CURRENT RENTALS HARD RESET
        if(userCtx.mail === null || userCtx.mail === 'undefined') {
            return console.log('user not defined');
        }
        fetch(
            "http://localhost:5000/account/"+u,
        )
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            setUserRentals(data.map(rental => rental));
        });
    }

    // updates the overdue rentals
    async function checkinRentalHandler(){
        return fetch(
            'http://localhost:5000/media/checkin',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            }
        )
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                //event happened
                console.log('media checked in.');
            });
    }

    // 'pop' a selected a item within our rentals
    const updateMyRentals = (mediaId) => {
        const myrental = userRentals.find((rental) => rental.media_id === mediaId);

        if (!myrental) {
            return ;
        }

        setUserRentals((prevUserRentals) => {
            return prevUserRentals.filter((rental) => rental.media_id !== myrental.media_id)
        });
    }
    
    const setRentalsHandler = (arr) => {
        setUserRentals(arr);
    }

    const context = {
        rentals: userRentals,
        totalRentals: userRentals.length,
        addRental: addRentalHandler,
        itemIsRented: itemIsRentedHandler,
        checkinRental: checkinRentalHandler,
        getCurrent: getCurrentRentals,
        updateRentals: updateMyRentals,
        setRentals: setRentalsHandler
    };

    return (
        <RentalsContext.Provider value={context}>
            {props.children}
        </RentalsContext.Provider>
    )
    
}

export default RentalsContext;