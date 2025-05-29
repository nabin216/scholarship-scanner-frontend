export interface Scholarship {
    id: number;
    title: string;
    description: string;
    levels: ScholarshipLevel[];    country: number;
    country_detail?: {
        id: number;
        name: string;
    };
    country_name?: string;
    field_of_study: FieldOfStudy[];
    deadline: string;
    open_date: string | null;
    fund_type: FundType[];
    sponsor_type: SponsorType[];
    language_requirement: LanguageRequirement[];
    image: string | null;
    is_featured: boolean;
    scholarship_category: ScholarshipCategory[];
    application_url: string;
    created_at: string;
    updated_at: string;
}

export interface ScholarshipLevel {
    id: number;
    name: string;
}

export interface FieldOfStudy {
    id: number;
    name: string;
}

export interface FundType {
    id: number;
    name: string;
}

export interface SponsorType {
    id: number;
    name: string;
}

export interface LanguageRequirement {
    id: number;
    name: string;
}

export interface ScholarshipCategory {
    id: number;
    name: string;
}
