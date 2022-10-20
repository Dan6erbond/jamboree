import { User } from "./user";
import { UUID } from "./uuid";

export interface Supply {
  uuid: UUID;
  name: string;
  quantity: number;
  assignee: User;
  isUrgent: boolean;
  emoji: string;
}
