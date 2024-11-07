import { useLayoutEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import * as todoApi from '../api/todos';
import { TodoErrors } from '../utils/enums/TodoErrors';
import { getCompletedTodos } from '../utils/todos/getTodos';
import { revomesTodosById } from '../utils/todos/removeTodos';

export const useTodos = (showError: (err: TodoErrors) => void) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const fetchTodos = async () => {
    try {
      const data = await todoApi.getTodos();
      setTodos(data);
    } catch {
      showError(TodoErrors.load);
    }
  };

  const addTodo = async (title: string): Promise<Todo | void> => {
    try {
      const todo = { title, userId: todoApi.USER_ID, completed: false };

      setTempTodo({ ...todo, id: 0 });

      const newTodo = await todoApi.addTodo(todo);

      setTodos(prevState => [...prevState, newTodo]);
      setTempTodo(null);
    } catch (err) {
      showError(TodoErrors.add);
      setTempTodo(null);
      throw err;
    }
  };

  const deleteTodo = async (todoId: number): Promise<number | void> => {
    try {
      await todoApi.deleteTodo(todoId);

      setTodos(current => current.filter(({ id }) => id !== todoId));

      return todoId;
    } catch {
      showError(TodoErrors.delete);
    }
  };

  const deleteCompletedTodos = async () => {
    const completedTodos = getCompletedTodos(todos);

    try {
      const todoIds = await Promise.all(
        completedTodos.map(({ id }) => deleteTodo(id)),
      );
      const validTodoIds = todoIds.filter(
        (id): id is number => id !== undefined,
      );

      if (!!validTodoIds.length) {
        setTodos(revomesTodosById(todos, validTodoIds));
      }
    } catch (err) {
      // eslint-disabled-next-line no-console
      console.log(err);
    }
  };

  useLayoutEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    tempTodo,
    fetchTodos,
    addTodo,
    deleteTodo,
    deleteCompletedTodos,
  };
};
