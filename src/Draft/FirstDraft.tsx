// /* eslint-disable jsx-a11y/label-has-associated-control */
// /* eslint-disable jsx-a11y/control-has-associated-label */
// import React, { useEffect, useState } from 'react';
// import { UserWarning } from './UserWarning';
// import * as todosApi from './api/todos';
// import { Todo } from './types/Todo';
// import cn from 'classnames';
// import { Status } from './types/Status';
// import { getFilterTodos } from './utils/getFilterTodos';

// export const App: React.FC = () => {
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [titles, setTitles] = useState('');
//   const [errorMessage, setErrorMessage] = useState<string>('');
//   const [filter, setFilter] = useState<Status>(Status.All);

//   useEffect(() => {
//     todosApi
//       .getTodos()
//       .then(setTodos)
//       .catch(() => {
//         setErrorMessage(`Unable to load todos`);
//         setTimeout(() => setErrorMessage(''), 3000);
//       });
//   }, []);

//   function addTodo({ title, completed, userId }: Todo) {
//     todosApi.createTodos({ title, completed, userId }).then(newTodo => {
//       setTodos(currentTodos => {
//         return [...currentTodos, newTodo];
//       });
//     });
//   }

//   const visibleTodos = getFilterTodos([...todos], filter);

//   const getMaxTodoId = (todo: Todo[]) => {
//     const ids = todo.map(item => item.id);

//     return Math.max(...ids, 0);
//   };

//   const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setTitles(event.target.value);
//   };

//   const handleSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     addTodo({
//       id: getMaxTodoId(todos) + 1,
//       title: titles,
//       completed: false,
//       userId: getMaxTodoId(todos) + 1,
//     });

//     setTitles('');
//   };

//   if (!todosApi.USER_ID) {
//     return <UserWarning />;
//   }

//   return (
//     <div className="todoapp">
//       <h1 className="todoapp__title">todos</h1>

//       <div className="todoapp__content">
//         <header className="todoapp__header">
//           {/* this button should have `active` class only if all todos are completed */}
//           <button
//             type="button"
//             className="todoapp__toggle-all active"
//             data-cy="ToggleAllButton"
//           />

//           {/* Add a todo on form submit */}
//           <form onSubmit={handleSubmit}>
//             <input
//               data-cy="NewTodoField"
//               type="text"
//               className="todoapp__new-todo"
//               placeholder="What needs to be done?"
//               value={titles}
//               onChange={handleTitleChange}
//             />
//           </form>
//         </header>

//         <section className="todoapp__main" data-cy="TodoList">
//           {visibleTodos.map(todo => (
//             //  This is a completed todo
//             <div
//               data-cy="Todo"
//               className={cn('todo', { completed: todo.completed })}
//               key={todo.id}
//             >
//               <label className="todo__status-label">
//                 <input
//                   data-cy="TodoStatus"
//                   type="checkbox"
//                   className="todo__status"
//                 />
//               </label>

//               <span data-cy="TodoTitle" className="todo__title">
//                 {todo.title}
//               </span>

//               {/* Remove button appears only on hover */}
//               <button
//                 type="button"
//                 className="todo__remove"
//                 data-cy="TodoDelete"
//               >
//                 ×
//               </button>

//               {/* overlay will cover the todo while it is being deleted or updated */}
//               <div data-cy="TodoLoader" className="modal overlay">
//                 <div className="modal-background has-background-white-ter" />
//                 <div className="loader" />
//               </div>
//             </div>
//           ))}

//           {/* This todo is an active todo */}
//           {/* <div data-cy="Todo" className="todo">
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
//             <button type="button" className="todo__remove" data-cy="TodoDelete">
//               ×
//             </button>

//             <div data-cy="TodoLoader" className="modal overlay">
//               <div className="modal-background has-background-white-ter" />
//               <div className="loader" />
//             </div>
//           </div> */}

//           {/* This todo is being edited */}
//           {/* <div data-cy="Todo" className="todo">
//             <label className="todo__status-label">
//               <input
//                 data-cy="TodoStatus"
//                 type="checkbox"
//                 className="todo__status"
//               />
//             </label> */}

//           {/* This form is shown instead of the title and remove button */}
//           {/* <form>
//               <input
//                 data-cy="TodoTitleField"
//                 type="text"
//                 className="todo__title-field"
//                 placeholder="Empty todo will be deleted"
//                 value="Todo is being edited now"
//               />
//             </form>

//             <div data-cy="TodoLoader" className="modal overlay">
//               <div className="modal-background has-background-white-ter" />
//               <div className="loader" />
//             </div>
//           </div> */}

//           {/* This todo is in loadind state */}
//           {/* <div data-cy="Todo" className="todo">
//             <label className="todo__status-label">
//               <input
//                 data-cy="TodoStatus"
//                 type="checkbox"
//                 className="todo__status"
//               />
//             </label>

//             <span data-cy="TodoTitle" className="todo__title">
//               Todo is being saved now
//             </span>

//             <button type="button" className="todo__remove" data-cy="TodoDelete">
//               ×
//             </button> */}

//           {/* 'is-active' class puts this modal on top of the todo */}
//           {/* <div data-cy="TodoLoader" className="modal overlay is-active">
//               <div className="modal-background has-background-white-ter" />
//               <div className="loader" />
//             </div> */}
//           {/* </div> */}
//         </section>

//         {/* Hide the footer if there are no todos */}
//         {visibleTodos.length > 0 && (
//           <footer className="todoapp__footer" data-cy="Footer">
//             <span className="todo-count" data-cy="TodosCounter">
//               {`${visibleTodos.length} items left`}
//             </span>

//             {/* Active link should have the 'selected' class */}
//             <nav className="filter" data-cy="Filter">
//               {Object.values(Status).map(state => (
//                 <a
//                   key={state}
//                   href="#/"
//                   className={cn('filter__link', { selected: state === filter })}
//                   data-cy={`filter__link ${state}`}
//                   onClick={() => setFilter(state)}
//                 >
//                   {state}
//                 </a>
//               ))}
//             </nav>

//             {/* this button should be disabled if there are no completed todos */}
//             <button
//               type="button"
//               className="todoapp__clear-completed"
//               data-cy="ClearCompletedButton"
//             >
//               Clear completed
//             </button>
//           </footer>
//         )}
//       </div>

//       {/* DON'T use conditional rendering to hide the notification */}
//       {/* Add the 'hidden' class to hide the message smoothly */}
//       <div
//         data-cy="ErrorNotification"
//         // className="notification is-danger is-light has-text-weight-normal"
//         className={cn(
//           'notification is-danger is-light has-text-weight-normal',
//           { hidden: !errorMessage },
//         )}
//       >
//         <button
//           data-cy="HideErrorButton"
//           type="button"
//           className="delete"
//           onClick={() => setErrorMessage('')}
//         />
//         {errorMessage}
//       </div>
//     </div>
//   );
// };

// {
//   /* Unable to load todos
//         <br />
//         Title should not be empty
//         <br />
//         Unable to add a todo
//         <br />
//         Unable to delete a todo
//         <br />
//         Unable to update a todo */
// }
