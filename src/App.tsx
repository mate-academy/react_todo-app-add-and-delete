/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { getTodos, postTodo, deleteTodo } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { FilterType } from './types/FilterType';
import { Footer } from './components/Footer/Footer';

const USER_ID = 6704;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const [query, setQuery] = useState('');
  const [errorText, setErrorText] = useState('');
  const [filterType, setFilterType] = useState(FilterType.All);
  const [loading, setLoading] = useState(false);
  const [deletedTodoId, setDeletedTodoId] = useState([0]);

  const closeError = () => setTimeout(() => setErrorText(''), 3000);
  const handleCloseButton = () => setErrorText('');
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const fetchTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorText('Unable to load todos');
      closeError();
    }
  }, []);

  const addTodo = useCallback(async (title: string) => {
    try {
      setLoading(true);

      if (!title.length) {
        setErrorText("Title can't be empty");
        closeError();

        return;
      }

      const newTodo = {
        userId: USER_ID,
        title,
        completed: false,
      };

      setDisabledInput(true);
      setTempTodo({ ...newTodo, id: 0 });

      const createdTodo = await postTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch (error) {
      setErrorText('Unable to add todo');
      closeError();
    } finally {
      setTempTodo(null);
      setDisabledInput(false);
      setLoading(false);
    }
  }, []);

  const removeTodo = async (id: number) => {
    try {
      setDeletedTodoId(state => [...state, id]);
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch {
      setErrorText('Unable to delete a todo');
      closeError();
    } finally {
      setDeletedTodoId([]);
    }
  };

  const removeCompletedTodos = async () => {
    try {
      const completedIds = completedTodos.map(({ id }) => removeTodo(id));

      await Promise.all(completedIds);
      setTodos(activeTodos);
    } catch {
      setErrorText('Unable to delete completed todos');
      closeError();
    } finally {
      setDeletedTodoId([]);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(query);
    setQuery('');
  };

  const visibleTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);

      case FilterType.Active:
        return todos.filter(todo => !todo.completed);

      default:
        return todos;
    }
  }, [todos, filterType]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!activeTodos.length && (
            /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
            <button type="button" className="todoapp__toggle-all active" />
          )}
          <form
            onSubmit={handleSubmitForm}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={disabledInput}
              onChange={(event) => setQuery(event.target.value)}
              value={query}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loading={loading}
          removeTodo={removeTodo}
          deletedTodoId={deletedTodoId}
        />
        {!!todos.length && (
          <Footer
            activeTodos={activeTodos}
            filterType={filterType}
            setFilterType={setFilterType}
            completedTodos={completedTodos}
            removeCompletedTodos={removeCompletedTodos}
          />
        )}
      </div>
      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorText },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={handleCloseButton}
        />
        <span>{errorText}</span>
      </div>
    </div>
  );
};
