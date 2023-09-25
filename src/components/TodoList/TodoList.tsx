import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

interface Props {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export const TodoList: React.FC<Props> = ({ todos, setTodos, setError }) => {
  const deleteTodoHandler = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        setTodos(prevState => (
          prevState.filter(todo => todo.id !== todoId)
        ));
      })
      .catch(() => {
        setError('Unable to delete a todo');

        setTimeout(() => {
          setError('');
        }, 3000);
      });
  };

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
            onChange={() => deleteTodoHandler(todo.id)}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being updated */}
          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
