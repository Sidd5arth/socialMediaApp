export interface AppContextProviderProps {
  children: React.ReactNode;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface UserData {
  user: {
    id: string | null;
    email: string | undefined;
    user_metadata: {
      first_name: string | null;
    };
  };
  session: object | null;
}
export interface PostData {
  post_id?: string | "";
  content?: string | "";
  created_at?: string | "";
  created_by?: string | "";
  likes?: string[] | [];
  bookmarks?: string[] | [];
}
export interface Profile {
  user_id: string | "";
  profile: string;
  username: string;
}

export interface AppContextType {
  dimensions: Dimensions;
  allPostData: allData[] | undefined;
  setAllPostData: React.Dispatch<React.SetStateAction<allData[] | undefined>>;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  prflpic: {
    user_id: string | "";
    profile: string;
    username: string;
  }[];
  setPrflpic: React.Dispatch<
    React.SetStateAction<
      { user_id: string | ""; profile: string; username: string }[]
    >
  >;
}

export interface comments {
  created_by?: string | "";
  post_id?: string | "";
  content?: string | "";
}
export interface allData {
  created_at?: string | "";
  created_by?: string | "";
  post_id?: string | "";
  comment_id?: string | "";
  content?: string | "";
  likes?: string[] | [];
  bookmarks?: string[] | [];
}
