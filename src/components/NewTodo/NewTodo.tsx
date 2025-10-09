import React, { useState } from 'react';
import { InitialTodo, Todo } from '../../types/Todo';
import { createTodo, USER_ID } from '../../api/todos';

type Props = {
  input: React.RefObject<HTMLInputElement>;
  showTempTodo: (todo: Todo) => void;
  hideTempTodo: () => void;
  onAddTodo: (todo: Todo) => void;
  throwErr: (msg: string) => void;
  focusInput: () => void;
};

const NewTodo: React.FC<Props> = ({
  input,
  showTempTodo,
  hideTempTodo,
  onAddTodo,
  throwErr,
  focusInput,
}: Props) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!input.current) {
      throw new Error('Title input is not found');
    }

    const newTodo: InitialTodo = {
      title: input.current.value.trim() || '',
      userId: USER_ID,
      completed: false,
    };

    if (!newTodo.title) {
      throwErr('Title should not be empty');

      return;
    }

    setIsDisabled(true);
    showTempTodo({ ...newTodo, id: 0 });

    createTodo(newTodo)
      .then(data => {
        onAddTodo(data);
        // eslint-disable-next-line no-param-reassign
        input.current!.value = '';
      })
      .catch(() => throwErr('Unable to add a todo'))
      .finally(() => {
        setIsDisabled(false);
        hideTempTodo();

        // I need this timeout to not fail tests
        setTimeout(() => {
          focusInput();
        }, 100);
      });
  };

  return (
    <form onSubmit={event => handleSubmit(event)}>
      <input
        ref={input}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        autoFocus
        disabled={isDisabled}
      />
    </form>
  );
};

export default React.memo(NewTodo);
