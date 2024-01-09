import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { Status } from './types/Status';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem/TodoItem';

const USER_ID = 12130;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterBy, setFilterBy] = useState(Status.all);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);

  const handleClearCompleted = useCallback(() => {
    setIsDeletingCompleted(true);

    const completedTodos = todos
      .filter(todo => todo.completed)
      .map(todo => deleteTodo(todo.id));

    return Promise.all(completedTodos)
      .then(() => setTodos(currentTodos => {
        return currentTodos.filter(todo => !todo.completed);
      }))
      .catch((err) => {
        setErrorMessage(Errors.deleteTodoError);
        throw err;
      })
      .finally(() => setIsDeletingCompleted(false));
  }, [todos]);

  const handleDeleteTodo = useCallback((id: number) => {
    setErrorMessage(null);

    return deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => {
          return currentTodos.filter(todo => todo.id !== id);
        });
      })
      .catch((err) => {
        setErrorMessage(Errors.deleteTodoError);
        throw err;
      });
  }, []);

  const addNewTodo = useCallback((title: string) => {
    setErrorMessage(null);

    const newTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({ ...newTodo, id: 0 });

    return addTodo(newTodo)
      .then((addedTodo) => setTodos((currentTodos) => {
        return [...currentTodos, addedTodo];
      }))
      .catch((err) => {
        setErrorMessage(Errors.addTodoError);
        throw err;
      })
      .finally(() => setTempTodo(null));
  }, []);

  const visibleTodos = useMemo(() => {
    switch (filterBy) {
      case Status.all:
        return todos;

      case Status.active:
        return todos.filter(todo => !todo.completed);

      case Status.completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [filterBy, todos]);

  const hideError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    hideError();

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.loadError);
      });
  }, [hideError]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addNewTodo={addNewTodo}
          setError={setErrorMessage}
        />

        {!!todos.length && (
          <TodoList
            key={+isDeletingCompleted}
            todos={visibleTodos}
            onDeleteTodo={handleDeleteTodo}
            isDeletingCompleted={isDeletingCompleted}
          />
        )}

        {tempTodo && (
          <TodoItem
            loading
            onDeleteTodo={handleDeleteTodo}
            todo={tempTodo}
          />
        )}

        {!!todos.length && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} hideError={hideError} />
    </div>
  );
};
