import { supabase } from "../SupabaseClient";
import { toast } from "react-hot-toast";

export const deleteData = async (
  from: string,
  col: string,
  matches: string
) => {
  try {
    const { error } = await supabase.from(from).delete().eq(col, matches);

    if (error) {
      throw error;
    }

    toast.success(`${from} deleted successfully`);
  } catch (error) {
    toast.error(`${from} delete failed`);
  }
};
