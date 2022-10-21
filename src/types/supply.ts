import { User } from "./user";
import { UUID } from "./uuid";

export interface Supply {
  uuid: UUID;
  name: string;
  quantity: number;
  assignee: User | null;
  isUrgent: boolean;
  emoji: string;
}
