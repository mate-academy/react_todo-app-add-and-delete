import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodo, USER_ID } from '../api/todos';

type Props = {
  filteredTodos: Todo[];
  setError: (value: string) => void;
  setTodos: (fn: SetTodosFuncion) => void;
  setTempTodo: (tempTask: Todo | null) => void;
  error: string;
};

type SetTodosFuncion = (todo: Todo[]) => Todo[];

export const useNewTodo = ({
  setTodos,
  setError,
  setTempTodo,
  filteredTodos,
  error,
}: Props) => {
  const hasAllTodosCompleted = filteredTodos.every(todo => todo.completed);
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [filteredTodos.length, error]);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const addNewTodo = (newTask: Omit<Todo, 'id'>) => {
    const tempTask: Todo = {
      id: 0,
      userId: USER_ID,
      title: newTask.title,
      completed: false,
    };

    setTempTodo(tempTask);
    setIsLoading(true);

    addTodo(newTask)
      .then(data => {
        setTodos(prevTodos => [...prevTodos, data]);
        setTempTodo(null);
        setTitle('');
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleNewTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimTitle = title.trim();

    if (!trimTitle) {
      setError('Title should not be empty');

      return;
    }

    const newTodoTask = {
      userId: USER_ID,
      title: trimTitle,
      completed: false,
    };

    addNewTodo(newTodoTask);
  };

  return {
    title,
    isLoading,
    inputRef,
    handleTitle,
    handleNewTodo,
    hasAllTodosCompleted,
  };
};
