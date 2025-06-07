import { writable } from 'svelte/store';
import type { TaskList } from './types';

function createTaskListStore() {
	const { subscribe, set, update } = writable<TaskList[]>([]);

	const loadFromStorage = () => {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('taskLists');
			if (stored) {
				try {
					const parsed = JSON.parse(stored);
					const taskLists = parsed.map((tl: any) => ({
						...tl,
						createdAt: new Date(tl.createdAt),
						updatedAt: new Date(tl.updatedAt),
						todos: tl.todos.map((todo: any) => ({
							...todo,
							createdAt: new Date(todo.createdAt),
							updatedAt: new Date(todo.updatedAt)
						}))
					}));
					set(taskLists);
				} catch (e) {
					console.error('Error parsing stored task lists:', e);
				}
			}
		}
	};

	const saveToStorage = (taskLists: TaskList[]) => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('taskLists', JSON.stringify(taskLists));
		}
	};

	return {
		subscribe,
		loadFromStorage,
		addTaskList: (name: string) => {
			const newTaskList: TaskList = {
				id: crypto.randomUUID(),
				name,
				todos: [],
				createdAt: new Date(),
				updatedAt: new Date()
			};
			update(lists => {
				const newLists = [...lists, newTaskList];
				saveToStorage(newLists);
				return newLists;
			});
		},
		updateTaskList: (id: string, updates: Partial<TaskList>) => {
			update(lists => {
				const newLists = lists.map(list => 
					list.id === id 
						? { ...list, ...updates, updatedAt: new Date() }
						: list
				);
				saveToStorage(newLists);
				return newLists;
			});
		},
		deleteTaskList: (id: string) => {
			update(lists => {
				const newLists = lists.filter(list => list.id !== id);
				saveToStorage(newLists);
				return newLists;
			});
		},
		addTodo: (taskListId: string, text: string) => {
			update(lists => {
				const newLists = lists.map(list => {
					if (list.id === taskListId) {
						const newTodo = {
							id: crypto.randomUUID(),
							text,
							completed: false,
							createdAt: new Date(),
							updatedAt: new Date()
						};
						return {
							...list,
							todos: [...list.todos, newTodo],
							updatedAt: new Date()
						};
					}
					return list;
				});
				saveToStorage(newLists);
				return newLists;
			});
		},
		updateTodo: (taskListId: string, todoId: string, updates: Partial<{ text: string; completed: boolean }>) => {
			update(lists => {
				const newLists = lists.map(list => {
					if (list.id === taskListId) {
						return {
							...list,
							todos: list.todos.map(todo => 
								todo.id === todoId 
									? { ...todo, ...updates, updatedAt: new Date() }
									: todo
							),
							updatedAt: new Date()
						};
					}
					return list;
				});
				saveToStorage(newLists);
				return newLists;
			});
		},
		deleteTodo: (taskListId: string, todoId: string) => {
			update(lists => {
				const newLists = lists.map(list => {
					if (list.id === taskListId) {
						return {
							...list,
							todos: list.todos.filter(todo => todo.id !== todoId),
							updatedAt: new Date()
						};
					}
					return list;
				});
				saveToStorage(newLists);
				return newLists;
			});
		}
	};
}

export const taskLists = createTaskListStore();