import {
  collection,
  CollectionReference,
  DocumentData,
  getFirestore
} from "firebase/firestore";
import { app } from ".";
import { Party } from "../types/party";

export const firestore = getFirestore(app);

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

export const partiesCollection = createCollection<Party>("parties");
