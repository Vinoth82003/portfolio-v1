// This file is to maintain the projects section data interface

export interface Project {
    id: string;
    title: string;
    type: string;
    year: string;
    description: string; // Used for short tooltips/preview
    tech: string[];
    link: string;
    image: string; // Gallery thumbnail
    accent: "primary" | "secondary" | "accent";
    
    // Detailed fields for [id] page
    heroImage?: string;
    github?: string;
    overview?: string;
    challenge?: string;
    solution?: string;
    outcome?: string;
    gallery?: string[];
}

export type Projects = Project[];