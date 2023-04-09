import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo, Errors, Filter } from './types/Todo';
import { Form } from './components/Form';
import { TodoList } from './components/Todolist';
import { Footer } from './components/Footer';
import { getTodos, postTodo, removeTodo } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';

const USER_ID = 6910;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<string>(Filter.ALL);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosBeingTransform, setTodosBeingTransform] = useState<number[]>([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const showError = error.length > 0;
  useEffect(() => {
    getTodos(USER_ID)
      .then(data => {
        setTodos(data);
        setError('');
      })
      .catch(() => {
        setError(Errors.LOADING);
      })
      .finally(() => {
        setTimeout(() => {
          setError('');
        }, 3000);
      });
  }, []);

  const setErrorTimeout = () => {
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const handleAddTodo = (todoData: Omit<Todo, 'id'>) => {
    if (!todoData.title.trim()) {
      setError(Errors.TITLE);
      setErrorTimeout()
      return;
    }

    setTempTodo({ ...todoData, id: 0 });

    postTodo(todoData)
      .then((newTodo: any) => (
        setTimeout(() => {
          setTodos([...todos, newTodo]);
          setTempTodo(null);
        }, 500)
      ))
      .catch(() => {
        setError(Errors.ADDING);

        setTimeout(() => {
          setError('');
          setTempTodo(null);
        }, 3000);
      });
  };

  const handleRemoveTodos = (todoId: number) => {
    setIsDeleted(true);
    setTodosBeingTransform(curr => [...curr, todoId]);
    removeTodo(todoId)
      .then(() => {
        setTodos(
          curr => curr.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError(Errors.REMOVING);
        setErrorTimeout();
      })
      .finally(() => {
        setIsDeleted(false);
        setTodosBeingTransform(
          todosBeingTransform.filter(id => id !== todoId),
        );
      });
  };

  const visibleTodos = useMemo(() => {
    return todos
      .filter(todo => {
        switch (filter) {
          case Filter.ACTIVE:
            return !todo.completed;
          case Filter.COMPLETED:
            return todo.completed;
          default:
            return true;
        }
      });
  }, [filter, todos]);


  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: activeTodos.length > 0 },
            )}
          />
          <Form
            onSubmit={handleAddTodo}
            className="todoapp__new-todo"
            placeholder="What needs to be done"
            userId={USER_ID}
          />
        </header>

        {todos && (
          <>
            <TodoList
              onRemove={handleRemoveTodos}
              todos={visibleTodos}
              onDeleted={isDeleted}
            />
            {tempTodo && (
              <div
                key={tempTodo.id}
                className={classNames(
                  'todo',
                  { completed: tempTodo.completed },
                )}
              >
                <label
                  className="todo__status-label"
                >
                  <input
                    type="checkbox"
                    className="todo__status"
                    defaultChecked
                  />
                </label>
                <span
                  className="todo__title"
                >
                  {tempTodo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                >
                  ×
                </button>

                <div
                  className="modal overlay is-active"
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
            <Footer
              filter={filter}
              onSetFilter={setFilter}
              activeTodos={activeTodos}
              completedTodos={completedTodos}
              handleRemoveAll={handleRemoveTodos}

            />
          </>
        )}
        {showError && (
          <ErrorNotification
            error={error}
            showError={showError}
            onErrorClose={() => setError('')}
          />
        )}
      </div>
    </div>
  );
};
