import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  USER_ID: number;
};

export const TodoCard: React.FC<Props> = ({
  todo,
  todos,
  deleteTodo,
  setTodos,
  USER_ID,
}) => {
  const handleCheckbox = () => {
    const newTodo: Todo = {
      id: todo.id,
      title: todo.title,
      userId: USER_ID,
      completed: !todo.completed,
    };
    const newTodos = [...todos];
    const index = newTodos.findIndex(currentTodo => (
      currentTodo.id === newTodo.id));

    newTodos.splice(index, 1, newTodo);

    updateTodoItems(newTodo)
      .then(() => setTodos(newTodos));
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckbox}
        />
      </label>
      
    const TodoItem = ({ todo, deleteTodo }) => {
    const { id, title } = todo;
      
      return (
    <div>
      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
