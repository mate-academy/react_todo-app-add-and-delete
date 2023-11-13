import { Todo } from '../types/Todo';

type Props = {
  setNewTodo: (value: string) => void;
  newTodo: string;
  setCurrentTodos: (value: React.SetStateAction<Todo[]>) => void;
  setUpdatingTodo: (value: boolean) => void;
};

export const Header: React.FC<Props> = ({
  newTodo,
  setNewTodo,
  setCurrentTodos,
  setUpdatingTodo,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim().length > 0) {
      setUpdatingTodo(true);
      setTimeout(() => {
        setCurrentTodos((prevTodos: Todo[]) => [
          ...prevTodos,
          {
            id: new Date().getTime(),
            title: newTodo,
            completed: false,
            userId: 0,
          },
      ]);
      setNewTodo('');
      setUpdatingTodo(false);
    }, 300);
  };
}

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      >
        <span className="sr-only">Add Todo</span>
      </button>

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="newTodo" className="sr-only">
          New Todo
        </label>
        <input
          id="newTodo"
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInputChange}
          value={newTodo}
        />
      </form>
    </header>
  );
};
