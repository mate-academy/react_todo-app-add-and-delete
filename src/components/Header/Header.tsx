import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import { TodosContext } from '../../stor/Context';

type Props = {
  isEmpty: boolean;
};

export const Header: React.FC<Props> = ({ isEmpty }) => {
  const {
    addTodo,
    toggleAll,
    isAllTodoCompleted,
    todos,
    ref,
    setErrorMessage,
    isSubmitting,
    setIsSubmitting,
  } = useContext(TodosContext);

  const [value, setValue] = useState('');

  React.useEffect(() => {
    ref.current?.focus();
  }, [ref, todos]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const trimValue = value.trim();

    if (trimValue) {
      addTodo({
        id: +new Date(),
        title: trimValue,
        completed: false,
        userId: 566,
      })
        .then(() => {
          setValue('');
          ref.current?.focus();
        })
        .finally(() => setIsSubmitting(false));
    } else {
      setIsSubmitting(false);
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!isEmpty && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodoCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={event => setValue(event.target.value)}
          id="NewTodoField"
          ref={ref}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
