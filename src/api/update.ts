import { supabase } from "../SupabaseClient";
import { toast } from "react-hot-toast";

export const updateData = async (
  from: string,
  col: string,
  matches: string,
  name: string,
  value: string | string[]
) => {
  try {
    const { data, error } = await supabase
      .from(from)
      .update({ [name]: value })
      .eq(col, matches);

    if (error) {
      throw error;
    }

    if (data) {
      toast.success(`${from} edited successfully`);
    }
  } catch (error) {
    toast.error(`${from} edit failed`);
  }
};

export const updateImg = async (
  from: string,
  col: string,
  matches: string,
  name: string,
  value: string | undefined
) => {
  try {
    console.log(from);
    console.log(col);
    console.log(matches);
    console.log(name);
    console.log(value);
    const { data, error } = await supabase
      .from(from)
      .update({ [name]: value })
      .eq(col, matches);

    if (error) {
      throw error;
    }

    if (data) {
      toast.success(`${from} edited successfully`);
      return data;
    }
  } catch (error) {
    toast.error(`${from} edit failed`);
  }
};
