/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, createTodo, deleteTodo } from './api/todos';
import Header from './components/Header';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { ErrorType } from './types/Errors';
import { Status } from './types/Status';
import TodoList from './components/ToDoList';
import ErrorNotification from './components/ErrorNotification';
// import ToDoItem from './components/ToDoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Status>(Status.ALL);
  // const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorType(ErrorType.LOAD_TODOS))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (errorType) {
      const timer = setTimeout(() => setErrorType(null), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorType]);

  const handleCloseError = () => setErrorType(null);

  const handleAddTodo = async (title: string) => {
    if (!title.trim()) {
      setErrorType(ErrorType.EMPTY_TITLE);

      return;
    }

    // const newTempTodo: Todo = {
    //   id: 0,
    //   title,
    //   userId: USER_ID,
    //   completed: false,
    // };

    // setTempTodo(newTempTodo);

    try {
      const createdTodo = await createTodo(title);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
      // setTempTodo(null); // Убираем временную задачу после успешного добавления
    } catch (error) {
      console.error(error);
      setErrorType(ErrorType.LOAD_TODOS);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      console.error(error);
      setErrorType(ErrorType.DELETE_TODO);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    try {
      await Promise.allSettled(deletePromises);
      const results = await Promise.allSettled(deletePromises);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          setTodos(prevTodos =>
            prevTodos.filter(todo => todo.id !== completedTodos[index].id),
          );
        } else {
          console.error(`Failed to delete todo ${completedTodos[index].id}`);
          setErrorType(ErrorType.DELETE_TODO);
        }
      });
    } catch (error) {
      console.error(error);
      setErrorType(ErrorType.DELETE_TODO);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === Status.ACTIVE) {
      return !todo.completed;
    }

    if (filter === Status.COMPLETED) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.length - activeTodosCount;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      {!isLoading && errorType && (
        <p className="notification is-danger">{errorType}</p>
      )}

      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAddTodo={handleAddTodo} isSubmitting={isLoading} />

        {todos.length > 0 && (
          <TodoList todos={filteredTodos} onDeleteTodo={handleDeleteTodo} />
        )}

        {todos.length > 0 && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            activeCount={activeTodosCount}
            completedCount={completedTodosCount}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorType={errorType}
        handleCloseError={handleCloseError}
      />

      {/* {tempTodo && (
        <div>
          <h3>Temporary Todo</h3>
          <ToDoItem
            id={tempTodo.id}
            title={tempTodo.title}
            completed={tempTodo.completed}
          />
        </div>
      )} */}
    </div>
  );
};
