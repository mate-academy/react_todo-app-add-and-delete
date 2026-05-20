/* eslint-disable @typescript-eslint/indent */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import { Todo } from './types/Todo';
import cn from 'classnames';
import { Header } from './components/Header/Header';
import { ErrorMessage } from './types/Error';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { FilterType } from './types/Filter';

export const App: React.FC = () => {
  // #region states
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [todoLoadingIds, setTodoLoadingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // #endregion

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterType.Active) {
      return !todo.completed;
    }

    if (filter === FilterType.Completed) {
      return todo.completed;
    }

    return true;
  });

  // #region useRef and useEffect
  useEffect(() => {
    postService
      .getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => setErrorMessage(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);
  // #endregion

  // #region create, delete, update
  const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
    setTempTodo({
      id: 0,
      userId: userId,
      title: title,
      completed: completed,
    });

    setIsSubmitting(true);

    postService
      .addTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodo];
        });
        setQuery('');
        setErrorMessage('');
      })
      .catch(() => setErrorMessage(ErrorMessage.Add))
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const deleteTodo = (postId: number) => {
    setTodoLoadingIds(currentIds => [...currentIds, postId]);

    postService
      .deleteTodo(postId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(post => post.id !== postId),
        );
        setErrorMessage('');
      })
      .catch(() => {
        setTodos(todos);
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setTodoLoadingIds(currentIds => currentIds.filter(id => id !== postId));
      });
  };

  const updateTodoCompleted = (
    postId: number,
    data: Pick<Todo, 'completed'>,
  ) => {
    postService
      .updateTodoCompleted(postId, data)
      .then(updatedTodo => {
        setTodos(current =>
          current.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
        setErrorMessage('');
      })
      .catch(() => setErrorMessage(ErrorMessage.Update));
  };

  const updateAllTodoCompleted = () => {
    const hasActive = todos.some(todo => !todo.completed);

    todos.forEach(todo => {
      if (hasActive ? !todo.completed : todo.completed) {
        updateTodoCompleted(todo.id, { completed: todo.completed });
      }
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    setErrorMessage('');

    createTodo({
      userId: postService.USER_ID,
      title: trimmedQuery,
      completed: false,
    });
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo => {
      setTodoLoadingIds(prev => [...prev, todo.id]);

      return postService
        .deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
        })
        .catch(error => {
          setErrorMessage(ErrorMessage.Delete);
          throw error;
        })
        .finally(() => {
          setTodoLoadingIds(prev => prev.filter(id => id !== todo.id));
        });
    });

    Promise.all(deletePromises);
  };
  // #endregion

  if (!postService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          query={query}
          isSubmitting={isSubmitting}
          activeTodosCount={activeTodosCount}
          allTodoCompleted={updateAllTodoCompleted}
          onSubmit={handleSubmit}
          setQuery={value => setQuery(value)}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          todoLoadingIds={todoLoadingIds}
          deleteTodo={id => deleteTodo(id)}
          todoComleted={(id, { completed }) => {
            updateTodoCompleted(id, { completed });
          }}
        />

        {todos.length > 0 && (
          <Footer
            filter={filter}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            setFilter={params => setFilter(params)}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
