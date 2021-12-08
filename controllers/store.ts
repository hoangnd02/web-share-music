import { ssrRef } from "@nuxtjs/composition-api";
import { User } from "~/types";

interface Store {
  first_route: boolean;
  wavesurfer: string;
  music: any[] | null;
  playlist: any;
  currentSong: boolean | any;
  currentAlbum: {
    id: number,
    name: string,
    description: string,
    view_count: number,
    liked: boolean,
    like_count: number,
    music: any[],
  } | any;
  albums: any[] | null;
  isPlaying: boolean;
  isLoading: boolean;
  indexPlaylist: number;
  user: User;
  isMusicDetail: string;
  isLogin: boolean;
  destroyWavesuffer: boolean;
  trending: any[] | null;
  updateAlbum: any;
  newSongs: any[];
  getLogged: boolean;
  getAllMusics: boolean;
}

export default ssrRef<Store>({
  first_route: true,
  wavesurfer: "",
  music: [],
  playlist: [],
  currentSong: false,
  currentAlbum: null,
  albums: null,
  isPlaying: false,
  isLoading: false,
  indexPlaylist: 0,
  user: {
    uid: null,
    first_name: null,
    last_name: null,
    bio: null,
    email: null,
    state: null,
    role: null,
  },
  isMusicDetail: "",
  isLogin: false,
  destroyWavesuffer: false,
  trending: null,
  updateAlbum: {
    id: null,
    name: null,
    description: null,
    image: null,
    private: null,
    music: []
  },
  newSongs: [],
  getLogged: false,
  getAllMusics: false,
})

