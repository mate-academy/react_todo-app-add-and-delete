import { Todo } from '../types/Todo';
import * as api from '../api/todos';
import { USER_ID } from '../api/todos';

export const todosService = {
  // Завантажити todos користувача
  async loadTodos(): Promise<Todo[]> {
    return api.getTodos();
  },

  // Додати новий todo
  async addTodo(title: string): Promise<Todo> {
    const newTodo: Omit<Todo, 'id'> = {
      title,
      userId: USER_ID,
      completed: false,
    };

    return api.createTodo(newTodo);
  },

  // Видалити todo за id
  async removeTodo(id: number): Promise<void> {
    await api.deleteTodo(id);
  },

  // Переключити completed
  async toggleTodo(todo: Todo): Promise<Todo> {
    return api.toggleTodoCompleted(todo);
  },

  // Функція для масового перемикання
  async toggleAllTodos(
    todosToUpdate: Todo[],
    targetStatus: boolean,
  ): Promise<Todo[]> {
    // Створюємо масив промісів для паралельного виконання
    const updatePromises = todosToUpdate.map(todo => {
      // Створюємо новий об'єкт todo з оновленим статусом
      const updatedTodo = {
        ...todo,
        completed: targetStatus,
      };

      // Викликаємо функцію оновлення для кожного todo
      return api.toggleTodoCompleted(updatedTodo);
    });

    // Очікуємо виконання всіх промісів і повертаємо оновлені todo
    return Promise.all(updatePromises);
  },
};
