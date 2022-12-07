/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import {
  getTodos,
  updateTodo,
  createTodo,
  deleteTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Todo, TodoTitle } from './types/Todo';
import { ErrorType } from './components/ErrorType/ErrorType';

enum SelectedType {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>(SelectedType.ALL);
  const [showAll, setShowAll] = useState(true);
  const [isError, setIsError] = useState('');
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleError = (text: string) => {
    setIsError(text);
    setTimeout(() => {
      setIsError('');
    }, 5000);
  };

  const handleNewTodos = async () => {
    if (query.trim().length === 0) {
      handleError('Type something');

      return;
    }

    try {
      const newTodo = await createTodo(user?.id, query);

      setTodos((prevState) => {
        return [...prevState, newTodo];
      });
    } catch (error) {
      handleError('Can not add a todo');
    }
  };

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos(prevState => prevState.filter((a) => a.id !== todoId));
    } catch (error) {
      handleError('Can not delete a todo');
    }
  }, []);

  const changeTodo = useCallback(async (todoId: number, object: TodoTitle) => {
    try {
      const updatedTodo: Todo = await updateTodo(todoId, object);

      setTodos(prevState => (prevState.map((a) => (a.id === todoId
        ? updatedTodo
        : a))
      ));
    } catch (error) {
      handleError('Can not update a todo');
    }
  }, []);

  const showAllTodos = () => {
    todos.forEach(todo => {
      changeTodo(todo.id, { completed: showAll });
    });

    setShowAll(!showAll);
  };

  useEffect(() => {
    getTodos(user?.id)
      .then(res => setTodos(res))
      .catch(() => isError);

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case SelectedType.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case SelectedType.COMPLETED:
        return todos.filter(todo => todo.completed);

      default:
        return [...todos];
    }
  }, [todos, filter]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleNewTodos();
    setQuery('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                {
                  'todoapp__toggle-all active':
                    todos.every(todo => todo.completed),
                },
              )}
              onClick={showAllTodos}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              value={query}
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={handleChange}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          changeTodo={changeTodo}
          removeTodo={removeTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setFilter={setFilter}
            filter={filter}
            removeTodo={removeTodo}
          />
        )}

        {isError && (
          <ErrorType
            error={isError}
            setError={setIsError}
          />
        )}
      </div>
    </div>
  );
};
