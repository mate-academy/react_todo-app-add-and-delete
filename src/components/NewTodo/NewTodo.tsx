import { ChangeEvent, FormEvent } from 'react';
import { addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

interface NewTodoProps {
  tempTodo: Todo | null;
  userId: number;
  inputText: string;
  todos: Todo[];
  onTextChange: (text: string) => void;
  onError: (err: string) => void;
  onTempTodo: (todo: Todo | null) => void;
  onTodoAdded: (todos: Todo[]) => void;
  onGenericError: (error: string) => void;
}

export const NewTodo: React.FC<NewTodoProps> = ({
  tempTodo,
  userId,
  inputText,
  todos,
  onTextChange,
  onError,
  onTempTodo,
  onTodoAdded,
  onGenericError,
}) => {
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    onTextChange(event.target.value);
  };

  const onTodoSubmit = (todo: Todo) => {
    addTodo(todo)
      .then((thisTodo) => onTodoAdded([...todos, thisTodo]))
      .catch(() => onGenericError('add'))
      .finally(() => onTempTodo(null));
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

      onTempTodo(thisTodo);
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
