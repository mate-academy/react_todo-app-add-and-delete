/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';

type FilterStatus = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [isErrorHidden, setIsErrorHidden] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deleteId, setDeleteId] = useState<number[]>([]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    const loadTodos = async () => {
      setIsLoading(true);
      setIsErrorHidden(true);

      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        setErrorMessage('Unable to load todos');
        setIsErrorHidden(false);
        setTimeout(() => setIsErrorHidden(true), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const handleFilterChange = (newFilter: FilterStatus) => {
    setFilter(newFilter);
  };

  const closeError = () => {
    setIsErrorHidden(true);
  };

  const handleAddTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      setIsErrorHidden(false);
      setTimeout(() => setIsErrorHidden(true), 3000);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      const createdTodo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(prev => [...prev, createdTodo]);
      setNewTodoTitle('');
    } catch {
      setErrorMessage('Unable to add a todo');
      setIsErrorHidden(false);
      setTimeout(() => setIsErrorHidden(true), 3000);
      setNewTodoTitle(trimmedTitle);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeleteId(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));

      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch {
      setErrorMessage('Unable to delete a todo');
      setIsErrorHidden(false);
      setTimeout(() => setIsErrorHidden(true), 3000);
    } finally {
      setDeleteId(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setDeleteId(completedTodos.map(todo => todo.id));

    try {
      await Promise.all(completedTodos.map(todo => handleDeleteTodo(todo.id)));
    } catch {
      // Errors are handled in handleDeleteTodo
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodosCount={activeTodosCount}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          onAddTodo={handleAddTodo}
          isInputDisabled={tempTodo !== null}
          inputRef={inputRef}
        />

        {isLoading && (
          <div className="todoapp__loading">
            <div className="loader" />
          </div>
        )}

        {!isLoading && todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              deleteId={deleteId}
              onDelete={handleDeleteTodo}
            />

            {todos.length > 0 && (
              <Footer
                filter={filter}
                onFilterChange={handleFilterChange}
                activeCount={activeTodosCount}
                completedCount={completedTodosCount}
                onClearCompleted={handleClearCompleted}
              />
            )}
          </>
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        isHidden={isErrorHidden}
        onClose={closeError}
      />
    </div>
  );
};
