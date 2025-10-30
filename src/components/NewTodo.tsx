import { Todo } from '../types/Todo';

type Props = {
  loading: boolean;
  focusedInput: React.Ref<HTMLInputElement>;
  todoTitle: Todo['title'];
  onTitleChange?: (title: Todo['title']) => void;
  onCreateTodo?: (event: React.FormEvent) => void;
};

export const NewTodo: React.FC<Props> = ({
  loading,
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
        disabled={loading}
        ref={focusedInput}
        value={todoTitle}
        onChange={event => onTitleChange(event.target.value)}
      />
    </form>
  );
};
