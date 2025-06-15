import React, { useEffect, useRef, useState } from 'react';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoFilter } from './types/Filters';
import { ErrorMessage } from './types/ErrorMessage';
import { USER_ID } from './api/todos';
import { UserWarning } from './components/UserWarning/UserWarning';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/Error/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LoadTodos))
      .finally(() => setIsLoading(false));
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding && loadingIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [isAdding, loadingIds]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return Promise.resolve();
    }

    setIsAdding(true);

    const newTodo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    return addTodo(newTodo)
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.AddTodo);
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DeleteTodo);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const toggleTodoStatus = (todoId: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const idsToDelete = completedTodos.map(todo => todo.id);

    const results = await Promise.allSettled(
      idsToDelete.map(id => deleteTodo(id)),
    );

    const successIds: number[] = [];
    let isSomeFailed = false;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successIds.push(idsToDelete[index]);
      } else {
        isSomeFailed = true;
      }
    });

    if (isSomeFailed) {
      setErrorMessage(ErrorMessage.DeleteTodo);
    }

    setTodos(prev => prev.filter(todo => !successIds.includes(todo.id)));

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const toggleAllTodos = () => {
    const shouldBeCompleted = !todos.every(todo => todo.completed);

    setTodos(prev =>
      prev.map(todo => ({
        ...todo,
        completed: shouldBeCompleted,
      })),
    );
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case TodoFilter.Active:
        return !todo.completed;
      case TodoFilter.Completed:
        return todo.completed;
      case TodoFilter.All:
      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          onTitleChange={setNewTodoTitle}
          onAddTodo={handleAddTodo}
          inputRef={inputRef}
          onToggleAll={toggleAllTodos}
          allCompleted={todos.length > 0 && todos.every(todo => todo.completed)}
          isDisabled={isLoading}
          isAdding={isAdding}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              onToggle={toggleTodoStatus}
              onDelete={handleDeleteTodo}
              tempTodo={tempTodo}
              loadingIds={loadingIds}
              isAdding={isAdding}
            />

            <Footer
              activeTodosCount={activeTodosCount}
              hasCompletedTodos={hasCompletedTodos}
              clearCompleted={clearCompleted}
              filter={filter}
              setFilter={setFilter}
            />
          </>
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />

      {isLoading && <div className="loader" data-cy="LoadingIndicator" />}
    </div>
  );
};
