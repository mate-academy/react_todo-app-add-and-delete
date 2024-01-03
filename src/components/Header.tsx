import { useState } from 'react';
import { addTodo } from '../api/todos';
import { useTodoContext } from '../context';
import { Errors } from '../types/Errors';
import { Todo } from '../types/Todo';

export const Header = () => {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    setAllTodos,
    visibleTodos,
    errorHandler,
    inputRef,
    setTempTodo,
    USER_ID,
  } = useTodoContext();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = query.trim();

    if (trimmedTitle === '') {
      errorHandler(Errors.titleError);

      return;
    }

    setIsLoading(true);

    try {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      const addedTodo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setAllTodos((prevTodos: Todo[] | null) => {
        return prevTodos ? [...prevTodos, addedTodo] : [addedTodo];
      });

      setTempTodo(null);
      setQuery('');
      setIsLoading(false);
    } catch (error) {
      setTempTodo(null);
      setIsLoading(false);
      errorHandler(Errors.addError);
    }
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {visibleTodos?.some(todo => !todo.completed)
        && (
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
            aria-label="Toggle All"
          />
        )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={query}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          onChange={handleQuery}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
