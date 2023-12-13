import { supabase } from "../SupabaseClient";
import { comments } from "../types";
import { toast } from "react-hot-toast";

export const insertData = async (from: string, payload: comments[]) => {
  try {
    const { data, error } = await supabase.from(from).insert(payload);

    if (error) {
      throw error;
    }

    if (data) {
      toast.success(`${from} created`);
    }
  } catch (error) {
    toast.error(`${from} failed`);
  }
};
