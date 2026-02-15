/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UserWarning } from './UserWarning';

import {
  USER_ID,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType, ErrorMessages } from './types/enums';
import { Header } from './component/Header';
import { TodoList } from './component/TodoList';
import { Footer } from './component/Footer';
import { ErrorNotification } from './component/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMessages | null>(null);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [title, setTitle] = useState('');
  const [tempTodos, setTempTodos] = useState<number[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const todoInputRef = useRef<HTMLInputElement>(null);

  const showError = (msg: ErrorMessages) => {
    setError(msg);
    setTimeout(() => setError(null), 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessages.Load));
  }, []);

  useEffect(() => {
    if (!tempTodo) {
      todoInputRef.current?.focus();
    }
  }, [tempTodo]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const toggleAll = () => {
    const activeTodos = todos.filter(todo => !todo.completed);
    const shouldBeCompleted = activeTodos.length > 0;
    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldBeCompleted,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    setTempTodos(prev => [...prev, ...todosToUpdate.map(t => t.id)]);

    const promises = todosToUpdate.map(todo =>
      updateTodo({ ...todo, completed: shouldBeCompleted }),
    );

    Promise.all(promises)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.completed !== shouldBeCompleted
              ? { ...todo, completed: shouldBeCompleted }
              : todo,
          ),
        );
      })
      .catch(() => showError(ErrorMessages.Update))
      .finally(() => {
        setTempTodos(prev =>
          prev.filter(id => !todosToUpdate.map(t => t.id).includes(id)),
        );
      });
  };

  const clearCompleted = () => {
    const idsToDelete = todos.filter(t => t.completed).map(t => t.id);

    if (idsToDelete.length === 0) {
      return;
    }

    setTempTodos(prev => [...prev, ...idsToDelete]);

    const promises = idsToDelete.map(id => {
      return deleteTodo(id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
        })
        .catch(() => {
          showError(ErrorMessages.Delete);
        });
    });

    Promise.all(promises).finally(() => {
      setTempTodos(prev => prev.filter(id => !idsToDelete.includes(id)));
      todoInputRef.current?.focus();
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      showError(ErrorMessages.EmptyTitle);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);

    createTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => {
        showError(ErrorMessages.Add);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleUpdate = (todo: Todo) => {
    setTempTodos(prev => [...prev, todo.id]);
    updateTodo({ ...todo, completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
        );
      })
      .catch(() => showError(ErrorMessages.Update))
      .finally(() => setTempTodos(prev => prev.filter(id => id !== todo.id)));
  };

  const handleDelete = (todoId: number) => {
    setTempTodos(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        todoInputRef.current?.focus();
      })
      .catch(() => {
        showError(ErrorMessages.Delete);
      })
      .finally(() => {
        setTempTodos(prev => prev.filter(id => id !== todoId));
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
          todos={todos}
          title={title}
          setTitle={setTitle}
          loading={!!tempTodo}
          onAdd={handleSubmit}
          onToggleAll={toggleAll}
          inputRef={todoInputRef}
        />

        <TodoList
          todos={visibleTodos}
          tempTodos={tempTodos}
          tempTodo={tempTodo}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />

        <Footer
          todos={todos}
          filter={filter}
          setFilter={setFilter}
          onClearCompleted={clearCompleted}
        />
      </div>

      <ErrorNotification error={error} onClose={() => setError(null)} />
    </div>
  );
};
