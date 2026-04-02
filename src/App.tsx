/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  getTodos,
  removeTodoApi,
  updateTodoApi,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { Status } from './types/Status';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filter, setFilter] = useState<Status>(Status.All);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const todoFieldRef = useRef<HTMLInputElement>(null);

  const showError = (message: ErrorMessage) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (!tempTodo) {
      todoFieldRef.current?.focus();
    }
  }, [tempTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filter === Status.Active) {
      return !todo.completed;
    }

    if (filter === Status.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      showError(ErrorMessage.Title);

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedQuery,
      completed: false,
      userId: USER_ID,
    });

    setIsLoading(true);

    createTodo({ title: trimmedQuery, userId: USER_ID, completed: false })
      .then((todoFromServer: Todo) => {
        setTodos(prev => [...prev, todoFromServer]);
        setQuery('');
      })
      .catch(() => {
        showError(ErrorMessage.Add);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number, silent = false) => {
    if (!silent) {
      setErrorMessage(null);
    }

    setDeletingIds(prev => [...prev, todoId]);

    return removeTodoApi(todoId)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== todoId));
      })
      .catch(() => {
        if (!silent) {
          showError(ErrorMessage.Delete);
        }

        return Promise.reject();
      })
      .finally(() => {
        setDeletingIds(prev => prev.filter(id => id !== todoId));
        todoFieldRef.current?.focus();
      });
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const promises = completedTodos.map(todo => deleteTodo(todo.id, true));

    Promise.allSettled(promises).then(results => {
      const hasError = results.some(r => r.status === 'rejected');

      if (hasError) {
        showError(ErrorMessage.Delete);
      }
    });
  };

  const toggleTodo = (todo: Todo) => {
    setDeletingIds(prev => [...prev, todo.id]);

    return updateTodoApi(todo.id, { completed: !todo.completed })
      .then(updateTodo => {
        setTodos(prev => prev.map(t => (t.id === todo.id ? updateTodo : t)));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => {
        setDeletingIds(prev => prev.filter(id => id !== todo.id));
      });
  };

  const toggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = areAllCompleted
      ? todos
      : todos.filter(todo => !todo.completed);

    const promises = todosToUpdate.map(todo => toggleTodo(todo));

    Promise.all(promises).catch(() => {
      setErrorMessage(ErrorMessage.Update);
    });
  };

  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTitle(todo.title);
  };

  const submitRename = () => {
    if (!editingTodo) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      deleteTodo(editingTodo.id)
        .then(() => {
          setEditingTodo(null);
        })
        .catch(() => {});

      return;
    }

    if (trimmedTitle === editingTodo.title) {
      setEditingTodo(null);

      return;
    }

    setDeletingIds(prev => [...prev, editingTodo.id]);

    updateTodoApi(editingTodo.id, { title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(todo => (todo.id === editingTodo.id ? updatedTodo : todo)),
        );
        setEditingTodo(null);
      })
      .catch(() => {
        showError(ErrorMessage.Update);
      })
      .finally(() => {
        setDeletingIds(prev => prev.filter(id => id !== editingTodo.id));
      });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditingTodo(null);
      setNewTitle('');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          query={query}
          setQuery={setQuery}
          handleSubmit={handleSubmit}
          toggleAll={toggleAll}
          isLoading={isLoading}
          tempTodo={tempTodo}
          todoFieldRef={todoFieldRef}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            visibleTodos={visibleTodos}
            tempTodo={tempTodo}
            deletingIds={deletingIds}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editingTodo={editingTodo}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            handleKeyDown={handleKeyDown}
            handleEditClick={handleEditClick}
            submitRename={submitRename}
          />
        )}

        {/* Hide the footer if there are no todos */}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
// fix
