import { Todo } from '../types/Todo';

type Props = {
  isLoading: boolean;
  focusedInput: React.Ref<HTMLInputElement>;
  todoTitle: Todo['title'];
  onTitleChange?: (title: Todo['title']) => void;
  onCreateTodo?: (event: React.FormEvent) => void;
};

export const NewTodo: React.FC<Props> = ({
  isLoading: isLoading,
  focusedInput,
  onTitleChange = () => {},
  todoTitle,
  onCreateTodo = event => event.preventDefault(),
}) => {
  return (
    <form onSubmit={onCreateTodo}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isLoading}
        ref={focusedInput}
        value={todoTitle}
        onChange={event => onTitleChange(event.target.value)}
      />
    </form>
  );
};
