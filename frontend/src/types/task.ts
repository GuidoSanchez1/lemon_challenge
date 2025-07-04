export interface Task {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    is_deleted: boolean;
    created_at: string;
    completed_at?: string;
    deleted_at?: string;
    owner_id: number;
}
export interface TaskResponse {
    task: Task;
}