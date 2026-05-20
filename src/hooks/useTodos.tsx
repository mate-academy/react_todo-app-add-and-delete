import { useEffect, useState } from 'react';
import { TodoViewModel } from '../types/Todo';
import { deleteTodo, getTodos, postTodo, USER_ID } from '../api/todos';
import { ERROR_MESSAGES } from '../constants/errors';

export function useTodos(showError: (message: string) => void) {
  const [todos, setTodos] = useState<TodoViewModel[]>([]);
  const [tempTodo, setTempTodo] = useState<TodoViewModel | null>(null);

  const { completedTodosCount, activeTodosCount } = todos.reduce(
    (acc, current) => {
      if (current.completed) {
        return {
          ...acc,
          completedTodosCount: acc.completedTodosCount + 1,
        };
      }

      return {
        ...acc,
        activeTodosCount: acc.activeTodosCount + 1,
      };
    },
    {
      activeTodosCount: 0,
      completedTodosCount: 0,
    },
  );

  useEffect(() => {
    getTodos()
      .then(res => {
        setTodos(res);
      })
      .catch(() => {
        showError(ERROR_MESSAGES.LOAD_TODOS);
      });
  }, [showError]);

  async function createTodo(title: string) {
    const todoToSend = {
      title,
      userId: USER_ID,
      completed: false,
    };
    const newTodo: TodoViewModel = {
      id: 0,
      ...todoToSend,
      isLoading: true,
    };

    setTempTodo(newTodo);
    try {
      const res = await postTodo(todoToSend);

      setTodos(prev => [...prev, res]);
    } catch (error) {
      showError(ERROR_MESSAGES.ADD_TODOS);
      setTodos(prev => {
        return prev.filter(item => item.id !== 0);
      });
      throw error;
    } finally {
      setTempTodo(null);
    }
  }

  async function deleteTodoById(id: number) {
    try {
      await deleteTodo(id);
      setTodos(prev => {
        return prev.filter(todo => todo.id !== id);
      });
    } catch {
      showError(ERROR_MESSAGES.DELETE_TODO);
    }
  }

  async function deleteCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    setTodos(prev =>
      prev.map(todo => (todo.completed ? { ...todo, isLoading: true } : todo)),
    );

    await Promise.all(
      completedTodos.map(async todo => {
        try {
          await deleteTodo(todo.id);

          setTodos(prev => prev.filter(t => t.id !== todo.id));
        } catch {
          showError(ERROR_MESSAGES.DELETE_TODO);
          setTodos(prev =>
            prev.map(item =>
              todo.id === todo.id ? { ...item, isLoading: false } : item,
            ),
          );
        }
      }),
    );
  }

  return {
    todos,
    tempTodo,
    deleteTodoById,
    deleteCompleted,
    createTodo,
    completedTodosCount,
    activeTodosCount,
  };
}
