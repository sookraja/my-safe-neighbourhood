import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useState } from 'react';

const Firestore = () => {
    const [location, Setlocation] = useState("");
    const [incidentType, Setincidenttype] = useState("");
    const [description, Setdescription] = useState("");
    const sub = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        // Add data to the store
        const firestore = getFirestore();
        addDoc(collection(firestore, "data"), {
            Location: location,
            IncidentType: incidentType,
            Description: description
        })
            .then(() => {
                alert("Data Successfully Submitted");
            })
            .catch((error: any) => {
                console.error("Error adding document: ", error);
            });
    }

    return (
        <div>
            <center>
                <form style={{ marginTop: "200px" }}
                    onSubmit={(event) => { sub(event) }}>
                    <input type="text" placeholder="city/area"
                        onChange={(e) => { Setlocation(e.target.value) }} />
                    <br /><br />
                    <input type="number" placeholder="type of incident"
                        onChange={(e) => { Setincidenttype(e.target.value) }} />
                    <br /><br />
                    <input type="text" placeholder="description"
                        onChange={(e) => { Setdescription(e.target.value) }} />
                    <br /><br />
                    <button type="submit">Submit</button>
                </form>
            </center>
        </div>
    );
}

export default Firestore;