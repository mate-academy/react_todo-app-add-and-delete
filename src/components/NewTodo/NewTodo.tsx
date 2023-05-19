import { useState } from 'react';
import { USER_ID } from '../../constants/userid';
import { Todo } from '../../types/Todo';

// const USER_ID = 10282;

interface Props {
  maxId: number;
  onSetErrorStates: (message: string, status: boolean) => void;
  onSetPreperedTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  onSetTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  isLoading: boolean;
}

export const NewTodo: React.FC<Props> = ({
  maxId,
  onSetErrorStates,
  onSetPreperedTodo,
  onSetTempTodo,
  isLoading,
}) => {
  const [title, setTitle] = useState<string>('');
  const [idCounter, setIdCounter] = useState<number>(maxId);

  const handleInputTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleTodoAddition = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') {
      setTitle('');
      onSetErrorStates('Title can\'t be empty', true);

      return;
    }

    setIdCounter(currentId => currentId + 1);

    const preparedTodo = {
      id: idCounter,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    onSetPreperedTodo(preparedTodo);
    onSetTempTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });
    setTitle('');
  };

  return (
    // {/* Add a todo on form submit */}
    <form
      action="#"
      method="POST"
      onSubmit={handleTodoAddition}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleInputTodo}
        disabled={isLoading}
      />
    </form>
  );
};
