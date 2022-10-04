// import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

// import { removeTodo } from '../../api/todos';

import { Todo } from '../../types/Todo';

type Props = {
  filteredTodos: Todo[]
  // deleteTodo: (todoId: number) => void
  deleteTodo2: (todoId: number) => void
  selectedTodoId: number | null
  // loader: number | null
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  // deleteTodo,
  selectedTodoId,
  // loader,
  deleteTodo2,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        const {
          completed,
          id,
          title,
        } = todo;

        return (

          <div
            data-cy="Todo"
            className={classNames('todo', {
              'item-enter-done': !completed,
              completed,
            })}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                defaultChecked
              />
            </label>

            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {!title ? 'Empty todo' : title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              // сюда ремув тудушек и use callback
              // onClick={() => deleteTodo(todo.id)}
              onClick={() => deleteTodo2(todo.id)}
            >
              ×
            </button>

            {/* {selectedTodoId === todo.id || loader === todo.id ? ( */}
            { selectedTodoId === todo.id ? (
              <div
                data-cy="TodoLoader"
                // className={classNames('overlay is-flex is-justify-content-center is-align-items-center', {
                //   // modal: !showLoader,
                //   // modal: showLoader,
                //   // completed,
                // })}
                className="
                 overlay
                 is-flex
                 is-justify-content-center
                 is-align-items-center
                "
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
              // вместо нал 2й вариант верстки мне не помог
              // сделать через оператор &&
            ) : null}
          </div>
        );
      })}
    </section>
  );
};

// return (

//   <div
//     data-cy="Todo"
//     className={classNames('todo', {
//       'item-enter-done': !completed,
//       completed,
//     })}
//     key={id}
//   >
//     {/* {delTodoWithLoader ? (
//       <div
//         data-cy="TodoLoader"
//         className={classNames('overlay', {
//           // modal: !showLoader,
//           modal: showLoader,
//           completed,
//         })}
//       >
//         <div className="modal-background has-background-white-ter" />
//         <div className="loader" />
//       </div>
//     ) : null} */}
//     <label className="todo__status-label">
//       <input
//         data-cy="TodoStatus"
//         type="checkbox"
//         className="todo__status"
//         defaultChecked
//       />
//     </label>

//     <span
//       data-cy="TodoTitle"
//       className="todo__title"
//     >
//       {!title ? 'Empty todo' : title}
//     </span>
//     <button
//       type="button"
//       className="todo__remove"
//       data-cy="TodoDeleteButton"
//       onClick={() => deleteTodo(todo.id)}
//     >
//       ×
//     </button>

//     {/* класс  modal отвечает за скрытие крутилки */}
//     {/* <div data-cy="TodoLoader" className="modal overlay"> */}

//     {/* так лоудер не генерится но у меня filteredTodos сначала пустой а потом с объектами */}
//     {/* так что неясно что я отслеживаю */}
//     {/* {!filteredTodos ? ( */}
//     {/* смог выбрать конкретную тудушку но стили прогружаються одовременно а мне надо чтобы 3 сек только лоудер был */}
//     {/* можно в сет тайм аут обернуть верстку но тогда при быстром интернете и без имитации медленного оно будет грузиться как на медленном интернете */}
//     {/* может сделать стейт и в фетч цепь кинуть и его сюда через оператор и кинуть как условие */}
//     {selectedTodoId === todo.id ? (
//       <div
//         data-cy="TodoLoader"
//         className={classNames('overlay', {
//           // modal: !showLoader,
//           modal: showLoader,
//           completed,
//         })}
//       >
//         <div className="modal-background has-background-white-ter" />
//         <div className="loader" />
//       </div>
//     ) : null}
//   </div>
// );

// проблема что лоудер так и не насредине а тудушка быстро исчезает
// return (
//   <div
//     data-cy="Todo"
//     className={classNames('todo', {
//       'item-enter-done': !completed,
//       completed,
//     })}
//     key={id}
//   >
//     {selectedTodoId === todo.id ? (
//       <div
//         data-cy="TodoLoader"
//         className={classNames('overlay', {
//           // modal: !showLoader,
//           modal: showLoader,
//           completed,
//         })}
//       >
//         <div className="modal-background has-background-white-ter" />
//         <div className="loader" />
//       </div>
//     ) : (
//       <>
//         <label className="todo__status-label">
//           <input
//             data-cy="TodoStatus"
//             type="checkbox"
//             className="todo__status"
//             defaultChecked
//           />
//         </label>

//         <span
//           data-cy="TodoTitle"
//           className="todo__title"
//         >
//           {!title ? 'Empty todo' : title}
//         </span>
//         <button
//           type="button"
//           className="todo__remove"
//           data-cy="TodoDeleteButton"
//           onClick={() => deleteTodo(todo.id)}
//         >
//           ×
//         </button>
//       </>
//     )}
//   </div>
// );
