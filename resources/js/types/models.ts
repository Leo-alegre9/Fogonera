export type Criticality = 'ALTA' | 'MEDIA' | 'BAJA';
export type QuestionType = 'single' | 'multiple' | 'open';
export type SubmissionStatus = 'draft' | 'completed';

export interface Module {
    id: number;
    code: string;
    name: string;
    slug: string;
    description: string | null;
    respondent_role_label: string | null;
    questions?: Question[];
    submissions?: Submission[];
    questions_count?: number;
    submissions_count?: number;
    completed_submissions_count?: number;
}

export interface Question {
    id: number;
    module_id: number;
    code: string;
    section: string;
    criticality: Criticality;
    text: string;
    type: QuestionType;
    options: string[];
    order: number;
}

export interface Submission {
    id: number;
    module_id: number;
    token: string;
    respondent_name: string | null;
    respondent_role: string | null;
    status: SubmissionStatus;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
}

export interface Answer {
    id: number;
    submission_id: number;
    question_id: number;
    selected_options: string[];
    other_text: string | null;
}
