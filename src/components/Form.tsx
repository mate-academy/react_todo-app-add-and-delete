import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as todosService from '../api/todos';

import { Todo } from '../types/Todo';

type Props = {
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setErrorMessage: (error: string) => void;
  addTempTodo: (todo: Todo | null) => void;
  isDeleted: boolean;
};
export const Form: React.FC<Props> = ({
  setTodos,
  setErrorMessage,
  addTempTodo,
  isDeleted,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isError, setIsError] = useState(false);

  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFocused) {
      field.current?.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isDeleted) {
      field.current?.focus();
    }
  }, [isDeleted]);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isError) {
      setErrorMessage('');
    }

    if (!query.trim().length) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsFocused(true);
    const newTodo = {
      userId: todosService.USER_ID,
      title: query.trim(),
      completed: false,
    };

    addTempTodo({ ...newTodo, id: 0 });

    try {
      const createTodo = await todosService.createTodo(newTodo);

      setIsError(false);
      setTodos(prevTodos => [...prevTodos, createTodo]);
      setQuery('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setIsError(true);
      setQuery(query);
    } finally {
      setIsFocused(false);
      addTempTodo(null);
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
      <input
        ref={field}
        value={query}
        onChange={handleChangeQuery}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isFocused}
      />
    </form>
  );
};
