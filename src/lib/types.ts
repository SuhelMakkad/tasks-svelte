export interface Todo {
	id: string;
	text: string;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface TaskList {
	id: string;
	name: string;
	todos: Todo[];
	createdAt: Date;
	updatedAt: Date;
}