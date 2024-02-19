import { useContext, useEffect, useRef, useState } from 'react';
import { TodoContext } from '../../context/TodoContext';
import { ErrorMessage } from '../../types/ErrorMessage';
import { USER_ID } from '../../constants/UserId';
import * as TodoClient from '../../api/todos';

export const Header: React.FC = () => {
  const [value, setValue] = useState('');

  const {
    todos,
    tempTodo,
    addTodo,
    handleSetTempTodo,
    handleSetErrorMessage
  } = useContext(TodoContext);

  const newTodoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    newTodoInput.current?.focus();
  }, [todos.length, tempTodo]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSetErrorMessage(ErrorMessage.None);

    const newTodo = {
      userId: USER_ID,
      title: value.trim(),
      completed: false,
    };

    if (!value.trim()) {
      handleSetErrorMessage(ErrorMessage.Title);

      return;
    }

    newTodoInput.current?.setAttribute('disabled', 'true');
    handleSetTempTodo({ ...newTodo, id: 0 });
    TodoClient.addTodo(newTodo)
      .then(todo => {
        addTodo(todo);
        setValue('');
      })
      .catch(() => handleSetErrorMessage(ErrorMessage.Add))
      .finally(() => {
        newTodoInput.current?.removeAttribute('disabled');
        handleSetTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={newTodoInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={event => setValue(event.target.value)}
        />
      </form>
    </header>
  );
};
