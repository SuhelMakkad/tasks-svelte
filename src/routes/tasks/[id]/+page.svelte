<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { taskLists } from '$lib/stores';
	import { goto } from '$app/navigation';

	let taskList = null;
	let newTodoText = '';

	$: taskListId = $page.params.id;

	onMount(() => {
		taskLists.loadFromStorage();
	});

	$: {
		if ($taskLists.length > 0) {
			taskList = $taskLists.find(tl => tl.id === taskListId);
			if (!taskList) {
				goto('/');
			}
		}
	}

	function handleCreateTodo() {
		if (newTodoText.trim() && taskList) {
			taskLists.addTodo(taskList.id, newTodoText.trim());
			newTodoText = '';
		}
	}

	function handleToggleTodo(todoId) {
		if (taskList) {
			const todo = taskList.todos.find(t => t.id === todoId);
			if (todo) {
				taskLists.updateTodo(taskList.id, todoId, { completed: !todo.completed });
			}
		}
	}

	function handleDeleteTodo(todoId) {
		if (taskList) {
			taskLists.deleteTodo(taskList.id, todoId);
		}
	}

	function handleKeydown(event) {
		if (event.key === 'Enter') {
			handleCreateTodo();
		}
	}
</script>

<svelte:head>
	<title>{taskList ? `${taskList.name} - Tasks` : 'Tasks'}</title>
</svelte:head>

{#if taskList}
	<div class="max-w-4xl mx-auto p-6">
		<div class="mb-8">
			<div class="flex items-center gap-4 mb-4">
				<button
					onclick={() => goto('/')}
					class="text-blue-500 hover:text-blue-700 focus:outline-none"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
					</svg>
				</button>
				<h1 class="text-3xl font-bold text-gray-800">{taskList.name}</h1>
			</div>
			
			<div class="flex gap-2">
				<input
					bind:value={newTodoText}
					onkeydown={handleKeydown}
					placeholder="Add a new todo..."
					class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<button
					onclick={handleCreateTodo}
					class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					Add Todo
				</button>
			</div>
		</div>

		<div class="space-y-3">
			{#each taskList.todos as todo (todo.id)}
				<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-3">
					<input
						type="checkbox"
						checked={todo.completed}
						onchange={() => handleToggleTodo(todo.id)}
						class="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
					/>
					<span class="flex-1 {todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}">{todo.text}</span>
					<button
						onclick={() => handleDeleteTodo(todo.id)}
						class="text-red-500 hover:text-red-700 focus:outline-none"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
						</svg>
					</button>
				</div>
			{:else}
				<div class="text-center py-12">
					<p class="text-gray-500 text-lg">No todos yet. Add your first one above!</p>
				</div>
			{/each}
		</div>

		{#if taskList.todos.length > 0}
			<div class="mt-8 p-4 bg-gray-50 rounded-lg">
				<div class="flex justify-between text-sm text-gray-600">
					<span>Total: {taskList.todos.length} todos</span>
					<span>Completed: {taskList.todos.filter(todo => todo.completed).length}</span>
					<span>Remaining: {taskList.todos.filter(todo => !todo.completed).length}</span>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<div class="max-w-4xl mx-auto p-6">
		<div class="text-center py-12">
			<p class="text-gray-500 text-lg">Loading...</p>
		</div>
	</div>
{/if}