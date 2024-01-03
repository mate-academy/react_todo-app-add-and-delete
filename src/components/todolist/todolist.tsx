import classNames from 'classnames';
import { useTodos } from '../../context/todoProvider';
import { deleteTodo } from '../../api/todos';
import { ErrorType } from '../../types/Error';
import { TodoItem } from '../todoItem/todoItem';
import { Todo } from '../../types/Todo';

export const TodoList = () => {
  const {
    visibleTasks, setError, tempTodo,
    setTodos, deletingTask, setDeletingTask,
    isAddingTask,
  } = useTodos();

  const handleDeleteClick = (id: number) => {
    setError(null);
    const currentid = id;

    setDeletingTask([...deletingTask, id]);

    deleteTodo(id)
      .then(() => {
        setTodos((currentTodos: Todo[]) => {
          return currentTodos.filter(task => task.id !== id);
        });
      })
      .catch(() => {
        setError(ErrorType.delete);
      })
      .finally(() => setDeletingTask((currentId: number[]) => {
        return currentId.filter(taskId => taskId !== currentid);
      }));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTasks.map(task => (
        <TodoItem
          task={task}
          handleDeleteClick={handleDeleteClick}
        />
      ))}
      {tempTodo !== null
      && (
        <div key={tempTodo.id} data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': isAddingTask,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ) }
    </section>
  );
};
