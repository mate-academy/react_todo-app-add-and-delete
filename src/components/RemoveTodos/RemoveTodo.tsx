import React from 'react';
import { Todo } from '../../types/Todo';
import { removeTodos } from '../../api/todos';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMesage: React.Dispatch<React.SetStateAction<string>>;
  handleAutofocus: (isEnabled: boolean) => void;
  setLoader: React.Dispatch<React.SetStateAction<number | null>>;
};

export const RemoveButton: React.FC<Props> = ({
  todo,
  setTodos,
  setErrorMesage,
  handleAutofocus,
  setLoader,
}) => {
  const id = todo.id ?? -1;
  const handleRemove = async () => {
    setLoader(id);
    try {
      handleAutofocus(true);
      setErrorMesage('');
      await removeTodos(id);
      setTodos((prev: Todo[]) => prev.filter(item => item.id !== todo.id));
    } catch {
      setErrorMesage('Unable to delete a todo');
    } finally {
      setLoader(null);
      handleAutofocus(false);
    }
  };

  return (
    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={handleRemove}
    >
      ×
    </button>
  );
};
