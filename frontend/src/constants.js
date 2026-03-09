export const TOPICS = [
  "All", "Technology", "Politics", "Business",
  "Health", "Sports", "Science", "Education", "Celebrity"
];

export const TOPIC_CATEGORIES = {
  All: "",
  Technology: "technology",
  Politics: "politics",
  Business: "business",
  Health: "health",
  Sports: "sports",
  Science: "science",
  Education: "education",
  Celebrity: "entertainment",  // NewsAPI uses "entertainment" for celebrity news
};

export const LANGUAGES = ["English", "Spanish", "French", "German", "Hindi", "Arabic", "Chinese"];

export const BIAS_COLORS = {
  "Left": "#2563eb",
  "Center-Left": "#60a5fa",
  "Center": "#6b7280",
  "Center-Right": "#f97316",
  "Right": "#dc2626",
};

export const credibilityColor = (score) => {
  if (score >= 75) return "#16a34a";
  if (score >= 50) return "#ca8a04";
  return "#dc2626";
};