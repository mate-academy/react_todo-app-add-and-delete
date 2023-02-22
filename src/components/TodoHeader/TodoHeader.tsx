import { Todo } from '../../types/Todo';

type Props = {
  newTodo: Todo;
  onChangeTodoInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitTodo: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const TodoHeader: React.FC<Props> = ({
  newTodo,
  onChangeTodoInput,
  onSubmitTodo,
}) => {
  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmitTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          name="title"
          value={newTodo.title}
          onChange={onChangeTodoInput}
        />
      </form>
    </header>
  );
};
