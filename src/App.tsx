import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Status } from './types/Status';
export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [newTodoTitle, setTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredBy, setFilteredBy] = useState(Status.All);
  const [editingTodosIds, setEditingTodosIds] = useState<number[]>([]);

  const shouldRenderFooter = todos && todos.length > 0;
  const completedTodos = todos.filter(todo => todo.completed);
  const completedTodosIds = completedTodos.map(todo => todo.id);
  const isAllTasksCompleted = completedTodos.length === todos.length;
  const toggleAllButtonVisible = !loading && todos.length > 0;

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
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filteredBy]);

  const todosCounter = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

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
        setTimeout(() => {
          setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
        }, 3000);
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

  const updateTodo = (todoToUpdate: Todo) => {
    setLoading(true);
    setLoadingTodoIds(prev => [...prev, todoToUpdate.id]);
    todoService
      .updateTodo(todoToUpdate)
      .then(updatedTodo => {
        setTodos(currentTodos => {
          setLoadingTodoIds(prev => prev.filter(id => id !== todoToUpdate.id));

          return currentTodos.map(todo =>
            todo.id === todoToUpdate.id ? updatedTodo : todo,
          );
        });
        setEditingTodosIds(prevIds =>
          prevIds.filter(prevId => prevId !== todoToUpdate.id),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setShowError(true);
        setTimeout(() => {
          setLoadingTodoIds(prev => prev.filter(id => id !== todoToUpdate.id));
        }, 3000);
      })
      .finally(() => {
        setTimeout(() => setShowError(false), 3000);
        setLoading(false);
      });
  };

  const toggleAll = () => {
    setLoading(true);

    Promise.allSettled(
      todos.map(todo => {
        if (isAllTasksCompleted) {
          setLoadingTodoIds(prev => [...prev, todo.id]);

          todoService.updateTodo(todo).then(() => {
            setTodos(currentTodos => {
              return currentTodos.map(currentTodo => {
                return {
                  ...currentTodo,
                  completed: false,
                };
              });
            });
            setLoadingTodoIds(prev => prev.filter(id => id !== todo.id));
          });
        }

        if (!todo.completed) {
          setLoadingTodoIds(prev => [...prev, todo.id]);
          todoService.updateTodo(todo).then(() => {
            setTodos(currentTodos => {
              return currentTodos.map(currentTodo => {
                return {
                  ...currentTodo,
                  completed: true,
                };
              });
            });
            setLoadingTodoIds(prev => prev.filter(id => id !== todo.id));
          });
        }
      }),
    )
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setShowError(true);
        setLoadingTodoIds([]);
      })
      .finally(() => {
        setTimeout(() => setShowError(false), 3000);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setTodoTitle={setTodoTitle}
          onSubmit={addTodo}
          loading={loading}
          isAllTasksCompleted={isAllTasksCompleted}
          toggleAll={toggleAll}
          toggleAllButtonVisible={toggleAllButtonVisible}
        />

        {todos && (
          <TodoList
            filteredTodos={filteredTodos}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
            editingTodosIds={editingTodosIds}
            setEditingTodosIds={setEditingTodosIds}
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
