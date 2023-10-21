/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useRef,
  useEffect,
  useState,
  useContext,
} from 'react';
import classNames from 'classnames';
import { TodoContext } from '../../context/TodoContext';
import { ErrorMessage } from '../../types/ErrorMessage';
import { USER_ID } from '../../utils/constants';

// interface Props {}

export const TodoHeader: React.FC = () => {
  const {
    setErrorMessage,
    addTodoHandler,
    activeTodos,
    completedTodos,
    isLoading,
  } = useContext(TodoContext);

  const activeTodosCount = activeTodos.length;
  const completedTodosCount = completedTodos.length;

  const formInput = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.trimStart();

    setValue(newValue);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trimEnd()) {
      setErrorMessage(ErrorMessage.EmptyTitleError);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: value.trim(),
      completed: false,
    };
    /* eslint-disable no-console */

    console.log(newTodo);

    addTodoHandler(newTodo)
      .then(() => {
        setValue('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.AddError);
      });
  };

  useEffect(() => {
    if (formInput.current) {
      formInput.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      formInput.current?.focus();
    }
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {!!activeTodosCount && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={classNames(
            'todoapp__toggle-all',
            { active: completedTodosCount },
          )}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={formInput}
          value={value}
          onChange={(event) => handleInputChange(event)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
