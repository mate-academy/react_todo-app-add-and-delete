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
import { Todo, TodoTitle } from './types/Todo';

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
  const [errorMessage, setErrorMessage] = useState('');
  const [changeTodos, setChangeTodos] = useState(true);
  const [isLoader, setIsLoader] = useState(false);
  const [isDeleating, setIsDeleating] = useState<number[]>([]);

  const showError = (text: string) => {
    setErrorMessage(text);
    setTimeout(() => {
      setErrorMessage('');
    }, 2000);
  };

  const fetchTodo = async () => {
    if (query.trim().length === 0) {
      showError('Title can\'t be empty');

      return;
    }

    setIsLoader(true);

    try {
      const newTodo = await createTodo(user?.id, query);

      setTodos((prevState) => {
        return [...prevState, newTodo];
      });
    } catch (error) {
      showError('Unable to add a todo');
    } finally {
      setIsLoader(false);
    }
  };

  const removeTodo = useCallback(async (todoId: number) => {
    setIsDeleating((prevState) => [...prevState, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter((x) => x.id !== todoId));
    } catch (error) {
      showError('Unable to delete a todo');
    }
  }, []);

  const changeTodo = useCallback(async (todoId: number, object: TodoTitle) => {
    try {
      const updatedTodo: Todo = await updateTodo(todoId, object);

      setTodos(prev => (prev.map((item) => (item.id === todoId
        ? updatedTodo
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
      .catch(() => errorMessage);

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
    fetchTodo();
    setQuery('');
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              aria-label="text"
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
          isDeleating={isDeleating}
          isLoader={isLoader}
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

        {errorMessage && (
          <Error
            error={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )}
      </div>
    </div>
  );
};
