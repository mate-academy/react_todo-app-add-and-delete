import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';
import { useTodo } from '../providers/AppProvider';

type Props = {
  todo: Todo;
};

export const TodoItem = ({ todo }: Props) => {
  const { setTodos, removeTodoContext } = useTodo();

  const handleClick = () => {
    setTodos((prev: Todo[]) => {
      const copyTodos = [...prev];
      const currentTodo = copyTodos.find(v => v.id === todo.id);

      if (!currentTodo) {
        return [];
      }

      currentTodo.completed = !currentTodo.completed;

      return copyTodos;
    });
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onClick={handleClick}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        {/* Remove button appears only on hover */}
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            removeTodoContext(todo.id);
          }}
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being updated */}
        <Loader />
      </div>

      {/* This todo is being edited
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        {/* This form is shown instead of the title and remove button */}
      {/* <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
        <Loader /> */}
      {/* </div> */}

      {/* This todo is in loadind state */}
      {/* <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          Todo is being saved now
        </span>

        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>

        'is-active' class puts this modal on top of the todo
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}
    </>
  );
};
