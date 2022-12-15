/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import { addTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { AddTodoFieldForm } from './components/AddTodoFieldForm';
import { TodoFilter } from './components/TodoFilter';
import { TodoFilters } from './types/TodoFilters';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<TodoFilters>(TodoFilters.all);
  const [errorType, setErrorType] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const visibleTodos = useCallback(() => {
    const {
      completed,
      active,
    } = TodoFilters;

    return todos.filter(todo => {
      switch (filter) {
        case completed:
          return todo.completed;
        case active:
          return !todo.completed;
        default:
          return todo;
      }
    });
  }, [filter, todos]);

  const activeTodos = todos.filter(todo => !todo.completed).length;

  const loadUsersTodos = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const todosFromServer = await getTodos(user.id);

      setTodos(todosFromServer);
    } catch {
      setErrorType("Can't load user todos");
    }
  }, [user]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadUsersTodos();
  }, [user]);

  const handleSubmitForm = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsAdding(true);

      if (title.trim() && user) {
        setTempTodo({
          id: 0,
          userId: user.id,
          title: title.trim(),
          completed: false,
        });

        await addTodo({
          userId: user.id,
          title: title.trim(),
          completed: false,
        });

        await loadUsersTodos();

        setTempTodo(null);
        setTitle('');
      } else if (!title.trim()) {
        setErrorType("Title can't be empty");
      } else {
        setErrorType("Title can't add");
      }

      setIsAdding(false);
    }, [title, user],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                {
                  active: todos.every(todo => todo.completed),
                },
              )}
            />
          )}

          <AddTodoFieldForm
            onChangeTitle={setTitle}
            title={title}
            onSubmit={handleSubmitForm}
            isAdding={isAdding}
          />
        </header>

        {!!todos.length && (
          <>
            <section
              className="todoapp__main"
              data-cy="TodoList"
            >
              <TodoList
                todos={visibleTodos()}
              />

              {tempTodo && (
                <div
                  data-cy="Todo"
                  className={classNames(
                    'todo',
                    {
                      completed: tempTodo.completed,
                    },
                  )}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      defaultChecked
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDeleteButton"
                  >
                    ×
                  </button>

                  <div data-cy="TodoLoader" className="modal overlay">
                    <div
                      className="modal-background has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              )}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${activeTodos} items left`}
              </span>

              <TodoFilter
                onFilterBy={setFilter}
                currentFilter={filter}
              />

              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {errorType && (
        <ErrorNotification
          errorType={errorType}
          onErrorTypeChange={setErrorType}
        />
      )}
    </div>
  );
};
