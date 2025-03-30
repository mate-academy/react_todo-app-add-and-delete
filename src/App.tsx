/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FilterStatus } from './types/FilterStatus';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import ErrorNotification from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempAddedTodo, setTempAddedTodo] = useState<Todo | null>(null);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const handleError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleAddTodo = () => {
    const title = newTodoTitle.trim();

    if (!title) {
      handleError('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempAddedTodo(newTodo);

    return addTodo(title)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        handleError('Unable to add a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setTempAddedTodo(null);
      });
  };

  const handleFilterChange = useCallback((status: FilterStatus) => {
    setFilterStatus(status);
  }, []);

  const toggleTodo = useCallback((id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }, []);

  const toggleAllTodos = useCallback(() => {
    const areAllCompleted = todos.every(todo => todo.completed);

    setTodos(prevTodos =>
      prevTodos.map(todo => ({ ...todo, completed: !areAllCompleted })),
    );
  }, [todos]);

  const handleDeleteTodo = async (todoId: number) => {
    setDeletedIds(ids => [...ids, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      handleError('Unable to delete a todo');
    } finally {
      setDeletedIds(ids => ids.filter(id => id !== todoId));
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp" data-cy="TodoApp">
      <h1 className="todoapp__title" data-cy="TodoAppTitle">
        todos
      </h1>
      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          handleAddTodo={handleAddTodo}
          toggleAllTodos={toggleAllTodos}
          isLoading={isLoading}
          data-cy="Header"
        />
        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            visibleTodos={filteredTodos}
            toggleTodo={toggleTodo}
            deleteTodo={handleDeleteTodo}
            isLoading={isLoading}
            tempAddedTodo={tempAddedTodo}
            deletedIds={deletedIds}
            data-cy="TodoListComponent"
          />
        </section>
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterStatus={filterStatus}
            handleFilterChange={handleFilterChange}
            handleDeleteTodo={handleDeleteTodo}
            data-cy="Footer"
          />
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        data-cy="ErrorNotification"
        aria-live="assertive"
      />
    </div>
  );
};
