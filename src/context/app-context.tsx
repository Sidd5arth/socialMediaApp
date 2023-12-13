import { createContext } from "react";
import { AppContextType } from "../types";

const defaultContextValue: AppContextType = {
  dimensions: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  userData: {
    user: { id: null, email: undefined, user_metadata: { first_name: null } },
    session: null,
  },
  allPostData: [],
  setUserData: (e) => {
    e;
  },
  setAllPostData: (e) => {
    e;
  },
  prflpic: [],
  setPrflpic: (e) => {
    e;
  },
};

const AppContext = createContext<AppContextType>(defaultContextValue);

export default AppContext;
