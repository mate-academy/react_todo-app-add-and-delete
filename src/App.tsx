import React, { useCallback, useEffect, useRef, useState } from 'react';
import { USER_ID, postTodo, getTodos, deleteTodo } from './api/todos';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { FilterBy } from './types/FilterBy';
import { wait } from './utils/fetchClient';
import { getFilteredTodos } from './utils/getFilteredTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<Errors>(Errors.NoError);
  const [isPosting, setIsPosting] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);

  const preparedTodos = getFilteredTodos(todos, filterBy);

  const handleFilterByClick = (statusFilterValue: FilterBy) => {
    setFilterBy(statusFilterValue);
  };

  const handleHideError = () => {
    setError(Errors.NoError);
  };

  const handleError = useCallback((message: Errors) => {
    setError(message);
    wait(3000).then(() => handleHideError());
  }, []);

  const fetchTodos = useCallback(() => {
    getTodos().then(
      data => {
        setTodos(data);
      },
      () => {
        handleError(Errors.Loading);
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
        handleError(Errors.Delete);
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
          handleError(Errors.Add);
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
        <Header
          isPosting={isPosting}
          onAddNewTodo={handleTodoAdd}
          onError={handleError}
          title={title}
          setTitle={setTitle}
          inputRef={inputRef}
        />

        <Main
          todos={preparedTodos}
          tempTodo={tempTodo}
          onTodoDelete={handleTodoDelete}
        />

        {!!todos.length && (
          <Footer
            onFilterByClick={handleFilterByClick}
            todos={todos}
            filterBy={filterBy}
            onCompletedTodoDelete={handleCompletedTodoDelete}
          />
        )}
      </div>

      <Error errors={error} onHideError={handleHideError} />
    </div>
  );
};
