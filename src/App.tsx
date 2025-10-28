import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { NewTodo } from './components/NewTodo/NewTodo';
import { ToggleAllButton } from './components/ToggleAllButton/ToggleAllButton';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { ErrorNotification } from './components/ErrorNotification';
import * as todoService from './api/todos';
import { FiltersEnum } from './types/enums/FiltersEnum';
// comment to restart pipeline

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FiltersEnum>(
    FiltersEnum.All,
  );
  const [todoTitle, setTodoTitle] = useState<Todo['title']>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deletingTodos, setDeletingTodos] = useState<Todo['id'][]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [needsRefocus, setNeedsRefocus] = useState(false);
  const focusedInput = useRef<HTMLInputElement>(null);
  const timeOutRef = useRef<NodeJS.Timeout>();

  const AllFilters: Record<FiltersEnum, (td: Todo) => boolean> = useMemo(() => {
    return {
      [FiltersEnum.All]: () => true,
      [FiltersEnum.Active]: td => !td.completed,
      [FiltersEnum.Completed]: td => td.completed,
    };
  }, []);

  const refreshTimer = () => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }

    timeOutRef.current = setTimeout(() => setErrorMessage(''), 3000);
  };

  const handleAddTodoRequest = (payload: Omit<Todo, 'id'>) => {
    todoService
      .addTodo(payload)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTodoTitle('');
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');

        refreshTimer();
        throw error;
      })
      .finally(() => {
        setIsLoading(false);
        setNeedsRefocus(true);
        setTempTodo(null);
      });
  };

  const handleDeleteTodoRequest = (todoId: Todo['id']) => {
    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        refreshTimer();
        throw error;
      })
      .finally(() => {
        setDeletingTodos(prev => prev.filter(id => id !== todoId));
        setNeedsRefocus(true);
      });
  };

  const handleDelete = (todoId: Todo['id']) => {
    setDeletingTodos(prev => [...prev, todoId]);
    setErrorMessage('');
    handleDeleteTodoRequest(todoId);
  };

  const handleSubmit = () => {
    const normalizedTitle = todoTitle.trim();

    if (!normalizedTitle.length) {
      setErrorMessage('Title should not be empty');
      refreshTimer();
      setNeedsRefocus(true);

      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const payload = {
      title: normalizedTitle,
      userId: todoService.USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...payload,
    });

    handleAddTodoRequest(payload);
  };

  const handleClearComplited = () => {
    const completedTodo = todos.filter(todo => todo.completed);

    if (!completedTodo.length) {
      setErrorMessage('Unable to clear completed todos');
      refreshTimer();
      setNeedsRefocus(true);

      return;
    }

    const idsToClear = completedTodo.map(todo => todo.id);

    setErrorMessage('');
    setDeletingTodos(prev => [...prev, ...idsToClear]);

    idsToClear.forEach(id => {
      handleDeleteTodoRequest(id);
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    setErrorMessage('');
    if (focusedInput.current) {
      focusedInput.current.focus();
    }

    todoService
      .getTodos()
      .then(setTodos)
      .catch(error => {
        setErrorMessage('Unable to load todos');
        refreshTimer();
        throw error;
      });
  }, []);

  useEffect(() => {
    if (needsRefocus && focusedInput.current && !isLoading) {
      focusedInput.current.focus();
      setNeedsRefocus(false);
    }
  }, [needsRefocus, isLoading]);

  const incompletedTodos = todos.filter(todo => !todo.completed);

  const filteredTodos = useMemo(() => {
    let filtered = [...todos];

    if (currentFilter) {
      filtered = filtered.filter(AllFilters[currentFilter]);
    }

    return filtered;
  }, [todos, AllFilters, currentFilter]);

  const handleCloseError = () => {
    setErrorMessage('');
  };

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && <ToggleAllButton todos={todos} />}

          <NewTodo
            focusedInput={focusedInput}
            todoTitle={todoTitle}
            onTitleChange={setTodoTitle}
            onEnterKeyPressed={handleKeyDown}
            isDisabled={isLoading}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          isLoading={isLoading}
          tempTodo={tempTodo}
          onDelete={handleDelete}
          deletingTodos={deletingTodos}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {incompletedTodos.length || 0} items left
            </span>

            <TodoFilter
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
            />
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.length - incompletedTodos.length === 0}
              onClick={handleClearComplited}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={handleCloseError}
      />
    </div>
  );
};
