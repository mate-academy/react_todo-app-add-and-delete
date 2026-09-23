import cn from 'classnames';

import { NewTodoForm } from '../NewTodoForm';

import type { Todo } from '../../types/Todo';
import type { FormEvent, RefObject } from 'react';

type Props = {
  todos: Todo[];
  completedTodos: Todo[];
  onFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  query: string;
  onQueryChange: (newQuery: string) => void;
  isLoading: boolean;
  inputRef: RefObject<HTMLInputElement>;
};

export const Header = ({
  todos,
  completedTodos,
  onFormSubmit,
  query,
  onQueryChange,
  isLoading,
  inputRef,
}: Props) => {
  return (
    <div>
      <header className="todoapp__header">
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.length === completedTodos.length,
          })}
          data-cy="ToggleAllButton"
        />
        <NewTodoForm
          onFormSubmit={onFormSubmit}
          query={query}
          onQueryChange={onQueryChange}
          isLoading={isLoading}
          inputRef={inputRef}
        />
      </header>
    </div>
  );
};
