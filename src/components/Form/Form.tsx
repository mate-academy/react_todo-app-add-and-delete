import { FC, useContext, useEffect, useState } from 'react';

import { postTodo } from '../../helpers';

import { Todo } from '../../types';

import { AppContext } from '../../wrappers/AppProvider';

export const Form: FC = () => {
  const { setErrorType, setTempTodo, setTodos, inputRef } =
    useContext(AppContext);

  const [query, setQuery] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading, inputRef]);

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setErrorType('empty');

      return;
    }

    try {
      setIsLoading(true);

      setTempTodo({
        isLoading: true,
        todo: {
          title: trimmedQuery,
          id: 0,
          completed: false,
        },
      });
      setIsLoading(true);

      const result = await postTodo(trimmedQuery);

      setTodos(prevState => [...prevState, result as Todo]);

      setQuery('');
    } catch (err) {
      setErrorType('add');
    } finally {
      setIsLoading(false);
      setTempTodo({
        todo: null,
        isLoading: false,
      });
    }
  };

  return (
    <form onSubmit={onFormSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        name="title"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isLoading}
      />
    </form>
  );
};
