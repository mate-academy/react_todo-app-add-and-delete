import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { postTodos, USER_ID } from '../api/todos';
import { ErrorMessage, Todo } from '../types/Todo';

interface Props {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
  setErrorMessage: (value: ErrorMessage) => void;
  setTempTodo: (value: Todo | null) => void;
  tempTodo: Todo | null;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

export const FormAddTodo = ({
  onSubmit,
  setTodos,
  setErrorMessage,
  setTempTodo,
  tempTodo,
  inputRef,
}: Props) => {
  const [todoText, setTodoText] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTodoText(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    onSubmit(event);

    const newTodo = {
      completed: false,
      id: 0,
      userId: USER_ID,
      title: todoText.trim(),
    };

    if (todoText.trim() === '') {
      setErrorMessage(ErrorMessage.TITLE);

      setTimeout(() => {
        setErrorMessage(ErrorMessage.DEFAULT);
      }, 3000);

      return;
    }

    setTempTodo(newTodo);

    const addTodo = postTodos(newTodo);

    addTodo
      .then(response => {
        setTodos(prevTodos => [...prevTodos, response]);
        setTodoText('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.ADD);

        setTimeout(() => {
          setErrorMessage(ErrorMessage.DEFAULT);
        }, 3000);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  useEffect(() => {
    if (tempTodo && inputRef.current) {
    } else {
      inputRef.current?.focus();
    }
  }, [tempTodo, inputRef]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        autoFocus={true}
        value={todoText}
        onChange={handleChange}
        disabled={!!tempTodo}
        ref={inputRef}
      />
    </form>
  );
};
