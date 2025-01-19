import { RefObject, useState } from 'react';
import { USER_ID } from '../api/todos';
import { addTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { Form } from './Form';

interface HeaderProps {
  onError: (message: string) => void;
  onTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  formValue: string;
  changeFormValue: (value: string) => void;
  setloadTodo: (value: Todo | null) => void;
  inputRef: RefObject<HTMLInputElement>;
  handleFocus: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onError,
  onTodos,
  formValue,
  changeFormValue,
  setloadTodo,
  inputRef,
  handleFocus,
}) => {
  const [isDisabled, setDisabled] = useState(false);

  async function handeSubmit(title: string) {
    if (title.trim().length === 0) {
      onError('Title should not be empty');

      return;
    }

    try {
      setDisabled(true);

      const tempTodo: Omit<Todo, 'id'> = {
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      setloadTodo({ ...tempTodo, id: 0 });

      const newTodo = await addTodo(tempTodo);

      setloadTodo(null);
      onTodos(prev => [...prev, newTodo]);
      changeFormValue('');
    } catch (error: unknown) {
      onError('');
      setTimeout(() => onError('Unable to add a todo'), 0);
      setloadTodo(null);
    } finally {
      setDisabled(false);
      handleFocus();
    }
  }

  return (
    <Form
      onSubmit={handeSubmit}
      fValue={formValue}
      onChange={changeFormValue}
      isDisabled={isDisabled}
      inputRef={inputRef}
    />
  );
};
