import React, { useEffect, useRef } from 'react';
import { Errors } from '../../utils/Errors';
import { handleError } from '../../utils/handleError';
import { Todo } from '../../types/Todo';
import { postTodo } from '../../api/todos';
import { TEMPLATE_TODO } from '../../utils/CONSTANTS';

interface Props {
  setErrorMessage: (error: Errors) => void;
  setTempTodo: (todo: Todo | null) => void;
  onAddTodo: (newTodo: Todo) => void;
  tempTodo: Todo | null;
  todosLength: number;
}

export const InputForm: React.FC<Props> = ({
  setErrorMessage,
  onAddTodo,
  tempTodo,
  setTempTodo,
  todosLength,
}) => {
  const inputField = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inputValue = inputField?.current?.value.trim();

    if (!inputValue) {
      handleError(Errors.EmptyTitle, setErrorMessage);

      return;
    }

    const CreatedNewTodo = {
      ...TEMPLATE_TODO,
      title: inputValue,
    };

    setTempTodo(CreatedNewTodo);
    postTodo(CreatedNewTodo)
      .then(res => {
        onAddTodo(res);

        if (inputField.current) {
          inputField.current.value = '';
        }
      })
      .catch(() => handleError(Errors.AddTodo, setErrorMessage))
      .finally(() => setTempTodo(null));
  };

  useEffect(() => {
    inputField.current?.focus();
  }, [tempTodo, todosLength]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputField}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={!!tempTodo}
      />
    </form>
  );
};
