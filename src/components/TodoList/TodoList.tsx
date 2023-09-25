import classNames from 'classnames';
import { Todo } from '../../types/Todo';
// import { deleteTodo } from '../../api/todos';

interface Props {
  todos: Todo[];
  onTodoDelete: (todoId: number) => void;
  // isLoading: boolean;
  loadingTodoIds: number[],
  // setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  // setError: React.Dispatch<React.SetStateAction<string>>;
  // newTodoField: React.RefObject<HTMLInputElement>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  // setTodos,
  // setError,
  // newTodoField,
  onTodoDelete,
  // isLoading,
  loadingTodoIds,
}) => {
  // const deleteTodoHandler = (todoId: number) => {
  //   deleteTodo(todoId)
  //     .then(() => {
  //       setTodos(prevState => (
  //         prevState.filter(todo => todo.id !== todoId)
  //       ));

  //       newTodoField.current?.focus();
  //     })
  //     .catch(() => {
  //       setError('Unable to delete a todo');

  //       setTimeout(() => {
  //         setError('');
  //       }, 3000);
  //     });
  // };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed: todo.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
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
            onClick={() => onTodoDelete(todo.id)}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being updated */}
          <div
            data-cy="TodoLoader"
            className={classNames('modal',
              'overlay', {
                'is-active': loadingTodoIds.includes(todo.id),
              })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
