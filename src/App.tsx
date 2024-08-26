import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FilterStatusType, Todo } from './types/Todo';
import * as tadoService from './api/todos';
import { Footer } from './component/Footer';
import { Error } from './component/Error';
import { ListComponent } from './component/ListComponent';
import { ErrorMessages, errorMessages } from './types/err';

function filterTodos(todos: Todo[], filter: FilterStatusType) {
  switch (filter) {
    case FilterStatusType.All:
      return todos;
    case FilterStatusType.Active:
      return todos.filter(todo => !todo.completed);
    case FilterStatusType.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterStatusType>(
    FilterStatusType.All,
  );
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoadingTodos, setIsLoadingTodo] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  // const todoRef = useRef<HTMLInputElement>(null);

  const handleError = (message: ErrorMessages) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  useEffect(() => {
    tadoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(errorMessages.load);
      });
  }, []);

  const handleDelete = (todoId: number) => {
    setIsLoadingTodo(prev => [...prev, todoId]);

    // setTimeout(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // }, 0);

    tadoService
      .deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        handleError(errorMessages.delete);
      })
      .finally(() => {
        setIsLoadingTodo(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleAddTodo = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (query.trim() === '') {
        handleError('Title should not be empty');

        return;
      }

      const newTodo = {
        title: query.trim(),
        completed: false,
        userId: tadoService.USER_ID,
      };

      const tempTado = {
        id: 0,
        ...newTodo,
      };

      setTempTodo(tempTado);

      setIsLoading(true);

      tadoService
        .addTodos(newTodo)
        .then(newTodos => {
          setTodos(currentPosts => [...currentPosts, newTodos]);
          setQuery('');
        })
        .catch(() => {
          handleError(errorMessages.add);
        })
        .finally(() => {
          setIsLoading(false);
          setTempTodo(null);
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 0);
        });
    }
  };

  const tasks = filterTodos(todos, filterBy);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={event => event.preventDefault()}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={handleQueryChange}
              onKeyDown={handleAddTodo}
              autoFocus
              disabled={isLoading}
            />
          </form>
        </header>

        <ListComponent
          todos={tasks}
          handleDelete={handleDelete}
          isLoadingTodos={isLoadingTodos}
          isLoading={isLoading}
          tempTodo={tempTodo}
        />
        {todos.length > 0 && (
          <Footer setFilterBy={setFilterBy} todos={todos} filterBy={filterBy} />
        )}
      </div>
      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
