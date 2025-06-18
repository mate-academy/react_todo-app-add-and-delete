import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
// import { getTodos, USER_ID } from './api/todos';
import { getTodos, USER_ID, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { filterTodos } from './utils/helpers';
import { Header } from './components/Header';
import { FilterType } from './enums/enums';
import { useTodoForm } from './hooks/useTodoForm';

import * as Constants from './hooks/constants';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  //#region State
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [filter, setFilter] = useState<FilterType>('all');

  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const showErrorContainer = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch (e) {
        showErrorContainer(Constants.ERROR_MESSAGE);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  const filteredTodos = filterTodos(todos, filter);

  const incompleteCount = todos.filter(todo => !todo.completed).length;

  const todosCompleted = todos.some(todo => todo.completed);

  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  const handleHideError = () => {
    setErrorMessage(null);
  };

  const handleToggleTodo = (todo: Todo) => {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
      title: todo.title.trim(),
    };

    setTodos(prevTodos =>
      prevTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
    );
  };

  const {
    newTodoTitle,
    isAddingTodo,
    tempTodo,
    inputRef,
    handleNewTodoSubmit,
    handleNewTodoTitleChange,
  } = useTodoForm({ setTodos, showErrorContainer });

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingTodoId(todoId);

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      showErrorContainer(Constants.DELETE_TODO_ERROR);
    } finally {
      setDeletingTodoId(null);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.allSettled(
      completedTodos.map(async todo => {
        try {
          await deleteTodo(todo.id);
          setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
        } catch (error) {
          showErrorContainer(Constants.DELETE_TODO_ERROR);
        }
      }),
    );

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const toggleAllTodos = () => {
    const areAllCompleted = todos.every(todo => todo.completed);

    setTodos(prevTodos =>
      prevTodos.map(todo => ({
        ...todo,
        completed: !areAllCompleted,
      })),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          handleNewTodoSubmit={handleNewTodoSubmit}
          newTodoTitle={newTodoTitle}
          handleNewTodoTitleChange={handleNewTodoTitleChange}
          isAddingTodo={isAddingTodo}
          toggleAllTodos={toggleAllTodos}
        />
        {todos.length !== 0 && (
          <TodoList
            todos={filteredTodos}
            handleToggleTodo={handleToggleTodo}
            handleDeleteTodo={handleDeleteTodo}
            deletingTodoId={deletingTodoId}
          />
        )}
        {loading && <p>Loading todos...</p>}

        {tempTodo && <TodoItem todo={tempTodo} isLoading onToggle={() => {}} />}
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            incompleteCount={incompleteCount}
            filter={filter}
            onFilterChange={handleFilterChange}
            todosCompleted={todosCompleted}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        onHideError={handleHideError}
      />
    </div>
  );
};
