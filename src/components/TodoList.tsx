import React, {
  useContext, useEffect, useState,
} from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { deleteTodoItem } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorContext, ErrorsMessageContext } from './ErrorsContext';
import { IsfinallyContext, TempTodoContext } from './TempTodoContext';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  filter: string
};
export const TodoList : React.FC<Props> = ({ todos, filter }) => {
  const { tempTodo } = useContext(TempTodoContext);
  const { setIsfinally } = useContext(IsfinallyContext);
  const [clearedTodoId, setClearedTodoId] = useState<number[]>([]);
  const { setIsError } = useContext(ErrorContext);
  const { setErrorsMesage } = useContext(ErrorsMessageContext);

  useEffect(() => {
    const deletetodos = todos.filter(el => el.completed).map(el => el.id);

    setClearedTodoId(deletetodos);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const filteringTodo = () => {
    switch (filter) {
      case 'all':
        return todos;
      case 'Active':
        return todos.filter(el => el.completed === false);
      case 'Completed':

        return todos.filter(el => el.completed === true);
      case 'Clear':

        return todos.map(el => {
          if (el.completed) {
            setIsfinally(true);
            deleteTodoItem(el.id)
              .catch(() => {
                setIsError(true);
                setErrorsMesage('delete');
              })
              .finally(() => {
                setIsfinally(false);
              });
          }

          return el;
        });
      default:
        return todos;
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteringTodo().map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              filter={filter}
              clearedTodoId={clearedTodoId}
              key={todo.id}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <div
              data-cy="Todo"
              className="todo"
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

// eslint-disable-next-line no-lone-blocks
{ /* <div data-cy="Todo" className="todo completed">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          Completed Todo
        </span>

        {/* Remove button appears only on hover */ }
//   <button
//     type="button"
//     className="todo__remove"
//     onMouseDown={() => {
//       if (isError) {
//         setIsError(true);
//       }

//       setIsError(false);
//       setErrorsMesage('delete');
//     }}
//     data-cy="TodoDelete"
//   >
//     ×
//   </button>

//   {/* overlay will cover the todo while it is being updated */}
//   <div data-cy="TodoLoader" className="modal overlay">
//     <div className="modal-background has-background-white-ter" />
//     <div className="loader" />
//   </div>
// </div>

// eslint-disable-next-line no-lone-blocks
{ /* This todo is not completed */ }
// <div data-cy="Todo" className="todo">
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

// {/* This todo is being edited */}
// <div data-cy="Todo" className="todo">
//   <label className="todo__status-label">
//     <input
//       data-cy="TodoStatus"
//       type="checkbox"
//       className="todo__status"
//     />
//   </label>

// eslint-disable-next-line no-lone-blocks
{ /* This form is shown instead of the title and remove button */ }

// eslint-disable-next-line no-lone-blocks
{ /* <form
          onSubmit={e => {
            e.preventDefault();
            if (isError) {
              setIsError(true);
            }

            setIsError(false);
            setErrorsMesage('update');
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"

          />
        </form>

        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      {/* This todo is in loadind state */ }
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

//   {/* 'is-active' class puts this modal on top of the todo */}
//   <div data-cy="TodoLoader" className="modal overlay is-active">
//     <div className="modal-background has-background-white-ter" />
//     <div className="loader" />
//   </div>
// </div> */} */}
