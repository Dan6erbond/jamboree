import { Location } from "./location";
import { SongPlaylist } from "./song-playlist";
import { Supply } from "./supply";
import { User } from "./user";
import { UUID } from "./uuid";

export interface Party {
  creator: string;
  adminCode: string;
  settings: {
    date: {
      votingEnabled: boolean;
      userOptions: boolean;
    };
    location: {
      votingEnabled: boolean;
      userOptions: boolean;
    };
  };
  dates: {
    date: Date;
    uuid: UUID;
    votes: User[];
  }[];
  locations: Location[];
  songPlaylists: SongPlaylist[];
  supplies: Supply[];
}
