import { useEffect } from 'react';
import { deleteTodo } from '../api/todos';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

interface TodoListProps {
  todos: Todo[],
  filter: Filter,
  tempTodo: Todo | null,
  handleError: (error: string) => void,
  isUpdating: boolean,
  handleIsUpdating: (status: boolean) => void,
  updatingIds: number[],
  handleUpdatingIds: (ids: number[]) => void,
  handleLoadTodos: () => void,
}

export const TodoList = ({
  todos, filter, tempTodo, handleError, handleLoadTodos,
  isUpdating, handleIsUpdating, updatingIds, handleUpdatingIds,
}: TodoListProps) => {
  useEffect(() => {
    handleLoadTodos();
  }, [isUpdating]);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.All:
        return true;
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        throw new Error('wrong filter selected');
    }
  });

  const handleDelete = (id: number) => {
    handleIsUpdating(true);
    handleUpdatingIds([id]);
    deleteTodo(id)
      .then(() => handleIsUpdating(false))
      .catch(() => handleError('Unable to delete a todo'));
  };

  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => {
        const {
          id, title, completed,
        } = todo;

        return (
          <div className={`todo ${completed ? 'completed' : ''}`} key={id}>
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                // checked={completed}
              />
            </label>

            <span className="todo__title">{title}</span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDelete(id)}
            >
              ×
            </button>

            {/* overlay will cover the todo while it is being updated */}
            <div className={`modal overlay ${isUpdating && updatingIds.includes(id) ? 'is-active' : ''}`}>
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
