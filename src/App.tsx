import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { HeaderForm } from './components/HeaderForm/HeaderForm';
import { Footer } from './components/Footer/Footer';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [newTodoTitle, setTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredBy, setFilteredBy] = useState(Filter.All);
  const [todosCounter, setTodosCounter] = useState(0);
  const shouldRenderFooter = todos && todos.length > 0;
  const completedTodos = todos.filter(todo => todo.completed);
  const completedTodosIds = completedTodos.map(todo => todo.id);
  const isAllTasksCompleted = completedTodos.length === todos.length;

  const loadTodos = useCallback(() => {
    setLoading(true);
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filteredBy) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filteredBy]);

  const addTodo = (newTodo: Todo) => {
    const { userId, title, completed } = newTodo;

    setLoading(true);
    if (newTodo.title.trim() === '') {
      setErrorMessage('Title should not be empty');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      setLoading(false);

      return;
    }

    setTempTodo({
      id: 0,
      title: title.trim(),
      completed: false,
      userId: todoService.USER_ID,
    });

    todoService
      .addTodo({ userId, title, completed })
      .then(todoFromResponse => {
        setTodos(currentTodos => [...currentTodos, todoFromResponse]);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setShowError(true);
      })
      .finally(() => {
        setTimeout(() => setShowError(false), 3000);
        setTempTodo(null);
        setLoading(false);
      });
  };

  const deleteTodo = (todoId: number) => {
    setLoading(true);
    setLoadingTodoIds(prev => [...prev, todoId]);
    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(currentTodo => currentTodo.id !== todoId),
        );
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setShowError(true);
      })
      .finally(() => {
        setTimeout(() => setShowError(false), 3000);
        setLoading(false);
      });
  };

  const clearCompleted = () => {
    setLoading(true);

    if (completedTodosIds.length === 0) {
      return;
    }

    setLoadingTodoIds(prev => [...prev, ...completedTodosIds]);

    Promise.allSettled(
      completedTodosIds.map(todoIdCompleted =>
        todoService.deleteTodo(todoIdCompleted).then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(
              currentTodo => currentTodo.id !== todoIdCompleted,
            ),
          );
          setLoadingTodoIds(prev => prev.filter(id => id !== todoIdCompleted));
        }),
      ),
    )
      .then(results => {
        const hasError = results.some(r => r.status === 'rejected');

        if (hasError) {
          setErrorMessage('Unable to delete a todo');
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    if (todos) {
      const notCompleted = todos.filter(todo => !todo.completed).length;

      setTodosCounter(notCompleted);
    }
  }, [todos, todosCounter]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderForm
          newTodoTitle={newTodoTitle}
          setTodoTitle={setTodoTitle}
          onSubmit={addTodo}
          loading={loading}
          isAllTasksCompleted={isAllTasksCompleted}
        />

        {todos && (
          <TodoList
            filteredTodos={filteredTodos}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            deleteTodo={deleteTodo}
          />
        )}

        {shouldRenderFooter && (
          <Footer
            filteredBy={filteredBy}
            setFilteredBy={setFilteredBy}
            todosCounter={todosCounter}
            clearCompleted={clearCompleted}
            completedTodos={completedTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !showError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setShowError(false)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
