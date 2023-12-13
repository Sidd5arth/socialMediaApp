import { supabase } from "../SupabaseClient";
import { allData, Profile } from "../types";
import { toast } from "react-hot-toast";

export const getAllPaginated = async (
  from: string,
  start: number,
  end: number
): Promise<allData[] | null> => {
  try {
    console.log(start);
    console.log(end);
    console.log(from);
    const { data, error } = await supabase
      .from(from)
      .select("*")
      .range(start, end)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    if (data) {
      return data;
    }

    throw new Error("No data received from the server");
  } catch (error) {
    toast.error("Error in fetching the data");
    return null;
  }
};
export const getAll = async (from: string): Promise<allData[] | null> => {
  try {
    const { data, error } = await supabase
      .from(from)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    if (data) {
      return data;
    }

    throw new Error("No data received from the server");
  } catch (error) {
    toast.error("Error in fetching the data");
    return null;
  }
};

export const getData = async (from: string): Promise<Profile[] | null> => {
  try {
    const { data, error } = await supabase
      .from(from)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    if (data) {
      return data;
    }

    throw new Error("No data received from the server");
  } catch (error) {
    toast.error("Error in fetching the data");
    return null;
  }
};
