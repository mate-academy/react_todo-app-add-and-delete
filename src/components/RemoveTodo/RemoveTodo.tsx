import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  todoId: number;
  setTodoId: (id: number) => void;
  setTodos: (todo: Todo[]) => void;
  setErrorNotification: (value: string) => void;
  completed: boolean;
  id: number;
  title: string;
};

export const RemoveTodo: React.FC<Props> = ({
  todos,
  todoId,
  setTodos,
  setTodoId,
  setErrorNotification,
  completed,
  id,
  title,
}) => {
  const handleClick = (deletingId:number) => {
    setTodoId(deletingId);

    const deleteTodos = async () => {
      try {
        await deleteTodo(deletingId);
        setTodos(todos.filter(todo => todo.id !== deletingId));
      } catch (error) {
        setErrorNotification('Unable to delete a todo');
      }
    };

    deleteTodos();
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div
        key={id}
        data-cy="Todo"
        className={classNames('todo', { completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">{title}</span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => handleClick(id)}
        >
          ×
        </button>
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay',
            {
              'is-active': todoId === id,
            })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};
