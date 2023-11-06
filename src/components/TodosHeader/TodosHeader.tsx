import { Todo } from '../../types/Todo';
import { TodoForm } from '../TodoForm/TodoForm';

type Props = {
  todos: Todo[];
  addTodo: (todo: string) => void;
  changeErrorMessage: (errorMsg: string) => void;
};

export const TodosHeader = ({ todos, addTodo, changeErrorMessage }: Props) => {
  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {(todos.length > 0) && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          aria-label="Toggle between active and not active"
        />
      )}

      {/* Add a todo on form submit */}
      <TodoForm addTodo={addTodo} changeErrorMessage={changeErrorMessage} />
    </header>
  );
};
