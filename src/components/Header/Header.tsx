import React, { useState } from 'react';
import { createTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  setErrorMassege: (error: string) => void,
  hideError: () => void,
  userId: number,
  addTodo: (todo: Todo) => void,
};

export const Header: React.FC<Props> = ({
  setErrorMassege,
  hideError,
  userId,
  addTodo,
}) => {
  const [titleTodo, setTitleTodo] = useState('');
  const [isblockedInput, setIsblockedInput] = useState(false);

  const handleChangeTitleTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTitleTodo(event.target.value);
  };

  const handleSubmitTodo = () => {
    setIsblockedInput(true);

    if (!titleTodo) {
      setErrorMassege('Title can\'t be empty');
      hideError();
      setIsblockedInput(false);

      return;
    }

    createTodo({
      userId,
      title: titleTodo,
      completed: false,
    })
      .then(newTodo => {
        addTodo(newTodo);
        setTitleTodo('');
      })
      .catch(() => {
        setErrorMassege('Unable to add a todo');
        hideError();
      })
      .finally(() => setIsblockedInput(false));
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        aria-label="change the completed of todos"
        type="button"
        className="todoapp__toggle-all active"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmitTodo}>
        <input
          value={titleTodo}
          onChange={handleChangeTitleTodo}
          disabled={isblockedInput}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
