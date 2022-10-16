import {
  FC,
  FormEvent,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Footer';

import {
  getTodos,
  removeTodos,
  patchTodo,
  postTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import { FiltType } from './types/Filter';
import { Header } from './components/Header';
import { filtTodos } from './components/filtTodos';

export const App: FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filtType, setFiltType] = useState<FiltType>(FiltType.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeItem, setActiveItem] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [title, setTitle] = useState('');

  const getUserTodosFromServer = useCallback(async (userId: number) => {
    try {
      const userTodosFromServer = await getTodos(userId);

      setTodos(userTodosFromServer);
    } catch {
      setErrorMessage('Unable to update todos');
    }
  }, [user, todos]);

  useEffect(() => {
    if (!user) {
      return;
    }

    getUserTodosFromServer(user.id);
  }, [user]);

  const visibleTodos = useMemo(() => (
    filtTodos(todos, filtType)
  ), [todos, filtType]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  const addNewTodo = (todo: Todo) => {
    setTodos(prevTodos => [todo, ...prevTodos]);
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    setIsAdding(true);

    if (!title.trim()) {
      setErrorMessage('Title can\'t be empty');
      setTitle('');

      return;
    }

    try {
      if (!user) {
        return;
      }

      const newTodo = await postTodos(user.id, title);

      addNewTodo(newTodo);
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTitle('');
      setIsAdding(false);
    }
  }, [title, user]);

  const handleChangeTitleInput = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setTitle(value);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    try {
      await removeTodos(todoId);

      setTodos(
        todos.filter(userTodo => todoId !== userTodo.id),
      );
    } catch {
      setErrorMessage('Unable to delete a todo');
    }
  }, [todos, errorMessage, isAdding]);

  const upgradeTodos = useCallback(
    async (todoId: number, data: Partial<Todo>) => {
      try {
        const patchedTodo: Todo = await patchTodo(todoId, data);

        setTodos(todos.map(todo => (
          todo.id === todoId
            ? patchedTodo
            : todo
        )));
      } catch {
        setErrorMessage('Unable to update a todo');
      }
    }, [todos],
  );

  useMemo(() => {
    setActiveItem(todos.filter(todo => todo.completed === false).length);
    setIsCompleted(todos.some(todo => todo.completed === true));
  }, [todos]);

  const handleToggleClick = () => {
    const uncompletedTodos = todos.filter(({ completed }) => !completed);

    if (uncompletedTodos.length) {
      uncompletedTodos.map(async ({ id }) => {
        try {
          patchTodo(id, { completed: true });
        } catch {
          setErrorMessage('Unable to update todos');
        }
      });

      setTodos(todos.map(todo => {
        const copy = todo;

        copy.completed = true;

        return copy;
      }));
    } else {
      todos.map(async ({ id }) => {
        try {
          patchTodo(id, { completed: false });
        } catch {
          setErrorMessage('Unable to update todos');
        }
      });

      setTodos(todos.map(todo => {
        const copy = todo;

        copy.completed = false;

        return copy;
      }));
    }
  };

  const clearCompleted = () => {
    todos.forEach(async ({ id, completed }) => {
      if (completed) {
        try {
          await removeTodos(id);
        } catch {
          setErrorMessage('Unable to delete a todo');
        }
      }
    });

    setTodos(todos.filter(({ completed }) => !completed));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleToggleClick={handleToggleClick}
          handleSubmit={handleSubmit}
          newTodoField={newTodoField}
          isAdding={isAdding}
          title={title}
          setTitle={handleChangeTitleInput}
        />

        <TodoList
          visibleTodos={visibleTodos}
          removeTodo={handleDeleteTodo}
          isAdding={isAdding}
          handleStatusChange={upgradeTodos}
          mainInput={title}
        />

        {!!todos.length && (
          <Filter
            filtType={filtType}
            activeItem={activeItem}
            isCompleted={isCompleted}
            onSortChange={setFiltType}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          errorMessageHandler={setErrorMessage}
        />
      )}
    </div>
  );
};
