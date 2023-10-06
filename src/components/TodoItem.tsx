import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';
import { useTodo } from '../providers/AppProvider';

type Props = {
  todo: Todo;
};

export const TodoItem = ({ todo }: Props) => {
  const {
    setTodos, removeTodoContext, setEditedTodo,
  } = useTodo();

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
            setEditedTodo(todo);
            removeTodoContext(todo.id);
          }}
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being updated */}
        {/* {editedTodo?.id === todo.id && <Loader />} */}
        <Loader />
      </div>
    </>
  );
};
