/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  removeTodo: (todoId: number) => void;
  todoOnLoading: number[] | null;
  handleToggle: (id: number) => void;
};

export const TodoList: FC<Props> = ({
  filteredTodos,
  removeTodo,
  todoOnLoading,
  handleToggle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          todoOnLoading={todoOnLoading}
          handleToggle={handleToggle}
        />
      ))}
    </section>
  );
};

//
//
// On edit
//
//
{
  /* <div data-cy="Todo" className="todo">
  <label className="todo__status-label">
    <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
  </label>
*/
}

//This form is shown instead of the title and remove button
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
// </div>;

//
//
// While is loading
//
//

{
  /* This todo is in loadind state */
}

{
  /* <div data-cy="Todo" className="todo">
  <label className="todo__status-label">
    <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
  </label>

  <span data-cy="TodoTitle" className="todo__title">
    Todo is being saved now
  </span>

  <button type="button" className="todo__remove" data-cy="TodoDelete">
    ×
  </button>

  {/* 'is-active' class puts this modal on top of the todo */
}
// <div data-cy="TodoLoader" className="modal overlay is-active">
//   <div className="modal-background has-background-white-ter" />
//   <div className="loader" />
// </div>
// </div>;
