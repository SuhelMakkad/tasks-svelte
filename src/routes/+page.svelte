<script>
	import { onMount } from 'svelte';
	import { taskLists } from '$lib/stores';
	import { goto } from '$app/navigation';

	let newTaskListName = '';

	onMount(() => {
		taskLists.loadFromStorage();
	});

	function handleCreateTaskList() {
		if (newTaskListName.trim()) {
			taskLists.addTaskList(newTaskListName.trim());
			newTaskListName = '';
		}
	}

	function handleDeleteTaskList(id) {
		taskLists.deleteTaskList(id);
	}

	function handleKeydown(event) {
		if (event.key === 'Enter') {
			handleCreateTaskList();
		}
	}
</script>

<div class="max-w-4xl mx-auto p-6">
	<h1 class="text-3xl font-bold text-gray-800 mb-8">Task Lists</h1>
	
	<div class="mb-8">
		<div class="flex gap-2">
			<input
				bind:value={newTaskListName}
				onkeydown={handleKeydown}
				placeholder="Enter task list name"
				class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<button
				onclick={handleCreateTaskList}
				class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				Create List
			</button>
		</div>
	</div>

	<div class="grid gap-4">
		{#each $taskLists as taskList (taskList.id)}
			<div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
				<div class="flex justify-between items-start mb-4">
					<h2 class="text-xl font-semibold text-gray-800">{taskList.name}</h2>
					<button
						onclick={() => handleDeleteTaskList(taskList.id)}
						class="text-red-500 hover:text-red-700 focus:outline-none"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
						</svg>
					</button>
				</div>
				
				<div class="mb-4">
					<p class="text-gray-600">
						{taskList.todos.length} todos
						{#if taskList.todos.length > 0}
							• {taskList.todos.filter(todo => todo.completed).length} completed
						{/if}
					</p>
				</div>
				
				<button
					onclick={() => goto(`/tasks/${taskList.id}`)}
					class="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
				>
					View Todos
				</button>
			</div>
		{:else}
			<div class="text-center py-12">
				<p class="text-gray-500 text-lg">No task lists yet. Create your first one above!</p>
			</div>
		{/each}
	</div>
</div>
