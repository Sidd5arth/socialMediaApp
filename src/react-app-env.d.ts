declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_SUPABASE_PROJECT: string;
      REACT_APP_SUPABASE_API_KEY: string;
      REACT_APP_OPENAI_API_KEY: string;
    }
  }
}

// REACT_APP_SUPABASE_API_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqc3R6amVqZG5mYWl6d3J0aW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYwMDMzOTYsImV4cCI6MjAxMTU3OTM5Nn0.VkydOrueYpqOv1SNcs4XQzlQ9ausb6wh2KaQIGBZ2jk"
// REACT_APP_SUPABASE_PROJECT: "https://djstzjejdnfaizwrtinh.supabase.co"

export {};
