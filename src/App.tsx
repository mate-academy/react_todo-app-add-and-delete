/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { Todo } from './types/Todo';
import { getTodos, postTodo, deleteTodo, updateTodo } from './api/todos';
import { USER_ID } from './api/todos';
import { UserWarning } from './UserWarning';

import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';

import Filter from './types/FilterTypes';
import { TempTodo } from './types/TempTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [addTodo, setAddTodo] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<Filter>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [activeTodoId, setActiveTodoId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [todosCount, setTodosCount] = useState<number>(0);
  const [shouldFocus, setShouldFocus] = useState<boolean>(false);
  const [allCompleted, setAllCompleted] = useState<boolean>(false);
  const [originalTitle, setOriginalTitle] = useState<string>('');
  const [activeTodoIds, setActiveTodoIds] = useState<number[]>([]);
  const [enumErrorMessage, setEnumErrorMessage] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    setErrorMessage(message);
    setErrorVisible(true);
  };

  async function getTodosList() {
    try {
      const response = await getTodos();

      setTodos(response);
    } catch {
      setEnumErrorMessage(enumErrorMessage + 1);
      showError('Unable to load todos');
    }
  }

  useEffect(() => {
    getTodosList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setTodosCount(todos.filter(todo => !todo.completed).length);
    }, 100);
  }, [todos]);

  useEffect(() => {
    setTimeout(() => {
      if (shouldFocus && !isSubmitting) {
        inputRef.current?.focus();
        setShouldFocus(false);
      }
    }, 100);
  }, [shouldFocus, isSubmitting]);

  useEffect(() => {
    if (todos.length > 0) {
      setAllCompleted(todos.every(todo => todo.completed));
    } else {
      setAllCompleted(false);
    }
  }, [todos]);

  const handleAddTodo = () => {
    if (!addTodo.trim()) {
      showError('Title should not be empty');

      return;
    }

    const tempId = Math.max(...todos.map(t => t.id), 0) + 1;

    const tempTodo: TempTodo = {
      id: 0 || tempId,
      userId: USER_ID,
      title: addTodo,
      completed: false,
      isTemp: true,
    };

    setTodos(prev => [...prev, tempTodo]);

    setActiveTodoId(tempId);
    setIsSubmitting(true);

    postTodo({
      id: tempId,
      userId: USER_ID,
      title: tempTodo.title,
      completed: false,
    })
      .then(serverTodo => {
        setTodos(prev =>
          prev.map(t => (t.id === tempId ? { ...serverTodo } : t)),
        );
        setAddTodo('');
      })
      .catch(() => {
        setTodos(prev => prev.filter(t => t.id !== tempId));
        setEnumErrorMessage(enumErrorMessage + 1);

        showError('Unable to add a todo');
      })
      .finally(() => {
        setActiveTodoId(null);
        setIsSubmitting(false);
        setShouldFocus(true);
      });
  };

  function handleDeleteTodo(todoId: number) {
    if (!todoId) {
      showError('Unable to delete a todo');

      return;
    }

    setActiveTodoId(todoId);
    setIsSubmitting(true);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== todoId));

        setEditingId(null);
      })
      .catch(() => {
        showError('Unable to delete a todo');
        setEnumErrorMessage(enumErrorMessage + 1);
      })
      .finally(() => {
        setActiveTodoId(null);
        setIsSubmitting(false);
        setShouldFocus(true);
      });
  }

  function handleUpdateTodoText(todoId: number, newTitle: string) {
    const trimmedTitle = newTitle.trim();

    setActiveTodoId(todoId);
    setIsSubmitting(true);

    updateTodo(todoId, {
      id: todoId,
      userId: USER_ID,
      title: trimmedTitle,
      completed: todos.find(todo => todo.id === todoId)?.completed || false,
    })
      .then(() => {
        setTodos(prev =>
          prev.map(t => (t.id === todoId ? { ...t, title: trimmedTitle } : t)),
        );
        setEditingId(null);
      })
      .catch(() => {
        showError('Unable to update a todo');
        setEditingId(editingId);
        setEnumErrorMessage(enumErrorMessage + 1);
      })
      .finally(() => {
        setActiveTodoId(null);
        setIsSubmitting(false);
      });
  }

  function handleUpdateTodoStatus(
    todoId: number,
    title: string,
    newStatus: boolean,
  ) {
    if (!todoId) {
      showError('Unable to update a todo');

      return;
    }

    setActiveTodoId(todoId);
    setIsSubmitting(true);

    updateTodo(todoId, {
      id: todoId,
      userId: USER_ID,
      title: title,
      completed: newStatus,
    })
      .then(() => {
        setTodos(prev =>
          prev.map(t => (t.id === todoId ? { ...t, completed: newStatus } : t)),
        );
      })
      .catch(() => {
        showError('Unable to update a todo');
        setEnumErrorMessage(enumErrorMessage + 1);
      })
      .finally(() => {
        setActiveTodoId(null);
        setIsSubmitting(false);
        setEditingId(null);
      });
  }

  const filteredTodos = todos.filter(todo => {
    switch (filterType) {
      case 'all':
        return true;
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    todoId: number,
  ) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setEditingId(null);
      setTodos(prev =>
        prev.map(t => (t.id === todoId ? { ...t, title: originalTitle } : t)),
      );
    }
  };

  async function handleClearCompleted() {
    setIsSubmitting(true);

    const completedTodos = todos.filter(t => t.completed);

    if (completedTodos.length === 0) {
      setIsSubmitting(false);

      return;
    }

    const idsToDelete = completedTodos.map(t => t.id);

    setActiveTodoIds(idsToDelete);
    try {
      const results = await Promise.all(
        idsToDelete.map(async id => {
          try {
            await deleteTodo(id);

            return id;
          } catch {
            showError('Unable to delete a todo');
            setEnumErrorMessage(enumErrorMessage + 1);

            return null;
          }
        }),
      );

      setTodos(prev => prev.filter(t => !results.includes(t.id)));
    } finally {
      setActiveTodoIds([]);
      setIsSubmitting(false);
      setShouldFocus(true);
    }
  }

  async function handleToggleAll() {
    const areAllCompleted = todos.every(t => t.completed);

    const targetCompleted = !areAllCompleted;

    setAllCompleted(targetCompleted);
    setIsSubmitting(true);

    const togglePromises = todos.map(todo =>
      updateTodo(todo.id, {
        ...todo,
        completed: targetCompleted,
      })
        .then(() => {
          setTodos(prev =>
            prev.map(t =>
              t.id === todo.id ? { ...t, completed: targetCompleted } : t,
            ),
          );
        })
        .catch(() => {
          showError(`Unable to toggle todo ${todo.id}`);
          setEnumErrorMessage(enumErrorMessage + 1);
        }),
    );

    setActiveTodoId(null);

    await Promise.all(togglePromises);

    setIsSubmitting(false);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <TodoHeader
        haveTodos={todos.length > 0}
        addTodo={addTodo}
        setAddTodo={setAddTodo}
        handleAddTodo={handleAddTodo}
        allCompleted={allCompleted}
        inputRef={inputRef}
        isSubmiting={isSubmitting}
        handleToggleAll={handleToggleAll}
      />
      <TodoList
        todos={filteredTodos}
        editingId={editingId}
        setEditingId={setEditingId}
        handleDeleteTodo={handleDeleteTodo}
        handleUpdateTodoStatus={handleUpdateTodoStatus}
        handleUpdateTodoText={handleUpdateTodoText}
        handleKeyDown={handleKeyDown}
        setTodos={setTodos}
        activeTodoId={activeTodoId}
        setOriginalTitle={setOriginalTitle}
        activeTodoIds={activeTodoIds}
      />
      <TodoFooter
        todos={todos}
        todosLength={todos.length}
        filterType={filterType}
        setFilterType={setFilterType}
        remainingTodos={todosCount}
        handleClearCompleted={handleClearCompleted}
      />
      <ErrorNotification
        message={errorMessage}
        visible={errorVisible}
        onClose={() => setErrorVisible(false)}
      />
    </div>
  );
};
