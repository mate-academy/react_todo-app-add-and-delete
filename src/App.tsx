import React, {
  useCallback, useEffect, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Footer } from './components/footer';
import { Main } from './components/main';
import { ErrorNotification } from './components/errorNotification';
import { Header } from './components/header';
import { Todo } from './types/Todo';
import { SelectOptions } from './types/SelectOptions';
import { ErrorType } from './types/ErrorType';
import { deleteTodos, getTodos, postTodos } from './api/todos';
import { USER_ID } from './utils/userId';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.ADD);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [completedTodosId, setCompletedTodosId] = useState<number[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isResponce, setIsResponce] = useState(true);
  const [todoToDeleteId, setTodoToDeleteId] = useState<number[]>([-1]);

  const filteredCompletedTodosId = useCallback((allTodos: Todo[]) => () => {
    return allTodos
      .filter((todo: Todo) => todo.completed)
      .map(todoItem => todoItem.id);
  }, []);

  const filterTodosBySelectOptions = () => (type: SelectOptions) => {
    switch (type) {
      case SelectOptions.ACTIVE:
        setVisibleTodos(todos.filter((todo: Todo) => !todo.completed));
        break;
      case SelectOptions.COMPLETED:
        setVisibleTodos(todos.filter((todo: Todo) => todo.completed));
        break;
      case SelectOptions.ALL:
      default:
        setVisibleTodos(todos);
    }
  };

  const loadTodosFromServer = useCallback(async () => {
    try {
      const todosData = await getTodos(USER_ID);

      setTodos(todosData);
      setVisibleTodos(todosData);
      setCompletedTodosId(filteredCompletedTodosId(todosData));
    } catch (err) {
      setIsError(true);
    }
  }, []);

  const emptyTodo = useCallback((title = '') => {
    const emptyNewTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(emptyNewTodo);
  }, []);

  const postTodoOnServer = useCallback(async (
    todoToPost: Pick<Todo, 'userId' | 'title' | 'completed'>,
  ) => {
    try {
      emptyTodo(todoToPost.title);
      setIsResponce(false);
      const postNewTodo = await postTodos(todoToPost);

      if (postNewTodo) {
        setTodos(prevState => ([...prevState, postNewTodo]));
      }

      await loadTodosFromServer();
    } catch {
      setErrorType(ErrorType.ADD);
      setIsError(true);
    } finally {
      setIsResponce(true);
      setTempTodo(null);
    }
  }, []);

  const deleteTodoFromServer = useCallback(async (todoId: number) => {
    try {
      setIsResponce(false);
      const deleteExistTodo = await deleteTodos(todoId);

      if (deleteExistTodo) {
        setTodos(prevState => {
          return prevState.filter(todo => todo.id !== todoId);
        });
        setTodoToDeleteId([-1]);
      }
    } catch {
      setErrorType(ErrorType.DELETE);
      setIsError(true);
    } finally {
      setIsResponce(true);
    }
  }, []);

  useEffect(() => {
    loadTodosFromServer();
  }, [todoToDeleteId]);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setIsError(false);
    }, 3000);

    return () => clearTimeout(timeoutID);
  }, [isError]);

  const closeNotification = () => {
    setIsError(false);
  };

  const addComplitedTodo = (todoId:number) => {
    const currentTodo = todos.find(todo => todo.id === todoId);

    if (currentTodo) {
      if (!completedTodosId.includes(todoId)) {
        setCompletedTodosId(prevState => ([...prevState, todoId]));
      } else {
        setCompletedTodosId(prevState => {
          return prevState.filter(id => id !== todoId);
        });
      }
    }
  };

  const addTodo = (todo: Pick<Todo, 'userId' | 'title' | 'completed' >) => {
    if (!todo.title.trim()) {
      setErrorType(ErrorType.ADD);
      setIsError(true);

      return;
    }

    postTodoOnServer(todo);
  };

  const deleteTodo = (todoId: number) => {
    const todoToDelete = todos.find(todo => todo.id === todoId);

    if (!todoToDelete) {
      setErrorType(ErrorType.DELETE);
      setIsError(true);

      return;
    }

    setTodoToDeleteId([todoId]);
    deleteTodoFromServer(todoId);
  };

  const deleteCompletedTodos = async () => {
    try {
      setTodoToDeleteId(completedTodosId);
      await Promise.all(
        completedTodosId.map(id => deleteTodos(id)),
      );

      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch {
      setIsError(true);
      setErrorType(ErrorType.DELETE);
    } finally {
      setTodoToDeleteId([-1]);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAddTodo={addTodo} inputDisable={isResponce} />

        {!!todos.length
          && (
            <Main
              todos={visibleTodos}
              addComplitedTodo={addComplitedTodo}
              onTodoDelete={deleteTodo}
              todoToDeleteId={todoToDeleteId}
              tempTodo={tempTodo}
            />
          )}

        {!!todos.length
          && (
            <Footer
              filterTodos={filterTodosBySelectOptions}
              todosCount={todos.length}
              completedTodosCount={completedTodosId.length}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          )}
      </div>

      {isError && (
        <ErrorNotification
          onNotificationClose={closeNotification}
          isErrorOccuring={isError}
          errorTypeToShow={errorType}
        />
      )}
    </div>
  );
};
