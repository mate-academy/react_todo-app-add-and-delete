import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo, Errors, Filter } from './types/Todo';
import { Form } from './components/Form';
import { TodoList } from './components/Todolist';
import { Footer } from './components/Footer';
import { getTodos, postTodo, removeTodo } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoModal } from './components/TodoModal';


const USER_ID = 6910;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const showError = !!error || error !== '';
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosBeingTransform, setTodosBeingTransform] = useState<number[]>([]);

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

  const handleAddTodo = (todoData: Omit<Todo, 'id'>) => {
    if (!todoData.title) {
      setError(Errors.TITLE);

      setTimeout(() => {
        setError('');
      }, 3000);

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
        }, 3000);
      });
  };

  const handleRemoveTodos = (todoId: number) => {
    setTodosBeingTransform(curr => [...curr, todoId]);
    removeTodo(todoId)
      .then(() => {
        setTodos(
          curr => curr.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError(Errors.REMOVING);

        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => {
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

  const hasActiveTodos = todos.some(todo => !todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: !hasActiveTodos },
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
                  <TodoModal />
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
