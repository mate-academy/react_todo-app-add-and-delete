/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/Todolist/Todolist';
import { Error } from './components/Error/Error';
import { Todo } from './types/Todo';

enum FilteredStatus {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [filterTodos, setFilterTodos] = useState<string>(FilteredStatus.ALL);
  const [errorType, setErrorType] = useState('');
  const [changeTodos, setChangeTodos] = useState(true);

  const showError = (text: string) => {
    setErrorType(text);
    setTimeout(() => {
      setErrorType('');
    }, 2000);
  };

  const fetshTodo = async () => {
    if (query.trim().length === 0) {
      showError('Title can\'t be empty');

      return;
    }

    try {
      const newTodo = await createTodo(user?.id, query);

      setTodos((prevState) => {
        return [...prevState, newTodo];
      });
    } catch (error) {
      showError('Unable to add a todo');
    }
  };

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter((x) => x.id !== todoId));
    } catch (error) {
      showError('Unable to delete a todo');
    }
  }, []);

  const changeTodo = useCallback(async (todoId: number, object: any) => {
    try {
      const updetedTodo: Todo = await updateTodo(todoId, object);

      setTodos(prev => (prev.map((item) => (item.id === todoId
        ? updetedTodo
        : item))
      ));
    } catch (error) {
      showError('Unable to update a todo');
    }
  }, []);

  const changeAllTodos = () => {
    todos.forEach(todo => {
      changeTodo(todo.id, { completed: changeTodos });
    });

    setChangeTodos(!changeTodos);
  };

  useEffect(() => {
    getTodos(user?.id)
      .then(res => setTodos(res))
      .catch(() => errorType);

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const getFilteredTodos = useMemo(() => {
    switch (filterTodos) {
      case FilteredStatus.COMPLETED:
        return todos.filter(todo => todo.completed);

      case FilteredStatus.ACTIVE:
        return todos.filter(todo => !todo.completed);

      default:
        return [...todos];
    }
  }, [todos, filterTodos]);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetshTodo();
    setQuery('');
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
              className={classNames('todoapp__toggle-all', {
                'todoapp__toggle-all active':
                todos.every(todo => todo.completed),
              })}
              onClick={changeAllTodos}
            />
          )}

          <form
            onSubmit={handleSubmit}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={handleQuery}
            />
          </form>
        </header>

        <TodoList
          todos={getFilteredTodos}
          removeTodo={removeTodo}
          changeTodo={changeTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterTodos={filterTodos}
            setFilterTodos={setFilterTodos}
            removeTodo={removeTodo}
          />
        )}

        {errorType && (
          <Error
            error={errorType}
            setErrorType={setErrorType}
          />
        )}
      </div>
    </div>
  );
};
