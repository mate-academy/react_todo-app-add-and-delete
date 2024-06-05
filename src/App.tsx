/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos, postTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorsManager } from './components/ErrorsManager/ErrorsManager';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoItem } from './components/TodoItem/TodoItem';

export enum Filters {
  all = 'all',
  completed = 'completed',
  active = 'active',
}

export enum Errors {
  load = 'Unable to load todos',
  empty = 'Title should not be empty',
  add = 'Unable to add a todo',
  delete = 'Unable to delete a todo',
  update = 'Unable to update a todo',
  default = 'No errors',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Errors>(Errors.default);
  const [filter, setFilter] = useState<Filters>(Filters.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState('');
  const [submit, setSubmit] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => setError(Errors.load))
      .finally(() => setIsLoading(false));
  }, []);

  const handleErrorHide = () => {
    setError(Errors.default);
  };

  useEffect(() => {
    if (error !== Errors.default) {
      setTimeout(() => {
        handleErrorHide();
      }, 3000);
    }
  }, [error]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, error]);

  const filteredTodos = useMemo(
    () =>
      todos
        .filter(todo => {
          // eslint-disable-next-line prettier/prettier
          switch (filter) {
            case Filters.all:
              return todo;
            case Filters.active:
              return !todo.completed;
            case Filters.completed:
              return todo.completed;
            default:
              return todo;
          }
        })
        .filter(todo => todo.title.toLowerCase()),
    [filter, todos],
  );

  const handleAddNewTodo = (title: string) => {
    const todoTitle = query.trim();

    if (!todoTitle.length) {
      setError(Errors.empty);

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title,
      completed: false,
    });

    setIsLoading(true);
    setSubmit(true);

    postTodo({ title: todoTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);

        setQuery('');
      })
      .catch(() => setError(Errors.add))
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
        setSubmit(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setError(Errors.delete));
  };

  const clearCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    for (const todo of completedTodos) {
      handleDeleteTodo(todo.id);
    }
  }, [todos]);

  const handleFilter = (type: Filters) => setFilter(type);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          onAddNewTodo={handleAddNewTodo}
          query={query}
          setQuery={setQuery}
          inputRef={inputRef}
          inputLoading={isLoading}
          todos={todos}
          submit={submit}
        />
        {!!todos.length && (
          <TodoList todos={filteredTodos} onDelete={handleDeleteTodo} />
        )}

        {tempTodo && (
          <TodoItem todo={tempTodo} onDelete={handleDeleteTodo} isLoad={true} />
        )}

        {!!todos.length && (
          <Footer
            filter={filter}
            onFilterChange={handleFilter}
            todos={todos}
            filteredTodos={filteredTodos}
            clearCompleted={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorsManager error={error} errorHide={handleErrorHide} />
    </div>
  );
};
