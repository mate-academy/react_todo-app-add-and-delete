/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as todoService from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { Error } from './types/Error';
import { Status } from './types/Status';

const USER_ID = 11335;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState(Status.All);
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(Error.Loading));
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsTodoLoading(true);
      if (!todoTitle) {
        setIsTodoLoading(false);
        setError(Error.Title);
        setTempTodo(null);
      }

      const newTempTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      };

      setTempTodo(newTempTodo);

      todoService.createTodo(USER_ID, {
        title: todoTitle,
        userId: USER_ID,
        completed: false,
      })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
        })
        .catch(() => setError(Error.Add))
        .finally(() => {
          setTodoTitle(Error.None);
          setIsTodoLoading(false);
          setTempTodo(null);
        });
    }, [todos, todoTitle],
  );

  const deleteTodo = (todoId: number) => {
    setLoadingTodoId(todoId);
    setIsTodoLoading(true);

    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(
          currentTodos => currentTodos.filter(todo => todoId !== todo.id),
        );
      })
      .catch(() => {
        setError(Error.Delete);
      });
    setLoadingTodoId(null);
    setIsTodoLoading(false);
  };

  const handleClearCompleted = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(
      completedTodos.map(todo => (
        todoService.deleteTodo(todo.id)
      )),
    )
      .then(() => {
        setTodos(todos.filter(todo => !todo.completed));
      })
      .catch(() => {
        setError(Error.Delete);
      });
  }, [todos]);

  const visibleTodos = useMemo(() => todos.filter(todo => {
    switch (status) {
      case Status.Active:
        return !todo.completed;
      case Status.Completed:
        return todo.completed;
      default:
        return true;
    }
  }), [status, todos]);

  const numberCompletedTodos
    = todos.filter(todo => todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          onSubmit={handleSubmit}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          isTodoLoading={isTodoLoading}
          todosLength={visibleTodos.length}
          numberCompletedTodos={numberCompletedTodos}
        />
        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              loadingTodoId={loadingTodoId}
              onDelete={deleteTodo}
            />

            <Footer
              todos={todos}
              status={status}
              setStatus={setStatus}
              clearCompletedTodos={handleClearCompleted}
            />
          </>
        )}
        {error && (
          <ErrorMessage
            error={error}
            setError={setError}
          />
        )}
      </div>
    </div>
  );
};
