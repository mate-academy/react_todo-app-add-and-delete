import { ChangeEvent, FormEvent } from 'react';
import { Todo } from '../../types/Todo';

interface NewTodoProps {
  tempTodo: Todo | null;
  userId: number;
  inputText: string;
  onTextChange: (text: string) => void;
  onError: (err: string) => void;
  onTodoSubmit: (todo: Todo) => void;
}

export const NewTodo: React.FC<NewTodoProps> = ({
  tempTodo,
  userId,
  inputText,
  onTextChange,
  onError,
  onTodoSubmit,
}) => {
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    onTextChange(event.target.value);
  };

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = inputText.trim();

    if (!title) {
      onError('Title can\'t be empty');
    } else {
      const thisTodo: Todo = {
        id: 0,
        userId,
        title,
        completed: false,
      };

      onTodoSubmit(thisTodo);
    }
  };

  return (
    <form onSubmit={onFormSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={tempTodo !== null}
        value={inputText}
        onChange={onInputChange}
      />
    </form>
  );
};
