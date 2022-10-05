/* eslint-disable jsx-a11y/control-has-associated-label */
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
// import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

import {
  getTodos,
  removeTodos,
  patchTodo,
  postTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import { SortType } from './types/Filter';
// import { NewTodoField } from './components/NewTodoField';
import { Header } from './components/Header';

function filtTodos(
  todos: Todo[],
  sortType: SortType,
) {
  const visibleTodos = [...todos];

  switch (sortType) {
    case SortType.Active:
      return visibleTodos.filter(todo => !todo.completed);

    case SortType.Completed:
      return visibleTodos.filter(todo => todo.completed);
    default:
      return visibleTodos;
  }
}

export const App: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [sortType, setSortType] = useState<SortType>(SortType.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeItem, setActiveItem] = useState<number>(0);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [title, setTitle] = useState<string>('');

  let userId = 0;

  if (user?.id) {
    userId = user.id;
  }

  useEffect(() => {
    getTodos(userId)
      .then(userTodosFromServer => {
        setTodos(userTodosFromServer);
      })
      .catch(() => setErrorMessage('Unable to update todos'));
  }, []);

  const visibleTodos = useMemo(() => (
    filtTodos(todos, sortType)
  ), [todos, sortType]);

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

  const reset = () => {
    setTitle('');
    setIsAdding(false);
  };

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
    }

    reset();
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

  // check how many empty tasks and if something done
  useMemo(() => {
    setActiveItem(todos.filter(todo => todo.completed === false).length);
    setIsCompleted(todos.some(todo => todo.completed === true));
  }, [todos]);

  const handleToggleClick = () => {
    const uncompletedTodos = todos.filter(({ completed }) => !completed);

    if (uncompletedTodos.length) {
      uncompletedTodos.map(({ id }) => patchTodo(id, { completed: true })
        .catch(() => setErrorMessage('Unable to update todos')));

      setTodos(todos.map(todo => {
        const copy = todo;

        copy.completed = true;

        return copy;
      }));
    } else {
      todos.map(({ id }) => patchTodo(id, { completed: false })
        .catch(() => setErrorMessage('Unable to update todos')));

      setTodos(todos.map(todo => {
        const copy = todo;

        copy.completed = false;

        return copy;
      }));
    }
  };

  const clearCompleted = () => {
    todos.forEach(({ id, completed }) => {
      if (completed) {
        removeTodos(id)
          .catch(() => setErrorMessage('Unable to delete a todo'));
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
          todos={visibleTodos}
          removeTodo={handleDeleteTodo}
          // setIsAdding={setIsAdding}
          isAdding={isAdding}
          handleStatusChange={upgradeTodos}
          mainInput={title}
        // upgradeTodos={upgradeTodos}
        />

        <Footer
          sortType={sortType}
          activeItem={activeItem}
          isCompleted={isCompleted}
          onSortChange={setSortType}
          clearCompleted={clearCompleted}
        />
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
