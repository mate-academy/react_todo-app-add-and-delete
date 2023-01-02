import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import { createTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  handleError: (textError: string) => () => void,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setNewTitle: React.Dispatch<React.SetStateAction<string>>,
  isDisabled: boolean
};

export const NewTodoField: React.FC<Props> = ({
  setTodos,
  setNewTitle,
  isDisabled,
  handleError,
}) => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!value) {
      handleError('Title can\'t be empty');

      return;
    }

    if (!user) {
      return;
    }

    setNewTitle(value);

    createTodo(value, user.id)
      .then((response) => {
        setTodos(currentTodos => [
          ...currentTodos,
          response,
        ]);
      })
      .catch(error => {
        handleError(`${error}`);
      })
      .finally(() => {
        setValue('');
        setNewTitle('');
      });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setValue(e.currentTarget.value);

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        value={value}
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isDisabled}
        onChange={handleChange}
      />
    </form>
  );
};
