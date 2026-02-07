/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

// #region IMPORTS
// -------------------------------------------------------------------------
import React, { useEffect, useState } from 'react';

import './App.scss';
import { Todo } from './types/Todo';
import { FilterLink, FilterType } from './types/FilterType';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';

import { UserWarning } from './components/UserWarning';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
// -------------------------------------------------------------------------
// #endregion IMPORTS

export const App: React.FC = () => {
  // #region STATE
  // -------------------------------------------------------------------------
  // Data State
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  // UI & Status State
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Filter State
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.All);

  // Form & Editing State
  const [title, setTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editQuery, setEditQuery] = useState('');
  // -------------------------------------------------------------------------
  // #endregion STATE

  // #region DERIVED VARIABLES
  // -------------------------------------------------------------------------
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const visibleTodos = todos.filter(todo => {
    switch (filterBy) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      case FilterType.All:
      default:
        return true;
    }
  });

  const filterLinks = Object.values(FilterType).map(type => ({
    name: type[0].toUpperCase() + type.slice(1),
    value: type,
    href: `#/${type === FilterType.All ? '' : type.toLowerCase()}`,
  })) as FilterLink[];
  // -------------------------------------------------------------------------
  // #endregion DERIVED VARIABLES

  // #region LIFECYCLE & EFFECTS
  // -------------------------------------------------------------------------
  function loadTodos() {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }

  // Initial Load
  useEffect(() => {
    loadTodos();
  }, []);

  // Error Message Timer
  useEffect(() => {
    let timerId = 0;

    if (errorMessage) {
      timerId = window.setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      window.clearTimeout(timerId);
    };
  }, [errorMessage]);

  // -------------------------------------------------------------------------
  // #endregion LIFECYCLE & EFFECTS

  // #region HANDLERS
  // -------------------------------------------------------------------------

  // --- General Handlers ---
  const handleClearError = () => {
    setErrorMessage('');
  };

  // --- Create Handlers ---
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      title: title,
      userId: USER_ID,
      completed: false,
    }); // fake Todo

    createTodo(title.trim())
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  // --- Delete Handlers ---
  const handleDeleteTodo = (todoId: number) => {
    setProcessingIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingIds(currentIds => currentIds.filter(id => id !== todoId));
      });
  };

  const handleClearCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const idsToDelete = completedTodos.map(todo => todo.id);

    setProcessingIds(currentIds => [...currentIds, ...idsToDelete]);

    idsToDelete.map(async id => {
      try {
        await deleteTodo(id);
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      } catch {
        setErrorMessage('Unable to delete a todo');
      } finally {
        setProcessingIds(currentIds => currentIds.filter(pId => pId !== id));
      }
    });
  };

  // --- Update & Toggle Handlers ---
  const handleUpdateTodo = (todoId: number, data: Partial<Todo>) => {
    setProcessingIds(currentIds => [...currentIds, todoId]);

    updateTodo(todoId, data)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setProcessingIds(currentIds => currentIds.filter(id => id !== todoId));
      });
  };

  const handleToggleAll = () => {
    const shouldBeCompleted = activeTodosCount > 0;
    const todosToUpdate = todos.filter(
      todo => shouldBeCompleted !== todo.completed,
    );
    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    if (idsToUpdate.length === 0) {
      return;
    }

    setProcessingIds(currentIds => [...currentIds, ...idsToUpdate]);

    idsToUpdate.forEach(id => {
      updateTodo(id, { completed: shouldBeCompleted })
        .then(updatedTodo => {
          setTodos(currentTodos =>
            currentTodos.map(todo => (todo.id === id ? updatedTodo : todo)),
          );
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
        })
        .finally(() => {
          setProcessingIds(currentIds => currentIds.filter(pId => pId !== id));
        });
    });
  };

  // --- Edit Handlers ---
  const handleEdit = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditQuery(todo.title);
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditQuery('');
  };

  const handleSaveEdit = (todoId: number) => {
    if (editingTodoId !== todoId) {
      return;
    }

    const trimmedTitle = editQuery.trim();

    if (!trimmedTitle) {
      handleDeleteTodo(todoId);
      setEditingTodoId(null);

      return;
    }

    const currentTodo = todos.find(t => t.id === todoId);

    if (currentTodo && currentTodo.title === trimmedTitle) {
      handleCancelEdit();

      return;
    }

    handleUpdateTodo(todoId, { title: trimmedTitle });
    setEditingTodoId(null);
  };

  const handleEditSubmit = (event: React.FormEvent, todoId: number) => {
    event.preventDefault();
    handleSaveEdit(todoId);
  };

  // -------------------------------------------------------------------------
  // #endregion HANDLERS

  // #region RENDER
  // -------------------------------------------------------------------------
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          activeTodos={activeTodosCount}
          todosLength={todos.length}
          tempTodo={tempTodo}
          title={title}
          setTitle={setTitle}
          onToggleAll={handleToggleAll}
          onSubmit={handleSubmit}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          processingIds={processingIds}
          editingTodoId={editingTodoId}
          tempTitle={editQuery}
          setTempTitle={setEditQuery}
          onDelete={handleDeleteTodo}
          onUpdate={handleUpdateTodo}
          onEdit={handleEdit}
          onCancel={handleCancelEdit}
          onSave={handleSaveEdit}
          onSubmit={handleEditSubmit}
        />

        {todos.length > 0 && (
          <TodoFooter
            activeTodos={activeTodosCount}
            completedTodos={completedTodosCount}
            filters={filterLinks}
            selectedFilter={filterBy}
            onFilter={setFilterBy}
            onClear={handleClearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClear={handleClearError}
      />
    </div>
  );
  // -------------------------------------------------------------------------
  // #endregion RENDER
};
