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

  const [todos, setTodos] = useState<Todo[]>([]); // eslint-disable-next-line react-hooks/rules-of-hooks
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

  const handleAddTodo = async (title: string): Promise<void> => {
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
      id: 1,
      ...newTodo,
    });

    try {
      const todo = await postTodos(newTodo);

      setTodos(prev => [...prev, todo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      focusedInput.current?.focus();
      setTimeout(() => setErrorMessage(''), 3000);
      throw error;
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
        setUpdatingTodoIds(prev => prev.filter(t => t !== id));
      });
  };

  const handleToggleAll = () => {
    const isAllCompleted = todos.every(td => td.completed);

    const todosToUpdate = isAllCompleted
      ? todos
      : todos.filter(td => !td.completed);

    todosToUpdate.forEach(todo => {
      handleToggleTodo(todo.id);
    });
  };

  const handleDeleteTodo = (id: number) => {
    setDeletingTodoIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(td => td.id !== id));

        focusedInput.current?.focus();
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  const handleClearCompleted = () => {
    const completed = todos.filter(td => td.completed);

    Promise.allSettled(completed.map(td => deleteTodo(td.id))).then(results => {
      const successfulIds = completed
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(td => td.id);

      setTodos(prev => prev.filter(td => !successfulIds.includes(td.id)));

      focusedInput.current?.focus();

      const hasError = results.some(result => result.status === 'rejected');

      if (hasError) {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    });
  };

  const handleRenameTodo = async (
    id: number,
    newTitle: string,
  ): Promise<void> => {
    setUpdatingTodoIds(prev => [...prev, id]);
    try {
      const updated = await patchTodo(id, { title: newTitle });

      setTodos(prev =>
        prev.map(td => (td.id === id ? { ...td, ...updated } : td)),
      );
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      setTimeout(() => setErrorMessage(''), 3000);
      throw error;
    } finally {
      setUpdatingTodoIds(prev => prev.filter(t => t !== id));
    }
  };

  const handleCloseError = () => setErrorMessage('');

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <TodoButtons todos={todos} onToggleAll={handleToggleAll} />
          )}
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
          onRename={handleRenameTodo}
        />{' '}
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
              Clear complited
            </button>
          </footer>
        )}
      </div>
      <Notifications message={errorMessage} onClose={handleCloseError} />
    </div>
  );
};
