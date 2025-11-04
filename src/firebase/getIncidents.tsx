// Import Firestore database
import app from "./firebase";
import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Firestore from "./postIncidents";

const db = getFirestore(app);

//const PAGE_SIZE = 10;

type Incident = {
  location: string;
  incidentType: string;
  description: string;
};

const Read = () => {
    const [info, setInfo] = useState<Incident[]>([]);

    // Start the fetch operation as soon as
    // the page loads
    window.addEventListener("load", () => {
        Fetchdata();
    });

    // Fetch the required data using the get() method
    const Fetchdata = async () => {
        const querySnapshot = await getDocs(collection(db, "data"));
        const newData: Incident[] = [];
        querySnapshot.forEach((doc) => {
            newData.push(doc.data() as Incident);
        });
        setInfo(newData);
    };

    // Display the result on the page
    return (
        <div>
            <center>
                <h2>Incident Details</h2>
            </center>

            {info.map((data, index) => (
                <Frame
                    key={index}
                    location={data.location}
                    incidentType={data.incidentType}
                    description={data.description}
                />
            ))}
        </div>
    );
};

// Define how each display entry will be structured
const Frame = ({ location, incidentType, description } : Incident) => {
    console.log(location + " " + incidentType + " " + description);
    return (
        <center>
            <div className="div">
                <p>LOCATION : {location}</p>

                <p>INCIDENT TYPE : {incidentType}</p>

                <p>DESCRIPTION : {description}</p>
            </div>
        </center>
    );
};

export default Read;