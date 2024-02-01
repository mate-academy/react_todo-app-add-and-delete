import {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { TodosContext } from '../../contexts/TodosContext';
import { USER_ID } from '../../variables';
import { createTodo } from '../../api/todos';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Header = () => {
  const {
    title,
    setTitle,
    todos,
    setTodos,
    setErrorMessage,
    setTempTodo,
    errorMessage,
  } = useContext(TodosContext);

  const [isDisabledButton, setIsDisabledButton] = useState(false);

  const changeValues = () => {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });

    createTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    })
      .then(todoFromServer => {
        setTodos(curr => [...curr, todoFromServer]);
        setTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setIsDisabledButton(false);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim()) {
      setIsDisabledButton(true);
      changeValues();
    } else {
      setErrorMessage('Title should not be empty');
    }
  };

  const hendlerChange
    = (event: React.ChangeEvent<HTMLInputElement>) => setTitle(
      event.target.value,
    );

  const conuterOfCompletedTodos = useMemo(() => {
    return !todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [errorMessage, todos]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all',
          { active: conuterOfCompletedTodos })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          disabled={isDisabledButton}
          ref={titleField}
          onChange={hendlerChange}
          data-cy="NewTodoField"
          value={title}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
