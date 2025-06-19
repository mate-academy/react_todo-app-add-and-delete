import React, { useEffect, useRef, useState } from 'react';
import { createTodo, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorStatusType';

type FormComponentProps = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (errorMessage: ErrorMessage | null) => void;
  setTempTodo: (todo: Todo | null) => void;
};

export const FormComponent: React.FC<FormComponentProps> = ({
  setTodos,
  setErrorMessage,
  setTempTodo,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });
  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTodoTitle.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });

      return;
    }

    const temp = {
      id: 0,
      title: newTodoTitle.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    createTodo(temp)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.AddTodo);
      })
      .finally(() => {
        setTempTodo(null);
        if (inputRef.current) {
          inputRef.current.disabled = false;
        }
      });
  };

  return (
    <form onSubmit={handleSubmitForm}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={handleChangeInput}
      />
    </form>
  );
};
