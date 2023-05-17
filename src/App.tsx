import {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { createTodo, getTodos, deleteTodo } from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Error } from './types/Errors';
import { AddTodoForm } from './components/AddTodoForm';
import { TodoList } from './components/TodoList';
import { FilterBy } from './types/TodosFilter';
import { TodoFilter } from './components/TodoFilter';
import { Notification } from './components/Notification';

const USER_ID = 10353;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterBy.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (error: Error) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const loadTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      handleError(Error.LOAD);
    }
  }, []);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterBy.ALL:
          return true;

        case FilterBy.COMPLETED:
          return todo.completed;

        case FilterBy.ACTIVE:
          return !todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filter]);

  const handleAddTodo = async () => {
    if (!title) {
      handleError(Error.EMPTYTITLE);

      return;
    }

    try {
      const todo = {
        title,
        id: 0,
        userId: USER_ID,
        completed: false,
      };

      setIsLoading(true);

      await createTodo(todo);
      setTempTodo(todo);

      loadTodos();

      setIsLoading(false);
      setTitle('');
    } catch {
      handleError(Error.ADD);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDelete = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      const filteredTodos = visibleTodos.filter(todo => todo.id !== todoId);

      setTodos(filteredTodos);
    } catch {
      handleError(Error.DELETE);
    }
  };

  const clearCompletedTodo = async () => {
    try {
      const completedTodoIds = visibleTodos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      visibleTodos.forEach(todo => {
        if (completedTodoIds.includes(todo.id)) {
          deleteTodo(todo.id);
        }
      });

      loadTodos();
    } catch {
      handleError(Error.DELETE);
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed);

  useEffect(() => {
    loadTodos();
  }, [visibleTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <header className="todoapp__header">
          {todos.length > 0 && (
            // eslint-disable-next-line jsx-a11y/control-has-associated-label
            <button type="button" className="todoapp__toggle-all active" />
          )}

          <AddTodoForm
            title={title}
            handleTitle={setTitle}
            addTodo={handleAddTodo}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            onDelete={handleDelete}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos.length} items left`}
            </span>

            <TodoFilter
              filter={filter}
              onSetFilter={setFilter}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={clearCompletedTodo}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <Notification
        message={errorMessage}
        handleMessage={setErrorMessage}
      />
    </div>
  );
};
