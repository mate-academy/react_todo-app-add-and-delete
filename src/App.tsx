import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TodoList } from './components/TodoList';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import cn from 'classnames';
import { Filter } from './types/types';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodos, setTempTodos] = useState<Todo[]>([]);
  const [loadingError, setLoadingError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [filterSelected, setFilterSelected] = useState<Filter>(Filter.All);

  const filterTodos = useMemo(() => {
    switch (filterSelected) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filterSelected]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setLoadingError('Unable to load todos');
        setTimeout(() => {
          setLoadingError('');
        }, 3000);
      });
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, loadingTodos]);

  const toggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const toggleTodoAll = () => {
    const allCompleted = todos.every(todo => todo.completed);

    setTodos(prevTodos =>
      prevTodos.map(todo => ({ ...todo, completed: !allCompleted })),
    );
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) {
      setValidationError('Title should not be empty');
      setTimeout(() => {
        setValidationError('');
      }, 3000);
      if (inputRef.current) {
        inputRef.current.focus();
      }

      return;
    }

    const tempTodo: Todo = {
      id: Date.now(),
      title: inputText,
      completed: false,
      userId: 1129,
    };

    setTempTodos(prevTempTodos => [...prevTempTodos, tempTodo]);
    setLoadingTodos(prev => {
      const updated = [...prev, tempTodo.id];

      return updated;
    });

    addTodo(inputText.trim())
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTempTodos(prevTempTodos =>
          prevTempTodos.filter(todo => todo.id !== tempTodo.id),
        );
        setInputText('');
        setValidationError('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(() => {
        setLoadingError('Unable to add a todo');
        setTempTodos(prevTempTodos =>
          prevTempTodos.filter(todo => todo.id !== tempTodo.id),
        );
        setTimeout(() => {
          setLoadingError('');
        }, 3000);
      })
      .finally(() => {
        setLoadingTodos(prev => {
          const updated = prev.filter(id => id !== tempTodo.id);

          return updated;
        });
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  const deletePost = (id: number) => {
    setLoadingTodos(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setLoadingError('Unable to delete a todo');
        setTimeout(() => {
          setLoadingError('');
        }, 3000);
      })
      .finally(() => {
        setLoadingTodos(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const clearErrors = () => {
    setLoadingError('');
    setValidationError('');
  };

  const clearCompleted = () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodoIds.forEach(id => {
      deletePost(id);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const leftItem = todos.filter(todo => !todo.completed).length;
  const disabledButton = todos.every(todo => !todo.completed);

  const filterValues = Object.values(Filter);

  const allTodos = [...filterTodos, ...tempTodos];

  const cnButton = todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', { active: cnButton })}
            data-cy="ToggleAllButton"
            onClick={toggleTodoAll}
          />
          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              value={inputText}
              onChange={handleInputChange}
              disabled={loadingTodos.length > 0}
            />
          </form>
        </header>
        <TodoList
          todos={allTodos}
          toggleTodo={toggleTodo}
          deletePost={deletePost}
          loadingTodos={loadingTodos}
        />
        {todos.length > 0 && (
          <Footer
            leftItem={leftItem}
            filterValues={filterValues}
            filterSelected={filterSelected}
            setFilterSelected={setFilterSelected}
            disabledButton={disabledButton}
            clearCompleted={clearCompleted}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !loadingError && !validationError,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={clearErrors}
        />
        {loadingError && <div>{loadingError}</div>}
        {validationError && <div>{validationError}</div>}
      </div>
    </div>
  );
};
