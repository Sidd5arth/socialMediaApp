import { createClient } from "@supabase/supabase-js";
// const supabaseUrl = process.env.REACT_APP_SUPABASE_PROJECT;
// const supabaseKey = process.env.REACT_APP_SUPABASE_API_KEY;
//not working for supabase //
const supabaseUrl = "https://djstzjejdnfaizwrtinh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqc3R6amVqZG5mYWl6d3J0aW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYwMDMzOTYsImV4cCI6MjAxMTU3OTM5Nn0.VkydOrueYpqOv1SNcs4XQzlQ9ausb6wh2KaQIGBZ2jk"; 

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

