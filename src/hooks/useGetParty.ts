import {
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { partiesCollection } from "../firebase/firestore";
import { Party } from "../types/party";

type PartyQuery =
  | { id: string; adminCode?: never }
  | { id?: never; adminCode: string };

interface UseGetPartyOptions {}

export const useGetParty = (
  partyQuery: PartyQuery,
  options?: UseGetPartyOptions
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [partyId, setPartyId] = useState<string | null>(null);
  const [docRef, setDocRef] = useState<DocumentReference<Party> | null>(null);
  const [party, setParty] = useState<Party | null>(null);

  const getParty = useCallback(async () => {
    if (partyQuery.id) {
      setPartyId(partyQuery.id);
      const docRef = doc(partiesCollection, partyQuery.id);
      setDocRef(docRef);
      setLoading(true);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setParty(docSnap.data() as Party);
      } else {
        setError(new Error("Party doesn't exist"));
      }
    } else {
      const q = query(
        partiesCollection,
        where("adminCode", "==", partyQuery.adminCode)
      );
      setLoading(true);
      const snapshots = await getDocs(q);
      if (!snapshots.docs) {
        setError(new Error("Couldn't find party"));
      } else {
        for (const doc of snapshots.docs) {
          setDocRef(doc.ref);
          setPartyId(doc.id);
          setParty(doc.data() as Party);
          break;
        }
      }
    }
    setLoading(false);
  }, [setParty, partyQuery, setError, setLoading, setPartyId, setDocRef]);

  useEffect(() => {
    getParty();
  }, [getParty]);

  return { loading, error, party, getParty, partyId, docRef, setParty };
};
