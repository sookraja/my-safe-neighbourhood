import { collection, addDoc, getDocs, doc, updateDoc, increment, getDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import { getUser } from "./users";

export interface Incident {
  id?: string;
  title: string;
  type: string;
  address: string;
  description: string;
  lat: number;
  lng: number;
  reportedBy: string;
  dateTime: string;
  userId?: string;
  upvotes: number;
  downvotes: number;
  votedBy?: string[];
  imageUrl?: string; //needed for displaying images
}

// Add a new incident
export const addIncident = async (incidentData: Omit<Incident, 'id' | 'upvotes' | 'downvotes' | 'votedBy'>) => {
  try {
    const docRef = await addDoc(collection(db, "Incident"), {
      ...incidentData,
      upvotes: 0,
      downvotes: 0,
      votedBy: [],
      dateTime: incidentData.dateTime || new Date().toISOString().slice(0, 19).replace('T', ' '),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding incident: ", error);
    throw error;
  }
};

export const getIncidents = async (): Promise<Incident[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "Incident"));
    
    const incidents: Incident[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      let dateTimeString = '';
      if (data.dateTime) {
        if (data.dateTime.seconds) {
          const date = new Date(data.dateTime.seconds * 1000);
          dateTimeString = date.toISOString().slice(0, 19).replace('T', ' ');
        } else if (typeof data.dateTime === 'string') {
  
          dateTimeString = data.dateTime;
        }
      }
      
      incidents.push({
        id: doc.id,
        title: data.title || '',
        type: data.type || '',
        address: data.address || '',
        description: data.description || '',
        lat: data.lat || 0,
        lng: data.lng || 0,
        reportedBy: data.reportedBy || 'Anonymous',
        dateTime: dateTimeString,
        userId: data.userId || '',
        upvotes: data.upvotes || 0,
        downvotes: data.downvotes || 0,
        votedBy: data.votedBy || []
      });
    });
    
    incidents.sort((a, b) => {
      const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
      const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
      if (scoreB !== scoreA) return scoreB - scoreA;
      return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
    });
    
    return incidents;
  } catch (error) {
    console.error("Error getting incidents: ", error);
    throw error;
  }
};

// Upvote logic
export const upvoteIncident = async (incidentId: string, userId: string) => {
  try {
    // Fetch the user role
    const userData = await getUser(userId);
    const userRole = userData?.role || 'user';

    // Fetch the incident
    const incidentRef = doc(db, "Incident", incidentId);
    const incidentSnap = await getDoc(incidentRef);

    if (!incidentSnap.exists()) {
      throw new Error("Incident not found");
    }

    const data = incidentSnap.data();
    const votedBy = data.votedBy || [];

    // Prevent double voting
    if (votedBy.includes(userId)) {
      throw new Error("You have already voted on this incident");
    }

    // Determine upvote increment
    const incrementValue = userRole === "law_enforcement" ? 10 : 1;

    await updateDoc(incidentRef, {
      upvotes: increment(incrementValue),
      votedBy: [...votedBy, userId]
    });

    console.log(`User ${userId} (${userRole}) upvoted incident ${incidentId} for +${incrementValue}`);
  } catch (error) {
    console.error("Error upvoting incident:", error);
    throw error;
  }
};

// Downvote logic
export const downvoteIncident = async (incidentId: string, userId: string) => {
  try {
    const incidentRef = doc(db, "Incident", incidentId);
    const incidentSnap = await getDoc(incidentRef);
    
    if (!incidentSnap.exists()) {
      throw new Error("Incident not found");
    }
    
    const data = incidentSnap.data();
    const votedBy = data.votedBy || [];

    if (votedBy.includes(userId)) {
      throw new Error("You have already voted on this incident");
    }
    
    await updateDoc(incidentRef, {
      downvotes: increment(1),
      votedBy: [...votedBy, userId]
    });
  } catch (error) {
    console.error("Theres an Error ", error);
    throw error;
  }
};

export const hasUserVoted = (incident: Incident, userId: string): boolean => {
  return incident.votedBy?.includes(userId) || false;
};

// Gets credibility score
export const getCredibilityScore = (incident: Incident): number => {
  return (incident.upvotes || 0) - (incident.downvotes || 0);
};

export const getCredibilityPercentage = (incident: Incident): number => {
  const total = (incident.upvotes || 0) + (incident.downvotes || 0);
  if (total === 0) return 0;
  return Math.round(((incident.upvotes || 0) / total) * 100);
};