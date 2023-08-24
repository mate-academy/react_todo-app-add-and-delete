import React, { useState } from 'react';
import { createTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  setErrorMassege: (error: string) => void,
  hideError: () => void,
  userId: number,
  addTodo: (todo: Todo) => void,
  spinnerStatus: (value: boolean) => void,
  changeDate: (date: Date) => void,
  changeCurrentId: (id: number) => void,
  setTodos: (todos: Todo[]) => void,
  todos: Todo[],
};

export const Header: React.FC<Props> = ({
  setErrorMassege,
  hideError,
  userId,
  addTodo,
  spinnerStatus,
  changeDate,
  changeCurrentId,
  setTodos,
  todos,
}) => {
  const [titleTodo, setTitleTodo] = useState('');
  const [isblockedInput, setIsblockedInput] = useState(false);

  const handleChangeTitleTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTitleTodo(event.target.value);
  };

  const handleSubmitTodo = (event: React.FormEvent) => {
    event.preventDefault();
    setIsblockedInput(true);

    if (!titleTodo.trim()) {
      setErrorMassege('Title can\'t be empty');
      hideError();
      setIsblockedInput(false);

      return;
    }

    const tempTodo = {
      id: 0,
      userId,
      title: titleTodo,
      completed: false,
    };

    changeCurrentId(0);
    spinnerStatus(true);
    addTodo(tempTodo);

    createTodo(tempTodo)
      .then(() => {
        setTitleTodo('');
        spinnerStatus(false);
        changeDate(new Date());
      })
      .catch(() => {
        setErrorMassege('Unable to add a todo');
        hideError();
        setTodos(todos);
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
