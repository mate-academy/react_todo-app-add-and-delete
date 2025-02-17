import React, { useState } from 'react';
import classNames from 'classnames';

import { MessageError } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  addTodo: (text: string) => void;
  setIsError: (value: boolean) => void;
  setErrorMessage: (str: MessageError) => void;
}

export const TodoHeader: React.FC<Props> = ({
  todos,
  addTodo,
  setIsError,
  setErrorMessage,
}) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query) {
      addTodo(query);
    } else {
      setIsError(true);
      setErrorMessage(MessageError.queryError);
    }

    setQuery('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
