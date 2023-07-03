import {
  ChangeEvent,
  FC,
  FormEvent,
  useState,
} from 'react';
import { LoadError } from '../types/LoadError';

interface Props {
  addNewTodo: (title: string) => Promise<boolean>
  setError: React.Dispatch<React.SetStateAction<LoadError>>
}

export const NewTodoForm:FC<Props> = ({ addNewTodo, setError }) => {
  const [newTodoQuery, setNewTodoQuery] = useState('');

  const handleFormInputChange = (event:ChangeEvent<HTMLInputElement>) => {
    setNewTodoQuery(event.target.value);
  };

  const addNewTodoHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoQuery.trim()) {
      setError({
        status: true,
        message: 'Title can\'t be empty',
      });

      return;
    }

    const isSucsess = await addNewTodo(newTodoQuery);

    if (isSucsess) {
      setNewTodoQuery('');
    }
  };

  return (
    <form
      onSubmit={addNewTodoHandler}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoQuery}
        onChange={handleFormInputChange}
      />
    </form>
  );
};
