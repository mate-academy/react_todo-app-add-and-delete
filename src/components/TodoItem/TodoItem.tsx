import cn from 'classnames';
import { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { TodoContext } from '../TodoContext/TodoContext';

interface Props{
  todo: Todo,
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    setError, setTodos, loading, setLoading,
  } = useContext(TodoContext);

  const handleDelete = (todoId: number) => {
    setLoading([todoId]);

    deleteTodo(todoId)
      .catch(() => setError('Unable to delete a todo'))
      .then(response => {
        if (response) {
          setTodos(currentTodos => (
            currentTodos.filter(currTodo => currTodo.id !== todoId)
          ));
        }

        setLoading([]);
      });
  };

  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={cn('modal overlay',
        { 'is-active': loading.includes(todo.id) })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
