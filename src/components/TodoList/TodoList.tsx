// import { Todo } from '../../types/Todo';
// import classNames from 'classnames';

// interface TodoListProps {
//   todo: Todo;
//   loadingTodo: boolean;
//   handleDelete: (todoId: number) => void;
// }

// export const TodoList: React.FC<TodoListProps> = ({
//   todo,
//   loadingTodo,
//   handleDelete,
// }) => {
//   // #id
//   const checkboxId = `todo-status-${todo.id}`;

//   return (
//     <div data-cy="Todo" className={todo.completed ? 'todo completed' : 'todo'}>
//       <label className="todo__status-label" htmlFor={checkboxId}>
//         {/* <label> */}
//         <input
//           data-cy="TodoStatus"
//           type="checkbox"
//           className="todo__status"
//           checked={todo.completed}
//           id={checkboxId}
//         />
//       </label>
//       <span data-cy="TodoTitle" className="todo__title">
//         {todo.title}
//       </span>

//       <button
//         type="button"
//         className="todo__remove"
//         data-cy="TodoDelete"
//         onClick={() => {
//           handleDelete(todo.id);
//         }}
//       >
//         ×
//       </button>

//       <div
//         data-cy="TodoLoader"
//         className={classNames('modal overlay', { 'is-active': loadingTodo })}
//       >
//         <div className="modal-background has-background-white-ter" />
//         <div className="loader" />
//       </div>
//     </div>
//   );
// };
