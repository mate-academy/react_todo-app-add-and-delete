import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
  addNewTodo: (title: string) => void;
  setErrorMessage: (message: string) => void;
  setHasError: (val: boolean) => void;
  todos: Todo[];
};

export const NewTodoField: React.FC<Props> = ({
  newTodoField,
  isAdding,
  addNewTodo,
  setErrorMessage,
  setHasError,
  todos,
}) => {
  const [title, setTitle] = useState('');

  const hasCompleted = (allTodos: Todo[]) => {
    const filtredTodos = allTodos.filter(todo => todo.completed);

    return filtredTodos.length > 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();

    if (title.trim() === '') {
      setHasError(true);
      setErrorMessage('Title can\'t be empty');

      return;
    }

    addNewTodo(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        aria-label="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: hasCompleted(todos) },
        )}
        hidden={todos.length === 0}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
