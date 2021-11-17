import { useContext, useEffect, useState } from "react";
import RentalsContext from "../../store/rentals-context";
import { formatDate, addHours } from "../utils/DateHelp";

export default function CountDownTimer(props){
  const rentalsCtx = useContext(RentalsContext);
  const d = addHours(new Date(props.due), 5); //// fix for data from db
  const r = new Date();


  const result = d-r <= 0 ? (rentalsCtx.checkinRental(), rentalsCtx.updateRentals(props.media_id)) : d-r;
  // Prepend `0` for one digit numbers. For that the number has to be
  // converted to string, as numbers don't have length method
  const padTime = time => {
      return String(time).length === 1 ? `0${time}` : `${time}`;
    };
  
  const format = time => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor((time / 60) % 60);
    const hours = Math.floor((time / ( 60 * 60 )) % 24);
    const days = Math.floor((time / (60 * 60 * 24)) % 30);

    //Return combined values as string in format mm:ss
    return `${days}d ${hours}h ${minutes}:${padTime(seconds)}`;
  };

    const [counter, setCounter] = useState(Math.floor(result/1000));
    useEffect(() => {
      let isMounted = true;
      let timer;
      if (counter > 0) {
        timer = setTimeout(() => setCounter(c => c - 1), 1000);
      }
  
      return () => {
        isMounted = false;
        if (timer) {
          clearTimeout(timer);
        }
      };
    }, [counter]);
  
    return (
      <div className="countdown">
        {counter === 0 || !counter ? 
          "Time over" 
          : 
          <div>{format(counter)}
          </div>
        }
        </div>
    );
}