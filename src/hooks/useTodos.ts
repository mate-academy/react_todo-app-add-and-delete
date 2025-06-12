import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodo, deleteTodo, getTodos, USER_ID } from '../api/todos';
import { Errors } from '../types/Errors';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [initialLoading, setInitialLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [isMassDeleting, setIsMassDeleting] = useState(false);

  useEffect(() => {
    setInitialLoading(true);
    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(error => {
        if (error instanceof Error) {
          setErrorMessage(Errors.loadingUnable);

          return;
        }

        setErrorMessage(Errors.unknownError);
      })
      .finally(() => {
        setInitialLoading(false);
      });
  }, []);

  const onAddTodo = (title: string): Promise<boolean> | boolean => {
    if (!title.trim()) {
      setErrorMessage(Errors.titleError);

      return false;
    }

    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    const temp = { id: 0, ...newTodo };

    setErrorMessage('');
    setTempTodo(temp);

    return addTodo(newTodo)
      .then(receivedTodo => {
        setTodos(prev => [...prev, receivedTodo]);

        return true;
      })
      .catch(error => {
        if (error instanceof Error) {
          setErrorMessage(Errors.addindUnable);

          return false;
        }

        setErrorMessage(Errors.unknownError);

        return false;
      })
      .finally(() => setTempTodo(null));
  };

  const onDeleteTodo = (todoId: number): Promise<void> => {
    setErrorMessage('');
    setDeletingTodoId(todoId);

    return deleteTodo(todoId)
      .then(() => setTodos(prev => prev.filter(todo => todoId !== todo.id)))
      .catch(error => {
        if (error instanceof Error) {
          setErrorMessage(Errors.deletingUnable);

          return;
        }

        setErrorMessage(Errors.unknownError);
      })
      .finally(() => setDeletingTodoId(null));
  };

  const onDeleteAllCompleted = () => {
    setIsMassDeleting(true);
    setErrorMessage('');

    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(() => setTodos(prev => prev.filter(todo => !todo.completed)))
      .catch(error => {
        if (error instanceof Error) {
          setErrorMessage(Errors.deletingUnable);

          return;
        }

        setErrorMessage(Errors.unknownError);
      })
      .finally(() => setIsMassDeleting(false));
  };

  return {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    initialLoading,
    onAddTodo,
    tempTodo,
    onDeleteTodo,
    deletingTodoId,
    onDeleteAllCompleted,
    isMassDeleting,
  };
};
