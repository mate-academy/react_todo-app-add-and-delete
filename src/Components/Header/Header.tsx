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

export const Header: React.FC<Props> = ({
  setTodos,
  setErrorMessage,
  isDisableInput,
  setIsDisableInput,
  setTempTodo,
}) => {
  const [titleTodo, setTitleTodo] = useState('');
  const textInput = useRef<HTMLInputElement | null>(null);

  const isUnableAddTodo = useRef(true);

  useEffect(() => {
    textInput.current?.focus();
  }, [isDisableInput]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    todoData.title = titleTodo.trim();
    setErrorMessage('');
    isUnableAddTodo.current = true;

    if (titleTodo.trim()) {
      setIsDisableInput(true);
      setTempTodo({
        userId: 11853,
        completed: false,
        title: titleTodo,
        id: 0,
      });

      addTodos(todoData)
        .then(data => {
          setTodos((currentTodos) => [...currentTodos, data]);
          setTempTodo(null);
        })
        .catch((error) => {
          setTempTodo(null);
          isUnableAddTodo.current = false;
          setErrorMessage('Unable to add a todo');
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
          throw error;
        })
        .finally(() => {
          if (isUnableAddTodo.current) {
            setTitleTodo('');
          }

          setIsDisableInput(false);
        });
    } else {
      setErrorMessage('Title should not be empty');

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
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
