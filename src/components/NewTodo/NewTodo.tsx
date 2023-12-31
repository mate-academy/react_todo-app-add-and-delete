import { FC, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/ErrorTypes';

type Props = {
  onAdd: (todo: Todo) => void,
  userId: number,
  setErrorMsg: (errorMsg: Errors | null) => void,
};

export const NewTodo: FC<Props> = (
  {
    onAdd, userId, setErrorMsg,
  },
) => {
  const [inputTitle, setInputTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const addTodo = (title: string) => {
    const todo: Todo = {
      id: 0,
      userId,
      title,
      completed: false,
    };

    onAdd(todo);
    setInputTitle('');
  };

  function handleKeyPressed(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (inputTitle.trim() === '') {
        setErrorMsg(Errors.title);

        return;
      }

      setErrorMsg(null);
      setIsDisabled(true);
      addTodo(inputTitle.trim());
      setIsDisabled(false);
    }
  }

  function handleTodoField(event: React.ChangeEvent<HTMLInputElement>) {
    setInputTitle(event.target.value);
  }

  return (
    <form>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={inputTitle}
        onKeyDown={(event) => handleKeyPressed(event)}
        onChange={handleTodoField}
        disabled={isDisabled}
      />
    </form>
  );
};
