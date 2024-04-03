import React, { useCallback, useEffect, useRef, useState } from 'react';
import { USER_ID, postTodo, getTodos, deleteTodo } from './api/todos';
import { UserWarning } from './UserWarning';
import { TodoAppHeader } from './components/TodoAppHeader';
import { TodoAppMain } from './components/TodoAppMain';
import { TodoAppFooter } from './components/TodoAppFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { ErrorText } from './types/ErrorText';
import { StatusFilter } from './types/StatusFilter';
import { wait } from './utils/fetchClient';
import { getFilteredTodos } from './utils/getFilteredTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorText, setErrorText] = useState<ErrorText>(ErrorText.NoError);
  const [isPosting, setIsPosting] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    StatusFilter.All,
  );

  const preparedTodos = getFilteredTodos(todos, statusFilter);

  const handleStatusFilterClick = (statusFilterValue: StatusFilter) => {
    setStatusFilter(statusFilterValue);
  };

  const handleHideError = () => {
    setErrorText(ErrorText.NoError);
  };

  const handleError = useCallback((message: ErrorText) => {
    setErrorText(message);
    wait(3000).then(() => handleHideError());
  }, []);

  const fetchTodos = useCallback(() => {
    getTodos().then(
      data => {
        setTodos(data);
      },
      () => {
        handleError(ErrorText.Loading);
      },
    );
  }, [handleError]);

  const handleTodoDelete = (todoId: number) => {
    deleteTodo(todoId).then(
      () => {
        setTodos(prevTodos => {
          return prevTodos.filter(prevTodo => todoId !== prevTodo.id);
        });
      },
      () => {
        handleError(ErrorText.Delete);
      },
    );
  };

  const handleCompletedTodoDelete = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleTodoDelete(todo.id);
      }
    });
  };

  const handleTodoAdd = async (newTitle: string) => {
    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: newTitle,
      completed: false,
    };

    setIsPosting(true);
    setTempTodo(newTodo);

    postTodo(newTodo)
      .then(
        res => {
          const newTodoId = res.id;

          setTitle('');
          setTempTodo(null);
          setTodos(prevTodos => {
            return [
              ...prevTodos,
              {
                ...newTodo,
                id: newTodoId,
              },
            ];
          });

          fetchTodos();
        },
        () => {
          setTempTodo(null);
          handleError(ErrorText.Add);
        },
      )
      .finally(() => {
        setIsPosting(false);
        inputRef.current?.focus();
      });
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          isPosting={isPosting}
          onAddNewTodo={handleTodoAdd}
          onError={handleError}
          title={title}
          setTitle={setTitle}
          inputRef={inputRef}
        />

        <TodoAppMain
          todos={preparedTodos}
          tempTodo={tempTodo}
          onTodoDelete={handleTodoDelete}
        />

        {!!todos.length && (
          <TodoAppFooter
            onStatusFilterClick={handleStatusFilterClick}
            todos={todos}
            statusFilter={statusFilter}
            onCompletedTodoDelete={handleCompletedTodoDelete}
          />
        )}
      </div>

      <ErrorNotification errorText={errorText} onHideError={handleHideError} />
    </div>
  );
};
