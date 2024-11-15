import { NewsItem, NewsSource } from "../types/news";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

const getRandomPastTime = (index: number) => {
  return new Date(Date.now() - (index * 1800000 + Math.random() * 1800000)).toISOString();
};

const generateStoriesForSource = (sourceId: string, sourceName: string): NewsItem[] => {
  const topics = [
    ["Economy", "Markets", "Trade", "Finance", "Business"],
    ["Technology", "Innovation", "Digital", "AI", "Cybersecurity"],
    ["Climate", "Environment", "Energy", "Sustainability", "Conservation"],
    ["Health", "Medicine", "Research", "Wellness", "Healthcare"],
    ["Politics", "Policy", "Government", "Diplomacy", "International"]
  ];

  // Generate sentiment patterns that are more varied
  const sentimentPatterns = [
    { mood: "very positive", words: ["Breakthrough", "Revolutionary", "Historic Success", "Major Achievement"] },
    { mood: "positive", words: ["Progress", "Growth", "Improvement", "Advancement"] },
    { mood: "neutral", words: ["Updates", "Changes", "Developments", "Shifts"] },
    { mood: "negative", words: ["Challenges", "Concerns", "Difficulties", "Issues"] },
    { mood: "very negative", words: ["Crisis", "Critical Problems", "Severe Issues", "Major Setback"] }
  ];

  return Array.from({ length: 20 }, (_, i) => {
    const topicGroup = topics[Math.floor(Math.random() * topics.length)];
    const topic = topicGroup[Math.floor(Math.random() * topicGroup.length)];
    const sentimentPattern = sentimentPatterns[Math.floor(Math.random() * sentimentPatterns.length)];
    const headline = sentimentPattern.words[Math.floor(Math.random() * sentimentPattern.words.length)];
    
    return {
      title: `${topic}: ${headline} in ${sourceName}'s Latest Report`,
      description: `${sourceName} reports on ${topic.toLowerCase()} sector, highlighting ${sentimentPattern.mood} developments and their implications for global markets and society.`,
      url: `https://example.com/news/${sourceId}/${i + 1}`,
      urlToImage: `https://images.unsplash.com/photo-${1500000000000 + i}`,
      publishedAt: getRandomPastTime(i),
      source: { id: sourceId, name: sourceName }
    };
  });
};

const mockNewsData: NewsItem[] = [
  ...generateStoriesForSource("reuters", "Reuters"),
  ...generateStoriesForSource("bbc-news", "BBC News"),
  ...generateStoriesForSource("the-wall-street-journal", "Wall Street Journal"),
  ...generateStoriesForSource("cnn", "CNN")
];

export const fetchNews = async (source?: NewsSource): Promise<NewsItem[]> => {
  const isLocalhost = window.location.hostname === "localhost" || 
                     window.location.hostname === "127.0.0.1";

  if (!isLocalhost) {
    if (source) {
      return mockNewsData.filter(item => item.source.id === source);
    }
    return mockNewsData;
  }

  const sources = source ? `sources=${source}` : "sources=reuters,bbc-news,the-wall-street-journal,cnn";
  const response = await fetch(
    `${BASE_URL}/top-headlines?${sources}&apiKey=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  const data = await response.json();
  return data.articles;
};