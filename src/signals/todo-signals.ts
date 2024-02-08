import { computed, signal } from '@preact/signals-react';
import { Todo } from '../types/Todo';
import { filter } from './filter-signals';
import { FilterValues } from '../types/FilterValues';
import { ErrorValues } from '../types/ErrorValues';

type Error = keyof typeof ErrorValues;

export const todos = signal<Todo[]>([]);
export const tempTodo = signal<Todo | null>(null);
export const isError = signal<Error | null>(null);
export const todosToDelete = signal<number[]>([]);

export const filteredTodos = computed<Todo[]>(() => {
  switch (filter.value) {
    case FilterValues.All:
      return todos.value;

    case FilterValues.Active:
      return todos.value.filter(todo => !todo.completed);

    case FilterValues.Completed:
      return todos.value.filter(todo => todo.completed);

    default:
      return todos.value;
  }
});

export const activeTodosCounter = computed<number>(() => {
  return todos.value.filter(todo => !todo.completed).length;
});

export const completedTodosCounter = computed<number>(() => {
  return todos.value.filter(todo => todo.completed).length;
});
