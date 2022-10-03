import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  todoId: number;
  setTodoId: (id: number) => void;
  setTodos: (todo: Todo[]) => void;
  setHasLoadingError: (value: boolean) => void;
  setErrorNotification: (value: string) => void;
  setIsLoading: (value: boolean) => void;
  isLoading: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todoId,
  setTodos,
  setTodoId,
  setHasLoadingError,
  setErrorNotification,
  setIsLoading,
  isLoading,
}) => {
  const handleClick = (id:number) => {
    setIsLoading(true);
    setTodoId(id);

    const deleteTodos = async () => {
      setIsLoading(true);
      try {
        await deleteTodo(id);
        setTodos(todos.filter(todo => todo.id !== id));
      } catch (error) {
        setHasLoadingError(true);
        setErrorNotification('Unable to delete a todo');
      }
    };

    deleteTodos();
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      { todos.map(({ title, completed, id }) => (
        <div
          data-cy="Todo"
          key={id}
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
          {isLoading && (
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
          )}

        </div>
      ))}
    </section>
  );
};
