import React, { useEffect, useState, FormEvent, useMemo, useRef } from 'react';
import { TodoItem } from '../../components/TodoItem/TodoItem';
import * as postService from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/Error';
import { FilterType } from '../../types/FilterType';
import cs from 'classnames';
import { USER_ID } from '../../api/todos';

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorType | null>(null);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [error]);

  useEffect(() => {
    postService
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(ErrorType.LoadTodos);
        setTimeout(() => setError(null), 3000);
      });
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [error, newTodoTitle]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedTitle = newTodoTitle.trim();
    if (!trimmedTitle) {
      setError(ErrorType.NoTitle);
      setTimeout(() => setError(null), 3000);
      return;
    }

    const newTempTodo = {
      id: -1,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);
    setIsAdding(true);

    setLoadingTodoIds(prev => [...prev, -1]);

    postService
      .createTodo({ title: trimmedTitle, completed: false, userId: USER_ID })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        setNewTodoTitle('');
      })
      .catch(() => {
        setError(ErrorType.AddTodo);
        setTempTodo(null);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .finally(() => {
        setIsAdding(false);
      });
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(prev => [...prev, ...completedIds]);

    const deletePromises = completedTodos.map(todo =>
      postService
        .deleteTodo(todo.id)
        .then(() => {
          return { id: todo.id, success: true };
        })
        .catch(() => {
          return { id: todo.id, success: false };
        }),
    );

    try {
      const results = await Promise.all(deletePromises);

      const successfullyDeletedTodos = results
        .filter(result => result.success)
        .map(result => result.id);

      const failedTodos = results
        .filter(result => !result.success)
        .map(result => result.id);

      setTodos(prevTodos =>
        prevTodos.filter(todo => !successfullyDeletedTodos.includes(todo.id)),
      );

      if (failedTodos.length > 0) {
        setError(ErrorType.DeleteTodo);
        setTimeout(() => setError(null), 3000);
      }

    } finally {
      setLoadingTodoIds(prev => prev.filter(id => !completedIds.includes(id)));
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const deleteTodo = (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);

    postService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(() => {
        setError(ErrorType.DeleteTodo);
        setTimeout(() => setError(null), 3000);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .finally(() =>
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId)),
      );
  };

  const handleToggle = (id: number) => {
    setLoadingTodoIds(prev => [...prev, id]);

    setTimeout(() => {
      setTodos(
        todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );

      setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
    }, 300);
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    const allTodoIds = todos.map(todo => todo.id);
    setLoadingTodoIds(prev => [...prev, ...allTodoIds]);

    setTimeout(() => {
      setTodos(updatedTodos);

      setLoadingTodoIds(prev => prev.filter(id => !allTodoIds.includes(id)));
    }, 300);
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filterBy === FilterType.Active) {
        return !todo.completed;
      } else if (filterBy === FilterType.Completed) {
        return todo.completed;
      }
      return true;
    });
  }, [todos, filterBy]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleFilterClick =
    (filter: FilterType) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setFilterBy(filter);
    };

  const filters = [
    { type: FilterType.All, label: 'All', cy: 'FilterLinkAll' },
    { type: FilterType.Active, label: 'Active', cy: 'FilterLinkActive' },
    { type: FilterType.Completed, label: 'Completed', cy: 'FilterLinkCompleted' },
  ];

  return (
    <div className="todoapp">
      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={cs('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={isAdding}
              ref={inputRef}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              onToggle={handleToggle}
              isLoading={loadingTodoIds.includes(todo.id)}
            />
          ))}

          {tempTodo && (
            <TodoItem
              key={tempTodo.id}
              todo={tempTodo}
              {...tempTodo}
              onDelete={deleteTodo}
              onToggle={handleToggle}
              isLoading={loadingTodoIds.includes(tempTodo.id)}
            />
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              {filters.map(({ type, label, cy }) => (
                <a
                  key={type}
                  href={`"#/${label}"`}
                  className={cs('filter__link', {
                    selected: filterBy === type,
                  })}
                  data-cy={cy}
                  onClick={handleFilterClick(type)}
                >
                  {label}
                </a>
              ))}
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodos.length === 0}
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cs(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        <div>
          {error}
          <br />
        </div>
      </div>
    </div>
  );
};
