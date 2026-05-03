/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, removeTodo, sendTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Status } from './types/Status';
import { Footer } from './components/Footer';
import { ErrorMessage } from './types/ErrorMessage';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );
  const [status, setStatus] = useState<Status>(Status.All);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [deleteTodoId, setDeleteTodoIds] = useState<number[]>([]);

  const focusedInput = useRef<HTMLInputElement>(null);
  const timerId = useRef(0);

  const handleSetError = (newError: ErrorMessage) => {
    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setErrorMessage(ErrorMessage.None);
    }, 3000);

    setErrorMessage(newError);
  };

  useEffect(() => {
    setIsInputDisabled(true);

    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        handleSetError(ErrorMessage.Load);
      })
      .finally(() => {
        setIsInputDisabled(false);
        focusedInput.current?.focus();
      });
  }, []);

  useEffect(() => {
    if (!isInputDisabled) {
      focusedInput.current?.focus();
    }
  }, [isInputDisabled]);

  const preperedTodos = useMemo(() => {
    return todos.filter(todo => {
      if (status === Status.Completed) {
        return todo.completed;
      }

      if (status === Status.Active) {
        return !todo.completed;
      } else {
        return todo;
      }
    });
  }, [todos, status]);

  const itemsLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const areAllTodosActive = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const isCompletedTodo = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const addTodo = () => {
    const preperedTitle = query.trim();

    if (preperedTitle.trim().length === 0) {
      return handleSetError(ErrorMessage.Title);
    }

    setIsInputDisabled(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: preperedTitle,
      completed: false,
    } as Todo);

    sendTodo({ userId: USER_ID, title: preperedTitle, completed: false })
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setQuery('');
      })
      .catch(() => {
        handleSetError(ErrorMessage.AddTodo);
      })
      .finally(() => {
        setIsInputDisabled(false);
        setTempTodo(null);
        focusedInput.current?.focus();
      });
  };

  const deleteTodo = (todoId: number) => {
    setIsInputDisabled(true);
    setDeleteTodoIds((currentIds: number[]) => [...currentIds, todoId]);

    removeTodo(todoId)
      .then(() => {
        setTodos(ids => ids.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DeleteTodo);
      })
      .finally(() => {
        setIsInputDisabled(false);
        setDeleteTodoIds(ids => ids.filter(id => id !== todoId));
        focusedInput.current?.focus();
      });
  };

  async function deleteAllCompleteTodos() {
    setIsInputDisabled(true);

    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeleteTodoIds(currentTodos => [...currentTodos, ...completedIds]);

    const result = await Promise.allSettled(
      completedIds.map(id => removeTodo(id)),
    );

    const successIds = result
      .map((r, i) => (r.status === 'fulfilled' ? completedIds[i] : null))
      .filter(ids => ids !== null);

    const hasError = result.some(todo => todo.status === 'rejected');

    if (hasError) {
      handleSetError(ErrorMessage.DeleteTodo);
    }

    setTodos(current => current.filter(todo => !successIds.includes(todo.id)));

    setDeleteTodoIds(current =>
      current.filter(ids => !successIds.includes(ids)),
    );

    setIsInputDisabled(false);
    focusedInput.current?.focus();
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          query={query}
          onChangeQuery={setQuery}
          areCompleted={areAllTodosActive}
          inputRef={focusedInput}
          isInputDisabled={isInputDisabled}
          onAddTodo={addTodo}
        />

        <TodoList
          todos={preperedTodos}
          tempTodo={tempTodo}
          todoId={deleteTodoId}
          onDelete={deleteTodo}
        />

        {todos.length > 0 && (
          <Footer
            itemsLeft={itemsLeft}
            status={status}
            onChangeStatus={setStatus}
            isCompletedTodo={isCompletedTodo}
            onClearCopletedTodos={deleteAllCompleteTodos}
          />
        )}
      </div>

      <ErrorNotification
        error={errorMessage}
        onDeleteMessage={setErrorMessage}
      />
    </div>
  );
};
