export interface CaseStudy {
    id: string;
    title: string;
    category: string;
    readTime: string;
    description: string;
    image: string;
    heroImage?: string;
    sections?: { heading: string; content: string; code?: string }[];
    outcome?: string[];
    relatedIds?: string[];
}

export type CaseStudies = CaseStudy[];
