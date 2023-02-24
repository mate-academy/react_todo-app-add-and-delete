import { Todo } from '../../types/Todo';

type Props = {
  inputValue: string;
  tempTodo: Todo | null;
  onChangeTodoInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitTodo: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const TodoHeader: React.FC<Props> = ({
  inputValue,
  tempTodo,
  onChangeTodoInput,
  onSubmitTodo,
}) => {
  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={onSubmitTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={onChangeTodoInput}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
