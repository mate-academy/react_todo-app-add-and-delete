import React, { useState, useEffect, useMemo } from 'react';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { FilteredBy } from './types/FilteredBy';
import { Todo } from './types/Todo';
import { TodoNotification } from './components/TodoNotification';
import { UserWarning } from './UserWarning';

const USER_ID = 6662;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTodoLoaded, setIsTodoLoaded] = useState(false);
  const [filterBy, setFilterBy] = useState<FilteredBy>(FilteredBy.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const isActiveTodos = todos.some(todo => todo.completed !== true);

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTempTodo(null);
      setIsTodoLoaded(true);
      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage('Data couldn\'t be loaded from the server');
    }
  };

  const createTodoOnServer = async (query: string) => {
    const data = {
      title: query,
      userId: USER_ID,
      completed: false,
    };

    setIsTodoLoaded(false);
    setTempTodo({
      id: 0,
      ...data,
    });
    try {
      await createTodo(USER_ID, data);
      getTodosFromServer();
    } catch (error) {
      setTempTodo(null);
      setErrorMessage('Unable to add a todo');
    }
  };

  const removeTodoOnServer = async (id: number) => {
    try {
      await deleteTodo(id);
      getTodosFromServer();
    } catch (error) {
      setTempTodo(null);
      setErrorMessage('Unable to delete a todo');
    }
  };

  const clearCompletedTodo = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => removeTodoOnServer(todo.id));
  };

  const visibleTodos: Todo[] = useMemo(() => {
    switch (filterBy) {
      case FilteredBy.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilteredBy.COMPLETED:
        return todos.filter(todo => todo.completed);
      case FilteredBy.ALL:
        return [...todos];
      default:
        throw new Error('Unexpected filter type');
    }
  }, [filterBy, todos]);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isTodoLoaded={isTodoLoaded}
          createTodoOnServer={createTodoOnServer}
          setErrorMessage={setErrorMessage}
          setIsError={setIsError}
          isActiveTodos={isActiveTodos}
        />

        {visibleTodos.length !== 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              removeTodoOnServer={removeTodoOnServer}
            />
            <Footer
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              isActiveTodos={isActiveTodos}
              clearCompletedTodo={clearCompletedTodo}
            />
          </>
        )}
      </div>
      {isError && (
        <TodoNotification
          errorMessage={errorMessage}
          setIsError={setIsError}
        />
      )}
    </div>
  );
};
