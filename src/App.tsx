/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Filter } from './types/Filter';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { Notification } from './components/Notification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]); // for delete loaders
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load todos on mount
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  // Focus input on mount and after add
  useEffect(() => {
    inputRef.current?.focus();
  }, [isAdding, error]);

  // Notification auto-hide
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = inputValue.trim();

    if (!title) {
      setError('Title should not be empty');

      return;
    }

    setIsAdding(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    try {
      const newTodo = await addTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos(prev => [...prev, newTodo]);
      setInputValue('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingIds(ids => [...ids, id]);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      inputRef.current?.focus();
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoadingIds(ids => ids.filter(i => i !== id));
    }
  };

  const handleToggle = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleClearCompleted = async () => {
    const completed = todos.filter(todo => todo.completed);

    await Promise.all(
      completed.map(async todo => {
        setLoadingIds(ids => [...ids, todo.id]);
        try {
          await deleteTodo(todo.id);
          setTodos(prev => prev.filter(t => t.id !== todo.id));
        } catch {
          setError('Unable to delete a todo');
        } finally {
          setLoadingIds(ids => ids.filter(i => i !== todo.id));
        }
      }),
    );
    inputRef.current?.focus();
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={
              'todoapp__toggle-all' +
              (todos.length > 0 && todos.every(t => t.completed)
                ? ' active'
                : '')
            }
            data-cy="ToggleAllButton"
            aria-label="Toggle all todos"
          />
          <TodoForm
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onSubmit={handleAddTodo}
            isAdding={isAdding}
            inputRef={inputRef}
          />
        </header>
        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingIds={loadingIds}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos.length} items left
            </span>
            <nav className="filter" data-cy="Filter">
              {(Object.keys(Filter) as Array<keyof typeof Filter>).map(
                filterKey => {
                  const filterValue = Filter[filterKey];

                  return (
                    <a
                      key={filterValue}
                      href={`#/${filterValue}`}
                      className={`filter__link${
                        filter === filterValue ? ' selected' : ''
                      }`}
                      data-cy={`FilterLink${
                        filterValue.charAt(0).toUpperCase() +
                        filterValue.slice(1)
                      }`}
                      onClick={e => {
                        e.preventDefault();
                        setFilter(filterValue);
                      }}
                    >
                      {filterValue.charAt(0).toUpperCase() +
                        filterValue.slice(1)}
                    </a>
                  );
                },
              )}
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={completedTodos.length === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
        <Notification error={error} onHide={() => setError('')} />
      </div>
    </div>
  );
};
