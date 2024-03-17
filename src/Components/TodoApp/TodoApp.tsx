/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { TodoList } from '../TodoList';
import { UserWarning } from '../../UserWarning';
import * as todosServise from '../../api/todos';
import { Status } from '../../types/Status';
import { TodosContext } from '../TodosContext/TodosContext';
import { Todo } from '../../types/Todo';

const USER_ID = 11667;
let idCount = 0;

export const TodoApp: React.FC = () => {
  const {
    todos,
    setTodos,
    filter,
    setFilter,
    errorMessage,
    setErrorMessage,
    text,
    setText,
    todosCounter,
    leftCount,
    setLeftCount,
    setLoading,
    setActiveItemId,
  } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  function addTodo({
    id,
    title,
    completed,
    userId,
  }: Todo) {
    setDisabledInput(true);
    setActiveItemId(id);
    setInputFocused(false);
    setTempTodo({
      id,
      title,
      completed,
      userId,
    });
    todosServise.createTodos({ title, completed, userId })
      .then(newPost => {
        setLoading(true);

        setTodos(currentTodos => ([
          ...(currentTodos || []),
          newPost,
        ]));
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          setText(text);
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setText('');
        setDisabledInput(false);
        setLoading(false);
        setTempTodo(null);
        setInputFocused(true);
      });
  }

  useEffect(() => {
    if (inputFocused) {
      inputRef.current?.focus();
    }
  }, [inputFocused]);

  useEffect(() => {
    setLeftCount(todos.filter(
      (t: Todo) => t.completed !== true,
    ).length);
  }, [todos, setLeftCount]);

  useEffect(() => {
    todosServise.getTodos(USER_ID)
      .then((todo: Todo[]) => {
        setTodos(todo);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, [setTodos, setErrorMessage]);

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();

    if (text.trim()) {
      addTodo({
        id: idCount += 1,
        title: text.trim(),
        completed: false,
        userId: USER_ID,
      });
    } else {
      setErrorMessage('Title should not be empty');
      setInputFocused(true);
    }

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
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
            className={cn('todoapp__toggle-all',
              { active: todosCounter().length !== todos.length })}
            data-cy="ToggleAllButton"
          />

          <form
            key={0}
            method="POST"
            onSubmit={handleAdd}
          >
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={text}
              onChange={(event) => setText(event.target.value)}
              disabled={disabledInput}
              onFocus={() => setInputFocused(true)}
            />
          </form>
        </header>

        <TodoList tempTodo={tempTodo} />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${leftCount} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                data-cy="FilterLinkAll"
                onClick={() => setFilter(Status.ALL)}
                className={cn('filter__link',
                  { selected: filter === Status.ALL })}
              >
                All
              </a>

              <a
                href="#/active"
                data-cy="FilterLinkActive"
                onClick={() => setFilter(Status.ACTIVE)}
                className={cn('filter__link',
                  { selected: filter === Status.ACTIVE })}
              >
                Active
              </a>

              <a
                href="#/completed"
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(Status.COMPLETED)}
                className={cn('filter__link',
                  { selected: filter === Status.COMPLETED })}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* Unable to load todos
          <br />
          Title should not be empty
          <br />
          Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}
        {errorMessage}
      </div>
    </div>
  );
};
