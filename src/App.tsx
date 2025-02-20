/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem/TodoItem';
import classNames from 'classnames';
import { useErrorMessage } from './utils/useErrorMessage';
import { FooterContent } from './components/FooterContent/FooterContent';
import { TypeFilterParams } from './types/filterParams';

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [userTodos, setUserTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [filterBy, setFilterBy] = useState<TypeFilterParams>('All');
  const [errorMessage, setErrorMessage] = useErrorMessage('');
  const [isActive, setIsActive] = useState<number[]>([]);

  const todoInput = useRef<HTMLInputElement>(null);

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizeTodo = inputValue.trim();

    if (normalizeTodo.length === 0) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = { title: normalizeTodo, completed: false };

    addTodos(newTodo)
      .then(res => {
        setUserTodos(curr => [...curr, res]);
        setInputValue('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setTimeout(() => todoInput.current?.focus(), 0);
      });

    setTempTodo({ ...newTodo, id: 0, userId: 0 });
    setErrorMessage('');
  }

  function removeTodo(id: number) {
    setIsActive(curr => [...curr, id]);

    deleteTodos(id)
      .then(() => setUserTodos(cur => cur.filter(t => t.id !== id)))
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setIsActive(cur => cur.filter(v => v !== id));
        todoInput.current?.focus();
      });
  }

  function removeAllComplete() {
    userTodos.forEach(t => {
      if (t.completed) {
        removeTodo(t.id);
      }
    });
  }

  const visibleTodos = userTodos.filter(todo => {
    switch (filterBy) {
      case 'Completed':
        return todo.completed;
      case 'Active':
        return !todo.completed;
      default:
        return true;
    }
  });

  const {
    todosListNotEmpty,
    allTodosIsComlete,
    isCompleteTodo,
    countNotComplete,
  } = useMemo(() => {
    let complete = 0;
    let active = 0;

    userTodos.forEach(t => {
      if (t.completed) {
        complete++;
      } else {
        active++;
      }
    });

    return {
      todosListNotEmpty: userTodos.length > 0,
      allTodosIsComlete: userTodos.length === complete,
      isCompleteTodo: complete > 0,
      countNotComplete: active,
    };
  }, [userTodos]);

  useEffect(() => {
    todoInput.current?.focus();
    getTodos()
      .then(res => {
        setUserTodos(res);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // get user todos

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todosListNotEmpty && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allTodosIsComlete,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={submitForm}>
            <input
              ref={todoInput}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={e => setInputValue(e.currentTarget.value)}
              disabled={Boolean(tempTodo)}
            />
          </form>
        </header>

        {todosListNotEmpty && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {visibleTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isProcessed={isActive.includes(todo.id)}
                  onDeleteTodo={id => removeTodo(id)}
                />
              ))}
              {tempTodo && <TodoItem todo={tempTodo} isProcessed={true} />}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <FooterContent
                countNotComplete={countNotComplete}
                filterBy={filterBy}
                isCompleteTodo={isCompleteTodo}
                onChangeFilterBy={fp => setFilterBy(fp)}
                onDeleteCompletTodos={() => removeAllComplete()}
              />
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
