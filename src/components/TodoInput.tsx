import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { addNewTodo, USER_ID } from '../api/todos';
import classNames from 'classnames';

type SearchFieldProps = {
  setTitleError: (val: boolean) => void;
  setVisibleTodos: (value: Todo[]) => void;
  setTodos: (value: Todo[]) => void;
  setAddError: (value: boolean) => void;
  setTempTodo: (value: Todo | null) => void;
  setNotificationIsHide: (value: boolean) => void;
  todos: Todo[];
};

export const TodoInput: React.FC<SearchFieldProps> = ({
  setTitleError,
  setTodos,
  setVisibleTodos,
  setAddError,
  setTempTodo,
  setNotificationIsHide,
  todos,
}) => {
  // #region TodoInput states
  const [query, setQuery] = useState('');
  // #endregion
  const inputRef = useRef<HTMLInputElement>(null);
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  const addTodo = async (newTodo: Omit<Todo, 'id'>) => {
    try {
      const todo = await addNewTodo(newTodo);

      const updatedTodos = [...todos, { ...todo }];

      setVisibleTodos(updatedTodos);
      setTodos(updatedTodos);
    } catch {
      setAddError(false);
      setTimeout(() => setAddError(true), 0);
      throw new Error();
    }
  };

  const setInputDisabled = (value: boolean) => {
    if (inputRef.current) {
      inputRef.current.disabled = value;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setTitleError(false);
      setTimeout(() => setTitleError(true), 0);

      return;
    }

    const plannedTodo = {
      id: 0,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    };

    try {
      setTempTodo(plannedTodo);
      setInputDisabled(true);
      setNotificationIsHide(true);

      await addTodo(plannedTodo);

      setTempTodo(null);
      setQuery('');
    } catch {
      setTempTodo(null);
      throw new Error();
    } finally {
      setInputDisabled(false);
      inputRef.current?.focus();
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={query}
          onChange={ev => setQuery(ev.target.value)}
        />
      </form>
    </header>
  );
};
