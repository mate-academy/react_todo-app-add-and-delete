import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';
import { Header } from './components/Header';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotice } from './types/ErrorNotice';
import { Filter } from './types/Filter';
import { getVisibleTodos } from './helper/getVisibleTodos';

const USER_ID = 6762;

export const App: React.FC = () => {
  const [todosFromServer, setTodos] = useState<Todo[]>([]);
  const [hasError, setError] = useState(false);
  const [errorMessage, setMessageError] = useState('');
  const [filter, setFilter] = useState(Filter.ALL);
  const [title, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isProcessedIDs, setProcessingIDs] = useState([0]);

  const showError = (message: string) => {
    setError(true);
    setMessageError(message);
    setTimeout(setError, 3000);
  };

  const loadingTodos = async () => {
    try {
      const todos = await getTodos(USER_ID);

      setTodos(todos);
    } catch (error) {
      showError(ErrorNotice.LOADING);
    }
  };

  useEffect(() => {
    loadingTodos();
  }, []);

  //   event.preventDefault();

  //   if (!title.trim()) {
  //     showError(ErrorNotice.TYTLE);

  //     return;
  //   }

  //   const createTodo = {
  //     id: 0,
  //     userId: USER_ID,
  //     title,
  //     completed: false,
  //   };

  //   setTempTodo(createTodo);

  //   try {
  //     await addTodos(createTodo);

  //     setTempTodo(null);
  //     setNewTitle('');
  //     loadingTodos();
  //   } catch (error) {
  //     showError(ErrorNotice.ADD);
  //   }
  // };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        showError(ErrorNotice.TYTLE);

        return;
      }

      const createTodo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      setTempTodo(createTodo);

      try {
        await addTodos(createTodo);

        setTempTodo(null);
        setNewTitle('');
        loadingTodos();
      } catch (error) {
        showError(ErrorNotice.ADD);
      }
    }, [title],
  );

  const handleDelete = async (todoId: number) => {
    try {
      setProcessingIDs([todoId]);
      await deleteTodo(todoId);
      loadingTodos();
    } catch (error) {
      showError(ErrorNotice.DELETE);
    } finally {
      setProcessingIDs([0]);
    }
  };

  const handleDeleteCompleted = useCallback(
    async (todos: Todo[]) => {
      try {
        setProcessingIDs(todos.map(todo => todo.id));
        const removeAllComleted = todos.map(todo => (
          deleteTodo(todo.id)
        ));

        await Promise.all(removeAllComleted);

        loadingTodos();
      } catch (error) {
        showError(ErrorNotice.DELETE);
      } finally {
        setProcessingIDs([0]);
      }
    }, [isProcessedIDs],
  );

  const visibleTodos = useMemo(
    () => getVisibleTodos(todosFromServer, filter),
    [todosFromServer, filter],
  );

  const completedTodos = useMemo(
    () => todosFromServer.filter(todo => (todo.completed)),
    [todosFromServer],
  );

  const activeTodos = useMemo(
    () => todosFromServer.filter(todo => !todo.completed),
    [todosFromServer],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          handleSubmit={handleSubmit}
          createNewTitle={setNewTitle}
        />

        <TodoList
          todos={visibleTodos}
          creating={tempTodo}
          onDelete={handleDelete}
          isProcessedIDs={isProcessedIDs}
        />

        {!!todosFromServer.length && (
          <Footer
            filter={filter}
            onFilter={setFilter}
            completedTodos={completedTodos}
            activeTodosCount={activeTodos.length}
            deleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>
      <Notification
        error={hasError}
        errorNotice={errorMessage}
        setError={setError}
      />
    </div>
  );
};
