// This file is to maintain the skills section data interface

export interface Skill {
    name: string;
    icon: string;
    category: string;
}

export type Skills = Skill[];