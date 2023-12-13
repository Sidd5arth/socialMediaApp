import React, { useCallback, useEffect, useState } from "react";
import AppContext from "./app-context";
import {
  AppContextProviderProps,
  UserData,
  Dimensions,
  allData,
  Profile,
} from "../types";

const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const [userData, setUserData] = useState<UserData>({
    user: { id: null, email: undefined, user_metadata: { first_name: null } },
    session: null,
  });
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [allPostData, setAllPostData] = useState<allData[] | undefined>(
    undefined
  );
  const [prflpic, setPrflpic] = useState<Profile[]>([]);

  const changeDimensionsHandler = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", changeDimensionsHandler);
    return () => {
      window.removeEventListener("resize", changeDimensionsHandler);
    };
  }, [changeDimensionsHandler]);

  return (
    <AppContext.Provider
      value={{
        dimensions,
        userData,
        setUserData,
        allPostData,
        setAllPostData,
        prflpic,
        setPrflpic,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
