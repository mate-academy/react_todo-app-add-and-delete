import React, { useEffect, useRef, useState } from 'react';
import { addTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TodoFromServer } from '../../types/TodoFromServer';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (errorMassage: string) => void;
  isDisableInput: boolean;
  setIsDisableInput: (value: boolean) => void;
  setTempTodo: (todo: Todo | null) => void;
};

const todoData: TodoFromServer = {
  userId: 11853,
  completed: false,
  title: '',
};
const regex = /\s/g;

export const Header: React.FC<Props> = ({
  setTodos,
  setErrorMessage,
  isDisableInput,
  setIsDisableInput,
  setTempTodo,
}) => {
  const [titleTodo, setTitleTodo] = useState('');
  const textInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    textInput.current?.focus();
  }, [isDisableInput]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    todoData.title = titleTodo.trim();

    if (!titleTodo || regex.test(titleTodo)) {
      setErrorMessage('Title should not be empty');

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    setTempTodo({
      userId: 11853,
      completed: false,
      title: titleTodo,
      id: 0,
    });

    setIsDisableInput(true);

    addTodos(todoData)
      .then(data => {
        return setTodos((currentTodos) => [...currentTodos, data]);
      })
      .catch()
      .finally(() => {
        setTitleTodo('');
        setIsDisableInput(false);
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleTodo}
          onChange={event => setTitleTodo(event.target.value)}
          ref={textInput}
          disabled={isDisableInput}
        />
      </form>
    </header>
  );
};
