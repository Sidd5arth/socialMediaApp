import { supabase } from "../SupabaseClient";
import { toast } from "react-hot-toast";
import { PostData } from "../types";
export const insertData = async (from: string, payload: PostData[]) => {
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
