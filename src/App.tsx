import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  deleteTodo,
  getCompletedTodos,
  getTodos,
  postTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotifications } from './components/ErrorNotifications';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import { Errors } from './types/Errors';
import { Error } from './types/Error';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [seenTodos, setSeenTodos] = useState(todos);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isError, setIsError] = useState<Error>({
    message: Errors.NONE,
    status: false,
  });

  const [query, setQuery] = useState('');
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [isTodoOnLoad, setIsTodoOnLoad] = useState(false);
  const [pickedTodoIds, setPickedTodoIds] = useState<number[]>([]);

  const errorNotification = useCallback((text: Errors) => {
    setIsError({ message: text, status: true });

    setTimeout(() => {
      setIsError({
        message: text,
        status: false,
      });
    }, 3000);
  }, []);

  const fetchTodos = useCallback(async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch (error) {
      errorNotification(Errors.LOAD);
    }
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    fetchTodos();
  }, []);

  useEffect(() => {
    let todosToFilter = [...todos];

    if (filter !== 'All') {
      todosToFilter = todosToFilter.filter(todo => {
        switch (filter) {
          case Filter.Active:
            return !todo.completed;

          case Filter.Completed:
            return todo.completed;

          default:
            return true;
        }
      });
    }

    setSeenTodos(todosToFilter);
  }, [todos, filter]);

  const addTodo = async (title: string) => {
    try {
      if (user) {
        const todoToAdd: Todo = {
          id: 0,
          userId: user.id,
          title,
          completed: false,
        };

        setQuery('');
        setNewTodo(todoToAdd);

        await postTodo(todoToAdd);
        await fetchTodos();
      }
    } catch (error) {
      errorNotification(Errors.ADD);
    }
  };

  const handleTodoCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsError({
      message: Errors.NONE,
      status: false,
    });

    try {
      if (!query.trim()) {
        errorNotification(Errors.TITLE);
      } else {
        setIsTodoOnLoad(true);
        await addTodo(query);
        setIsTodoOnLoad(false);
        setNewTodo(null);
      }
    } catch (error) {
      errorNotification(Errors.ADD);
    }
  };

  const todoDeleting = async (id: number) => {
    try {
      setPickedTodoIds([id]);

      await deleteTodo(id);
      await fetchTodos();

      setPickedTodoIds([]);
    } catch (error) {
      errorNotification(Errors.DELETE);
    }
  };

  const handleFilter = useCallback(
    (todosFilter: Filter) => setFilter(todosFilter), [todos],
  );

  const handleErrorClose = useCallback(() => setIsError({
    message: Errors.NONE,
    status: false,
  }), []);

  const handleClearCompleted = async () => {
    try {
      if (user) {
        const completedIds = await getCompletedTodos(user.id);

        setPickedTodoIds(completedIds.map(todo => todo.id));

        await Promise.all(completedIds.map(async ({ id }) => {
          await deleteTodo(id);
        }));

        await fetchTodos();
      }
    } catch (error) {
      errorNotification(Errors.DELETE);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          todos={todos}
          query={query}
          handleTodoCreate={handleTodoCreate}
          setQuery={setQuery}
          isTodoOnLoad={isTodoOnLoad}
        />

        <TodoList
          todos={seenTodos}
          newTodo={newTodo}
          isTodoOnLoad={isTodoOnLoad}
          onDelete={todoDeleting}
          pickedTodoId={pickedTodoIds}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            handleFilter={handleFilter}
            filter={filter}
            completedDelete={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotifications
        isError={isError}
        handleErrorClose={handleErrorClose}
      />
    </div>
  );
};
