import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';

const USER_ID = 10527;

interface Props {
  handleAddTodo: (newTodo: Todo) => void;
  handleAlert: (message: string) => void;
}

export const AddTodoInput: React.FC<Props> = ({
  handleAddTodo,
  handleAlert,
}) => {
  const [title, setTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const typedInput: string = event.target.value;

    setTitle(typedInput);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      handleAlert(ErrorMessage.EmptyTitle);

      return;
    }

    const tempTodo: Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    setIsInputDisabled(true);

    handleAddTodo(tempTodo);

    setTitle('');
    setIsInputDisabled(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleTitleChange}
        disabled={isInputDisabled}
      />
    </form>
  );
};
