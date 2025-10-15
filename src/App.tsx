import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const countActive = todos.filter(todo => todo.completed === false).length;
  const completedTodos = todos.filter(todo => todo.completed === true);
  const newTodoInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    newTodoInput.current?.focus();
  }, [isAdding, loadingIds]);

  useEffect(() => {
    setTimeout(() => {
      if (showError) {
        setShowError(false);
      }
    }, 3000);
  }, [showError]);

  const loadTodos = () => {
    setErrorMessage('');
    getTodos()
      .then(data => {
        setTodos(data);
        setVisibleTodos(data);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setShowError(true);
      });
  };

  useEffect(loadTodos, []);

  const filterTodos = (param: Filter) => {
    switch (param) {
      case 'all':
        setVisibleTodos(todos);
        setFilter('all');
        break;
      case 'active':
        setVisibleTodos(todos.filter(todo => todo.completed === false));
        setFilter('active');
        break;
      case 'completed':
        setVisibleTodos(todos.filter(todo => todo.completed === true));
        setFilter('completed');
        break;
    }
  };

  const removeTodo = (todoId: number) => {
    setErrorMessage('');
    setLoadingIds(current => [...current, todoId]);
    deleteTodo(todoId)
      .then(() => {
        const newTodos = todos.filter(todo => todo.id !== todoId);

        setTodos(newTodos);
        setVisibleTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setShowError(true);
      })
      .finally(() => {
        setLoadingIds([]);
      });
  };

  const clearCompleted = async () => {
    const promises: Promise<number>[] = [];

    completedTodos.forEach(todo => {
      promises.push(deleteTodo(todo.id));
      setLoadingIds(current => [...current, todo.id]);
    });

    const results = await Promise.allSettled(promises);

    const hasError = results.some(result => result.status === 'rejected');

    if (hasError) {
      setErrorMessage('Unable to delete a todo');
      setShowError(true);
    }

    const successfulIds = completedTodos
      .filter((_, i) => results[i].status === 'fulfilled')
      .map(todo => todo.id);

    setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));
    setVisibleTodos(prev =>
      prev.filter(todo => !successfulIds.includes(todo.id)),
    );
    setLoadingIds([]);
  };

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();

    setIsAdding(true);
    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      setShowError(true);
      setIsAdding(false);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTodo);

    addTodo(trimmedTitle)
      .then(savedTodo => {
        setTodos(current => [...current, savedTodo]);
        setVisibleTodos(current => [...current, savedTodo]);
        setTodoTitle('');
      })
      .catch(() => {
        setTempTodo(null);
        setErrorMessage('Unable to add a todo');
        setShowError(true);
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isToggleAllVisible={todos.length > 0}
          inputRef={newTodoInput}
          inputDisable={isAdding}
          todoTitle={todoTitle}
          handleInputChange={event => setTodoTitle(event.target.value)}
          handleSubmit={handleSubmit}
        />
        {visibleTodos.length > 0 && (
          <TodoList
            visibleTodos={visibleTodos}
            removeTodo={removeTodo}
            loadingIds={loadingIds}
          />
        )}

        {tempTodo && <TodoItem todo={tempTodo} />}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            countActive={countActive}
            filter={filter}
            filterTodos={filterTodos}
            clearCompleted={clearCompleted}
            isClearDisable={completedTodos.length === 0}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        showError={showError}
        setShowError={setShowError}
      />
    </div>
  );
};
