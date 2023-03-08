// import { Todo } from '../types/Todo';

type Props = {
  title: string;
  setTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const Header: React.FC<Props> = ({ setTitle, title, handleAddTodo }) => {
  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        aria-label="change todo active state"
        type="button"
        className="todoapp__toggle-all active"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          onChange={setTitle}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
        />
      </form>
    </header>
  );
};
