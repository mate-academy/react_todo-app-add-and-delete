import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  USER_ID,
  postTodo,
  getTodos,
  deleteTodo,
  updateTodo,
} from './api/todos';
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

  const handleTodoDelete = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.filter(prevTodo => todoId !== prevTodo.id);
        });
      })
      .catch(() => {
        handleError(ErrorText.Delete);
      });
  };

  const handleCompletedTodoDelete = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleTodoDelete(todo.id);
      }
    });
  };

  const handleTodoAdd = (newTitle: string) => {
    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: newTitle,
      completed: false,
    };

    setTempTodo(newTodo);

    postTodo(newTodo)
      .then(res => {
        setTitle('');

        setTodos(prevTodos => {
          return [
            ...prevTodos,
            {
              ...newTodo,
              id: res.id,
            },
          ];
        });
      })
      .catch(() => {
        handleError(ErrorText.Add);
      })
      .finally(() => {
        setTempTodo(null);
        inputRef.current?.focus();
      });
  };

  const handleTodoCheck = (checkedTodo: Todo) => {
    updateTodo({
      ...checkedTodo,
      completed: !checkedTodo.completed,
    })
      .then(resp => {
        setTodos(currentTodos => {
          return currentTodos.map(todo => (todo.id === resp.id ? resp : todo));
        });
      })
      .catch(() => {
        handleError(ErrorText.Update);
      });
  };

  useEffect(() => {
    const fetchTodos = () => {
      getTodos()
        .then(data => {
          setTodos(data);
        })
        .catch(() => {
          handleError(ErrorText.Loading);
        });
    };

    fetchTodos();
  }, [handleError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          isPosting={!!tempTodo}
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
          onTodoCheck={handleTodoCheck}
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
