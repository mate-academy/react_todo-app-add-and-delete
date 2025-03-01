import React, { useState } from 'react';
import { removeTodos, updateTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  oldValue: string;
  setCallUpdatingForm: React.Dispatch<React.SetStateAction<number | null>>;
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMesage: React.Dispatch<React.SetStateAction<string>>;
};

export const UpdateToDo: React.FC<Props> = ({
  oldValue,
  setCallUpdatingForm,
  todo,
  setTodos,
  setErrorMesage,
}) => {
  const [updatedValue, setUpdatedValue] = useState<string>(oldValue);
  const handleUpdatingOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUpdatedValue(event.target.value);
  };

  const id = todo.id ?? -1;

  const handleUpdatingForm = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!updatedValue) {
      removeTodos(id)
        .then()
        // eslint-disable-next-line no-console
        .catch(error => console.log('Failed to delete', error));
      setTodos(prev => prev.filter(el => el.id !== todo.id));

      return;
    }

    try {
      const updatedTodo: Todo = await updateTodos(id, {
        ...todo,
        title: updatedValue.trim(),
      });

      setCallUpdatingForm(0);

      setTodos(prev =>
        prev.map(item => (item.id === updatedTodo.id ? updatedTodo : item)),
      );
    } catch {
      setErrorMesage('Unable to update todo');
    }
  };

  return (
    <form onSubmit={event => handleUpdatingForm(event)}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={updatedValue}
        onBlur={() => setCallUpdatingForm(0)}
        autoFocus
        onChange={handleUpdatingOnChange}
      />
    </form>
  );
};
