import React, { useEffect, useMemo, useState, useRef } from 'react';
import classNames from 'classnames';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorsNotification } from './ErrorsNotification';
import { Filter } from './types/Filter';
import { Error } from './types/Error';

const USER_ID = 6910;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo []>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null> (null);
  const [todosTransform, setTodosTransform] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const focusInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (focusInput.current) {
      focusInput.current.focus();
    }

    const timeoutId = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    }
  }, [tempTodo, error]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setError(Error.Load);
        
      });
  }, []);

  const addTodo = (todoData: Omit<Todo, 'id'>) => {
    if (!todoData.title.trim()) {
      setError(Error.Title);
      return;
    }

    setTempTodo({ ...todoData, id: 0 })

    postTodo(todoData)
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setTempTodo(null);
        setTitle('');
      })
      .catch(() => {
        setTitle('');
        setError(Error.Add);
        setTempTodo(null);
      })
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const todoData = {
      title,
      completed: false,
      userId: USER_ID,
    };

    addTodo(todoData);
  };


  const removeTodo = (todoId: number) => {
    setIsDeleting(true);
    setTodosTransform(curr => [...curr, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(curr =>
          curr.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError(Error.Delete);
      })
      .finally(() => {
        setIsDeleting(false);
        setTodosTransform(todosTransform.filter(id => id !== todoId));
      });
  };

  const visibleTodos = useMemo(() => {
    switch(filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    };
  }, [filter, todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed)
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value);
  };

  const handleError = () => setError('');
  const showFooter = todos.length > 0 || tempTodo;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              aria-label='Toggle-all'
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                {
                  active: completedTodos.length === todos.length
                },
              )}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={focusInput}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleChange}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        {todos && (
          <TodoList
            todos={visibleTodos}
            onRemove={removeTodo}
            isDeleting={isDeleting}
            todosTransform={todosTransform}
            tempTodo={tempTodo}
          />
        )}

          {showFooter && (
            <Footer
              filter={filter}
              onSetFilter={setFilter}
              completedTodos={completedTodos}
              onRemoveAll={removeTodo}
              activeTodos={activeTodos}
            />
          )}
      </div>

      {error && (
        <ErrorsNotification
          error={error}
          onCloseError={handleError}
        />
      )}
    </div>
  );
};
