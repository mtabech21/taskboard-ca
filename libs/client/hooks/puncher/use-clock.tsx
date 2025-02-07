import { useEffect, useState } from "react";
import Contextor from "../contextor";

const useClock = new Contextor(() => {
  const [currentTime, setCurrentTime] = useState(new Date());

  /**
   * Returns the date string from currentTime. 
  */
  const getCurrentDate = () => {
    let day = String();
    let month = String();
    let date = String();
    switch (currentTime.getDay()) {
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
        break;
      case 0:
        day = "Sunday";
        break;
      default:
        throw new Error();
    }
    switch (currentTime.getMonth()) {
      case 0:
        month = "January";
        break;
      case 1:
        month = "February";
        break;
      case 2:
        month = "March";
        break;
      case 3:
        month = "April";
        break;
      case 4:
        month = "May";
        break;
      case 5:
        month = "June";
        break;
      case 6:
        month = "July";
        break;
      case 7:
        month = "August";
        break;
      case 8:
        month = "September";
        break;
      case 9:
        month = "October";
        break;
      case 10:
        month = "November";
        break;
      case 11:
        month = "December";
        break;
      default:
        throw new Error();
    }
    switch (currentTime.getDate()) {
      case (1 | 21 | 31):
        date = currentTime.getDate() + "st";
        break;
      case (2 | 22):
        date = currentTime.getDate() + "nd";
        break;
      case (3 | 23):
        date = currentTime.getDate() + "rd";
        break;
      default:
        date = currentTime.getDate() + "th";
    }
    return `${day}, ${month} ${date}`;
  };

  useEffect(() => {
    const clock = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  return { currentTime, getCurrentDate }
})

export default useClock