import React, {
  useContext, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import { Todo } from './types/Todo';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodosContext } from './components/TodoContext';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [query, setQuery] = useState<string>(Filter.all);
  const [isSubmiting] = useState(false);

  const todosContext = useContext(TodosContext);

  const {
    todos,
    addTodo,
    setErrorMessage,
    errorMessage,
    hideError,
  } = todosContext;

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDeleteErrorMessage = () => {
    setErrorMessage(ErrorMessage.DEFAULT);
  };

  const handleFormSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage(ErrorMessage.TITLE_ERROR);
      hideError(ErrorMessage.DEFAULT);

      return;
    }

    if (title.trim() === '') {
      return;
    }

    addTodo(title);

    setTitle('');
  };

  hideError(ErrorMessage.DEFAULT);

  const isCompletedTodos = () => {
    return todos.some(currentTodo => !currentTodo.completed);
  };

  const getQuantityOfActiveTodos = (todo: Todo[]) => {
    const activeTodo = todo.filter(currentTodo => !currentTodo.completed);

    return activeTodo.length;
  };

  const numberOfActive = useMemo(() => {
    return getQuantityOfActiveTodos(todos);
  }, [todos]);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const getFilteredTodo = (query: string) => {
    switch (query) {
      case Filter.all:
        return todos;

      case Filter.active:
        return todos.filter(currentTodo => !currentTodo.completed);

      case Filter.completed:
        return todos.filter(currentTodo => currentTodo.completed);

      default:
        break;
    }

    return todos;
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button type="button" className="todoapp__toggle-all active" />

          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              data-cy="createTodo"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleTitleChange}
              disabled={isSubmiting}
            />
          </form>
        </header>
        {todos.length > 0 && (
          <>
            <section className="main">
              <TodoList
                todos={getFilteredTodo(query)}
              />
            </section>

            <TodoFooter
              changeQuery={setQuery}
              completed={isCompletedTodos()}
              active={numberOfActive}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <div className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
        >
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className="delete"
            onClick={handleDeleteErrorMessage}
          />
          {errorMessage}
        </div>
      )}
    </div>
  );
};
