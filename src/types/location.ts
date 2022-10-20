import { User } from "./user";
import { UUID } from "./uuid";

export interface Location {
  location: string;
  uuid: UUID;
  votes: User[];
}
