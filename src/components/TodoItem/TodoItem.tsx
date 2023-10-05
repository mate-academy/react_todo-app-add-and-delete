import classNames from 'classnames';
import { useContext, useState } from 'react';

import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { TodosContext } from '../../TodosContext';

type Props = {
  todo: Todo,
  isProcessed?: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed = false,
}) => {
  const {
    setTodos,
    setErrorMessage,
    errorDiv,
  } = useContext(TodosContext);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlerDeleteTodo = () => {
    setIsDeleting(true);
    deleteTodo(todo.id)
      .then(() => {
        setTodos((currentTodos: Todo[]) => currentTodos
          .filter(elem => elem.id !== todo.id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        if (errorDiv.current !== null) {
          errorDiv.current.classList.remove('hidden');
          setTimeout(() => {
            if (errorDiv.current !== null) {
              errorDiv.current.classList.add('hidden');
              setErrorMessage('');
            }
          }, 3000);
        }
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    // isProcessed
    //   ? (
    //     <div data-cy="Todo" className="todo">
    //       <label className="todo__status-label">
    //         <input
    //           data-cy="TodoStatus"
    //           type="checkbox"
    //           className="todo__status"
    //         />
    //       </label>

    //       <span data-cy="TodoTitle" className="todo__title">
    //         {todo.title}
    //       </span>

    //       <button
    //         type="button"
    //         className="todo__remove"
    //         data-cy="TodoDelete"
    //       >
    //         ×
    //       </button>

    //       <div data-cy="TodoLoader" className="modal overlay is-active">
    //         <div className="modal-background has-background-white-ter" />
    //         <div className="loader" />
    //       </div>
    //     </div>
    //   )
    //   : (
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

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handlerDeleteTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isDeleting || isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
    // )
  );
};

// This todo is not completed
//   < div data - cy="Todo" className = "todo" >
//             <label className="todo__status-label">
//               <input
//                 data-cy="TodoStatus"
//                 type="checkbox"
//                 className="todo__status"
//               />
//             </label>

//             <span data-cy="TodoTitle" className="todo__title">
//               Not Completed Todo
//             </span>
//             <button
//               type="button"
//               className="todo__remove"
//               data-cy="TodoDelete"
//             >
//               ×
//             </button>

//             <div data-cy="TodoLoader" className="modal overlay">
//               <div className="modal-background has-background-white-ter" />
//               <div className="loader" />
//             </div>
//           </div >

//   {/* This todo is being edited */ }
//   < div data - cy="Todo" className = "todo" >
//     <label className="todo__status-label">
//       <input
//         data-cy="TodoStatus"
//         type="checkbox"
//         className="todo__status"
//       />
//     </label>

// {/* This form is shown instead of the title and remove button */ }
//         <form>
//           <input
//             data-cy="TodoTitleField"
//             type="text"
//             className="todo__title-field"
//             placeholder="Empty todo will be deleted"
//             value="Todo is being edited now"
//           />
//         </form>

//         <div data-cy="TodoLoader" className="modal overlay">
//           <div className="modal-background has-background-white-ter" />
//           <div className="loader" />
//         </div>
//       </div >
