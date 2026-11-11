import {
  FileText,
  Image,
  Code2,
  Search,
  Share2,
  ShoppingBag,
  MessageSquareText,
  type LucideIcon,
} from "lucide-react";

export type Generator = {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: LucideIcon;
  color: "violet" | "pink" | "blue" | "green" | "orange" | "cyan" | "indigo";
  cost: number;
  placeholder: string;
  systemPrompt: string;
};

export const generators: Generator[] = [
  {
    id: "writer",
    name: "AI Writer",
    category: "Writing",
    description: "Articles, emails, ads and more",
    icon: FileText,
    color: "violet",
    cost: 1,
    placeholder: "Write a blog post about the future of remote work...",
    systemPrompt:
      "You are an expert writer. Produce clear, engaging, well-structured content in Markdown. Match the format requested by the user (article, email, ad copy). Be concise but complete. Do not invent facts you are unsure of.",
  },
  {
    id: "image",
    name: "Image Generator",
    category: "Design",
    description: "Create visuals from a prompt",
    icon: Image,
    color: "pink",
    cost: 2,
    placeholder: "A minimal purple workspace setup, soft lighting, isometric style...",
    systemPrompt: "You generate images from text prompts.",
  },
  {
    id: "code",
    name: "Code Assistant",
    category: "Development",
    description: "Generate and explain code",
    icon: Code2,
    color: "blue",
    cost: 1,
    placeholder: "Write a TypeScript function that rate-limits API calls...",
    systemPrompt:
      "You are a senior software engineer. Return production-quality code with brief comments only where needed. Prefer TypeScript. Include edge-case handling and a short usage example when helpful.",
  },
  {
    id: "seo",
    name: "SEO Studio",
    category: "Marketing",
    description: "Optimize content for search",
    icon: Search,
    color: "green",
    cost: 1,
    placeholder: "Create an SEO plan for a landing page about organic coffee beans...",
    systemPrompt:
      "You are an SEO strategist. Produce actionable plans: title tags, meta descriptions, keyword clusters, content outlines and on-page checklists in Markdown.",
  },
  {
    id: "social",
    name: "Social Creator",
    category: "Marketing",
    description: "Create posts and campaigns",
    icon: Share2,
    color: "orange",
    cost: 1,
    placeholder: "Draft 3 LinkedIn posts announcing our new AI feature...",
    systemPrompt:
      "You are a social media copywriter. Write platform-ready posts with hooks, scannable structure and relevant hashtags. Provide multiple variations when asked.",
  },
  {
    id: "product-copy",
    name: "Product Copy",
    category: "Commerce",
    description: "Descriptions for your store",
    icon: ShoppingBag,
    color: "cyan",
    cost: 1,
    placeholder: "Write a product description for a stainless steel travel mug...",
    systemPrompt:
      "You are an e-commerce copywriter. Write conversion-focused product copy: short description, full description, feature bullets and a clear CTA in Markdown.",
  },
  {
    id: "chat",
    name: "AI Chat",
    category: "Assistant",
    description: "Think through ideas with AI",
    icon: MessageSquareText,
    color: "indigo",
    cost: 1,
    placeholder: "Help me brainstorm names for a productivity newsletter...",
    systemPrompt:
      "You are a thoughtful assistant. Answer clearly, structure long answers with headings or lists, ask clarifying questions when the request is ambiguous, and stay practical.",
  },
];

export function getGenerator(id: string): Generator | undefined {
  return generators.find((g) => g.id === id);
}

export const generatorCategories = [
  "All tools",
  "Writing",
  "Design",
  "Development",
  "Marketing",
  "Commerce",
  "Assistant",
] as const;
