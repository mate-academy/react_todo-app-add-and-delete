/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import * as todoService from './api/todos';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { SortByStatus } from './types/SortByStatus';
import { NotificationError } from
  './components/NotificationError/NotificationError';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorTypes } from './types/ErrorTypes';

const USER_ID = 11196;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortByStatus>(SortByStatus.All);
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(ErrorTypes.Load);
      });
  }, []);

  const handleClearCompletedTodos = useCallback(() => {
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
        setError(ErrorTypes.Delete);
      });
  }, [todos]);

  const handleSubmitForm = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsTodoLoading(true);

    if (!todoTitle) {
      setError(ErrorTypes.Title);
      setIsTodoLoading(false);
      setTempTodo(null);

      return;
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

      .then((newTodo) => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })

      .catch(() => {
        setError(ErrorTypes.Add);
      })

      .finally(() => {
        setIsTodoLoading(false);
        setTodoTitle('');
        setTempTodo(null);
      });
  }, [todoTitle, todos]);

  const deleteTodo = (todoId: number) => {
    setLoadingTodoId(todoId);

    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todoId !== todo.id));
      })

      .catch(() => {
        setError(ErrorTypes.Delete);
      });

    setLoadingTodoId(null);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const numberActiveTodos = todos.filter(todo => !todo.completed).length;

  const numberCompletedTodos
  = todos.filter(todo => todo.completed).length;

  const visibleTodos = useMemo(() => todos.filter((todo) => {
    switch (sortBy) {
      case SortByStatus.All:
        return todo;
      case SortByStatus.Active:
        return !todo.completed;
      case SortByStatus.Completed:
        return todo.completed;
      default:
        return true;
    }
  }), [todos, sortBy]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={visibleTodos.length}
          onSubmit={handleSubmitForm}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          isTodoLoading={isTodoLoading}
          numberCompletedTodos={numberCompletedTodos}
        />

        <TodoList
          todos={visibleTodos}
          onDeleteTodo={deleteTodo}
          tempTodo={tempTodo}
          loadingTodoId={loadingTodoId}
        />

        {(todos.length > 0) && (
          <Footer
            sortBy={sortBy}
            numberActiveTodos={numberActiveTodos}
            onChangeSortBy={setSortBy}
            hasCompletedTodo={numberCompletedTodos > 0}
            clearCompletedTodos={handleClearCompletedTodos}
          />
        )}
      </div>

      {error
        && (
          <NotificationError
            error={error}
            setError={setError}
            onCloseError={handleCloseError}
          />
        )}
    </div>
  );
};
