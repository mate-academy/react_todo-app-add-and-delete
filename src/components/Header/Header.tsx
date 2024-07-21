import * as React from 'react';
import classNames from 'classnames';
import {
  ErrorContext,
  TempTodoContext,
  TodosContext,
  isUpdatingContext,
} from '../../utils/Store';
import { handleAddTodo, handleToggleAll } from '../../utils/utilityFunctions';

export const Header: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [isDisabled, setIsDisabled] = React.useState(false);

  const { setTempTodo } = React.useContext(TempTodoContext);
  const { setIsError } = React.useContext(ErrorContext);
  const { todos, setTodos } = React.useContext(TodosContext);
  const { setIsUpdating } = React.useContext(isUpdatingContext);

  const IsAllCompleted = React.useMemo(() => {
    return todos.every(todo => todo.completed === true);
  }, [todos]);

  const addTodoArguments = {
    query: query,
    todos: todos,
    setIsDisabled: setIsDisabled,
    setTodos: setTodos,
    setQuery: setQuery,
    setIsError: setIsError,
    setTempTodo: setTempTodo,
  };

  const toggleAllArguments = {
    todos: todos,
    setIsUpdating: setIsUpdating,
    setIsError: setIsError,
    setTodos: setTodos,
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: IsAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={event => handleToggleAll({ ...toggleAllArguments, event })}
        />
      )}

      <form onSubmit={event => handleAddTodo({ ...addTodoArguments, event })}>
        <input
          disabled={isDisabled}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value.trimStart())}
          ref={input => input && input.focus()}
        />
      </form>
    </header>
  );
};
