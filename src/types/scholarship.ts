export interface Level {
  id: number;
  name: string;
}

export interface ScholarshipCategory {
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

export interface Country {
  id: number;
  name: string;
}

export interface Scholarship {
  id: number;
  title: string;
  description: string;
  provider: string;
  amount: string;
  deadline: string;
  open_date?: string;
  application_url: string;
  image?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  
  // Related objects
  levels: Level[];
  scholarship_category: ScholarshipCategory[];
  field_of_study: FieldOfStudy[];
  fund_type: FundType[];
  sponsor_type: SponsorType[];
  language_requirement: LanguageRequirement[];
  country_detail: Country;
  country_name: string;
}

export interface Filters {
  levels: string;
  country: string;
  field_of_study: string;
  fund_type: string;
  sponsor_type: string;
  scholarship_category: string;
  deadline_before: string;
  language_requirement: string;
}

export interface SortConfig {
  field: 'deadline' | 'title' | 'country' | 'open_date' | 'created_at';
  direction: 'asc' | 'desc';
}