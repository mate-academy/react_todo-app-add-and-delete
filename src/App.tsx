/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  USER_ID,
  createTodo,
  changeTodoStatus,
  deleteTodo,
  editTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FilterType } from './types/Filter';
import { TodoHandlers } from './types/TodoHandlers';
import { TodoHeader, TodoHeaderHandle } from './components/TodoHeader';
import { ErrorMsg } from './components/ErrorMsg';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const todoHeaderRef = useRef<TodoHeaderHandle>(null);

  const filterTodos = (todosList: Todo[], filterType: FilterType) => {
    switch (filterType) {
      case 'active':
        return todosList.filter(todo => !todo.completed);
      case 'completed':
        return todosList.filter(todo => todo.completed);
      case 'all':
      default:
        return todosList;
    }
  };

  const handleFocusInput = () => {
    todoHeaderRef.current?.focus();
  };

  const handlers = useMemo<TodoHandlers>(
    () => ({
      onUpdate: (id: number, newCompleted: boolean) => {
        return changeTodoStatus(id, newCompleted)
          .then(updatedTodo => {
            setTodos(prevTodos =>
              prevTodos.map(todo => (todo.id === id ? updatedTodo : todo)),
            );
          })
          .catch(() => {
            setError('Unable to update a todo');
            throw new Error('Unable to update a todo');
          });
      },
      onDelete: (id: number) => {
        return deleteTodo(id)
          .then(() => {
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
          })
          .catch(() => {
            setError('Unable to delete a todo');
            throw new Error('Unable to delete a todo');
          });
      },
      onEdit: (id: number, title: string) => {
        return editTodo(id, title)
          .then(updatedTodo => {
            setTodos(prevTodos =>
              prevTodos.map(todo =>
                todo.id === id ? { ...updatedTodo, title } : todo,
              ),
            );
          })
          .catch(() => {
            setError('Unable to update a todo');
            throw new Error('Unable to update a todo');
          });
      },
    }),
    [],
  );

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setError('Title should not be empty');

      return;
    }

    const tempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: inputValue.trim(),
      completed: false,
    };

    setIsLoading(true);
    setTodos([...todos, tempTodo]);

    createTodo(inputValue.trim())
      .then(newTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo => (todo.id === 0 ? newTodo : todo)),
        );
        setInputValue('');
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== 0));
      })
      .finally(() => setIsLoading(false));
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(t => t.completed);
    const newCompleted = !allCompleted;

    Promise.all(
      todos.map(todo =>
        todo.completed === newCompleted
          ? Promise.resolve()
          : handlers.onUpdate(todo.id, newCompleted),
      ),
    ).catch(() => setError('Unable to toggle todos'));
  };

  const handleDeleteCompleted = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.all(completedIds.map(id => handlers.onDelete(id)))
      .then(() => {
        handleFocusInput();
      })
      .catch(() => setError('Unable to delete a todo'));
  };

  // #region Effects
  useEffect(() => {
    getTodos()
      .then(fetchedTodos => setTodos(fetchedTodos))
      .catch(() => setError('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [error]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(2) || 'all';

      setFilter(hash as FilterType);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  // #endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          ref={todoHeaderRef}
          todos={todos}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onAddTodo={handleAddTodo}
          onToggleAll={handleToggleAll}
          isLoading={isLoading}
        />
        {todos.length > 0 && (
          <>
            <TodoList
              todos={filterTodos(todos, filter)}
              allTodos={todos}
              filter={filter}
              handlers={handlers}
              onDeleteCompleted={handleDeleteCompleted}
              onFocusInput={handleFocusInput}
            />
          </>
        )}
      </div>
      <ErrorMsg message={error} setError={setError} />
    </div>
  );
};
