// import { TodoInfo } from '../todoinfo/todoinfo';
import classNames from 'classnames';
import { useTodos } from '../../context/todoProvider';
import { deleteTodo } from '../../api/todos';
import { ErrorType } from '../../types/Error';

export const TodoList = () => {
  const {
    visibleTasks, setError, tempTodo, todos,
    setTodos, deletingTask, setDeletingTask,
    isAddingTask,
  } = useTodos();

  const handleDeleteClick = (id: number) => {
    const deletingId = [...deletingTask, id];

    setDeletingTask(deletingId);
    deleteTodo(id)
      .then(() => {
        const filteredTodo = todos.filter(task => task.id !== id);

        setTodos(filteredTodo);
      })
      .catch(() => {
        setError(ErrorType.Delete);
      })
      .finally(() => setDeletingTask([]));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* <TodoInfo /> */}
      {visibleTasks.map(task => (
        <div
          key={task.id}
          data-cy="Todo"
          className={classNames('todo', {
            completed: task.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={task.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {task.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteClick(task.id)}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being updated */}
          <div
            data-cy="TodoLoader"
            // className="modal overlay"
            className={classNames('modal overlay', {
              'is-active': deletingTask.includes(task.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
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
// This todo is not completed
//   <div data-cy="Todo" className="todo">
//   <label className="todo__status-label">
//     <input
//       data-cy="TodoStatus"
//       type="checkbox"
//       className="todo__status"
//     />
//   </label>

//   <span data-cy="TodoTitle" className="todo__title">
//     Not Completed Todo
//   </span>
//   <button type="button" className="todo__remove" data-cy="TodoDelete">
//     ×
//   </button>

//   <div data-cy="TodoLoader" className="modal overlay">
//     <div className="modal-background has-background-white-ter" />
//     <div className="loader" />
//   </div>
// </div>

// This todo is being edited
// <div data-cy="Todo" className="todo">
//   <label className="todo__status-label">
//     <input
//       data-cy="TodoStatus"
//       type="checkbox"
//       className="todo__status"
//     />
//   </label>

// This form is shown instead of the title and remove button
//   <form>
//     <input
//       data-cy="TodoTitleField"
//       type="text"
//       className="todo__title-field"
//       placeholder="Empty todo will be deleted"
//       value="Todo is being edited now"
//     />
//   </form>

//   <div data-cy="TodoLoader" className="modal overlay">
//     <div className="modal-background has-background-white-ter" />
//     <div className="loader" />
//   </div>
// </div>

// This todo is in loadind state
// <div data-cy="Todo" className="todo">
//   <label className="todo__status-label">
//     <input
//       data-cy="TodoStatus"
//       type="checkbox"
//       className="todo__status"
//     />
//   </label>

//   <span data-cy="TodoTitle" className="todo__title">
//     Todo is being saved now
//   </span>

//   <button type="button" className="todo__remove" data-cy="TodoDelete">
//     ×
//   </button>

// 'is-active' class puts this modal on top of the todo
//   <div data-cy="TodoLoader" className="modal overlay is-active">
//     <div className="modal-background has-background-white-ter" />
//     <div className="loader" />
//   </div>
// </div>
