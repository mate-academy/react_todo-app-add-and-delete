import { useEffect, useState } from 'react';
import * as todoService from '../api/todos';
import { Todo } from '../types/Todo';
import { TodoErrors } from '../types/TodoErrors';

export function useTodo() {
  const [data, setData] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isTodoDeleted, setIsTodoDeleted] = useState<number | null>(null);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [errorMessage]);

  useEffect(() => {
    setErrorMessage(null);
    todoService
      .getTodos()
      .then(setData)
      .catch(() => setErrorMessage(TodoErrors.UnableToLoad));
  }, []);

  const deleteTodo = (todoId: number) => {
    setIsTodoDeleted(todoId);
    todoService
      .deleteTodos(todoId)
      .then(() => setData(prev => prev.filter(todo => todo.id !== todoId)))
      .catch(() => setErrorMessage(TodoErrors.UnableToDeleteTodo))
      .finally(() => setIsTodoDeleted(null));
  };

  const hasCompletedTodos = data.some(todo => todo.completed);

  const deleteCompletedTodos = () => {
    const completedIds = data
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (completedIds.length === 0) {
      return Promise.resolve();
    }

    setIsInputDisabled(true);
    setIsTodoDeleted(null);

    setIsTodoDeleted(null);

    return Promise.allSettled(
      completedIds.map(id => todoService.deleteTodos(id).then(() => id)),
    )
      .then(results => {
        const successIds = results
          .filter(result => result.status === 'fulfilled')
          .map(result => (result as PromiseFulfilledResult<number>).value);

        const isSomeFailed = results.some(r => r.status === 'rejected');

        if (isSomeFailed) {
          setErrorMessage(TodoErrors.UnableToDeleteTodo);
        }

        setData(prev => prev.filter(todo => !successIds.includes(todo.id)));
      })
      .finally(() => {
        setIsInputDisabled(false);
        setIsTodoDeleted(null);
      });
  };

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    const tTodo: Todo = {
      id: 0,
      userId: todoService.USER_ID,
      title: newTodo.title,
      completed: false,
    };

    setTempTodo(tTodo);
    setIsInputDisabled(true);

    return todoService
      .createTodos(newTodo)
      .then(todoFromServer => {
        setData(prev => [...prev, todoFromServer]);
      })
      .finally(() => {
        setTempTodo(null);
        setIsInputDisabled(false);
      });
  };

  return {
    data,
    errorMessage,
    tempTodo,
    isInputDisabled,
    isTodoDeleted,
    hasCompletedTodos,
    setErrorMessage,
    deleteTodo,
    addTodo,
    deleteCompletedTodos,
  };
}
