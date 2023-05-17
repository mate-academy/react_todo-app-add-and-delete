import React, { useCallback, useState } from 'react';
import { addTodo, USER_ID } from '../../api/todos';
import { Todo, TodoData } from '../../types';

type Props = {
  setErrorMessage: (message: string) => void;
  setTempTodo: (newTodo: Todo | null) => void;
  createTodo: (newTodo: Todo) => void;
};

export const TodoForm: React.FC<Props> = React.memo(({
  setErrorMessage,
  setTempTodo,
  createTodo,
}) => {
  const [query, setQuery] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!query.trim().length) {
        setErrorMessage('Title can not be empty');

        return;
      }

      setErrorMessage('');

      const todoToAdd: TodoData = {
        title: query,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({ ...todoToAdd, id: 0 });

      try {
        setIsInputDisabled(true);
        const newTodo = await addTodo(todoToAdd);

        createTodo(newTodo);
        setQuery('');
      } catch {
        setErrorMessage('Unable to add a todo');
      } finally {
        setTempTodo(null);
        setIsInputDisabled(false);
      }
    }, [query],
  );

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        disabled={isInputDisabled}
      />
    </form>
  );
});
