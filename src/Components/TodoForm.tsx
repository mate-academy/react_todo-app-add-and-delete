import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { filterTodo } from '../Services/Todo';
import classNames from 'classnames';
import { FilterTodo } from '../types/FilterTodo';

type Props = {
  todos: Todo[];
  inputRef?: React.RefObject<HTMLInputElement>;
  onSubmit: (title: string) => Promise<void>;
  onError: (message: string, isServerError: boolean) => void;
};

const TodoFormComponent: React.FC<Props> = ({
  todos,
  onSubmit,
  onError,
  inputRef,
}) => {
  const [query, setQuery] = useState('');
  const [isSubmited, setIsSubmited] = useState(false);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [isSubmited, inputRef]);

  const resetForm = () => {
    setQuery('');
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const normailedQuery = query.trim();

    if (!normailedQuery) {
      onError('Title should not be empty', false);

      return;
    }

    try {
      setIsSubmited(true);
      await onSubmit(normailedQuery.trim());
      resetForm();
    } finally {
      setIsSubmited(false);
    }
  };

  const completedTodos = filterTodo(todos, FilterTodo.completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.length === completedTodos.length,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          onChange={event => handleChangeInput(event)}
          ref={inputRef}
          value={query}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isSubmited}
        />
      </form>
    </header>
  );
};

export const TodoForm = React.memo(TodoFormComponent);
