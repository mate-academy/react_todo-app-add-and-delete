/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  postTodos,
  patchTodo,
  deleteTodo,
} from './api/todos';
import Notifications from './components/Notifications';
import { Todo } from './types/Todo';
import { Filter } from './components/Filter';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { TodoButtons } from './components/TodoButtons';
import { FilterStatus } from './types/FilterStatus';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>(
    FilterStatus.All,
  );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const focusedInput = useRef<HTMLInputElement>(null);

  const allFilters = useMemo(() => {
    return {
      [FilterStatus.All]: () => true,
      [FilterStatus.Active]: (td: Todo) => !td.completed,
      [FilterStatus.Completed]: (td: Todo) => td.completed,
    };
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setErrorMessage('');
    focusedInput.current?.focus();

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const filteredTodos = todos.filter(allFilters[currentFilter]);
  const incompletedTodos = todos.filter(td => !td.completed);

  const handleAddTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);
      focusedInput.current?.focus();

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setIsAdding(true);
    setTempTodo({
      id: 0,
      ...newTodo,
    });

    try {
      const todo = await postTodos(newTodo);

      setTodos(prev => [...prev, todo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      focusedInput.current?.focus();
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleToggleTodo = (id: number) => {
    const todo = todos.find(td => td.id === id);

    if (!todo) {
      return;
    }

    setUpdatingTodoIds(prev => [...prev, id]);
    patchTodo(id, { completed: !todo.completed })
      .then(updated =>
        setTodos(prev =>
          prev.map(td => (td.id === id ? { ...td, ...updated } : td)),
        ),
      )
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setUpdatingTodoIds(prev => prev.filter(tid => tid !== id));
      });
  };

  const handleDeleteTodo = (id: number) => {
    setDeletingTodoIds(prev => [...prev, id]);
    deleteTodo(id)
      .then(() => setTodos(prev => prev.filter(td => td.id !== id)))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  const handleClearCompleted = () => {
    const completed = todos.filter(td => td.completed);

    if (!completed.length) {
      return;
    }

    setDeletingTodoIds(prev => [...prev, ...completed.map(td => td.id)]);
    completed.forEach(td => handleDeleteTodo(td.id));
  };

  const handleCloseError = () => setErrorMessage('');

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && <TodoButtons todos={todos} />}
          <NewTodo
            focusedInput={focusedInput}
            onAddTodo={handleAddTodo}
            disabled={isAdding}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deletingTodoIds={deletingTodoIds}
          updatingTodoIds={updatingTodoIds}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {incompletedTodos.length} items left
            </span>

            <Filter
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.length - incompletedTodos.length === 0}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <Notifications message={errorMessage} onClose={handleCloseError} />
    </div>
  );
};
