/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { TodoMain } from './components/TodoMain/TodoMain';

export const App: React.FC = () => {
  return <TodoMain />;
};

//#region Part One
// import React from 'react';
// import { useEffect, useState } from 'react';
// import { ITodo } from './types/todo';
// import { getTodos } from './api/todos';
// import { TodoItemList } from './components/TodoItemList/TodoItemList';
// import { Footer } from './components/Footer/Footer';
// import { Status } from './types/status';
// import cn from 'classnames';
// import { Header } from './components/Header/Header';
// import { ErrorMessage } from './types/errorMessage';
// import { todo } from 'node:test';

// export const App: React.FC = () => {
//   const [todos, setTodos] = useState<ITodo[]>([]);
//   const [filteredTodos, setFilteredTodos] = useState<ITodo>(todos);
//   const [filterStatus, setFilterStatus] = useState<Status>(Status.All);
//   const [errorMessage, setErrorMessage] = useState('');

//   useEffect(() => {
//     getTodos()
//       .then(setTodos)
//       .catch(() => {
//         setErrorMessage(ErrorMessage.loadError);
//         setTimeout(() => setErrorMessage(''), 3000);
//       })
//   }, []);

//   const filterTodo = () => {
//     switch (filterStatus) {
//       case Status.Active:
//         return setFilteredTodos(todos.filter((todo: ITodo) => !todo.completed));
//       case Status.Completed:
//         return setFilteredTodos(todos.filter(todo: ITodo) => todo.completed);
//       default:
// return setFilteredTodos(todos);
//     }
//   };

// return (
//   <div className="todoapp">
//     <h1 className="todoapp__title">todos !!!!</h1>

//     <div className="todoapp__content">
//       <Header />
//       <TodoItemList todos={todos} />

//       {!!todos.length && (
//         <Footer
//           filterStatus={filterStatus}
//           setFilterStatus={setFilterStatus}
//           todos={todos}
//         />
//       )}

//     </div>

//     <div
//       data-cy="ErrorNotification"
//       className={cn(
//         'notification',
//         'is-danger',
//         'is-light',
//         'has-text-weight-normal',
//         { hidden: !errorMessage }
//       )}
//     >
//       <button
//         data-cy="HideErrorButton"
//         type="button"
//         className="delete"
//         onClick={() => setErrorMessage('')}
//       />
//       {errorMessage}
//     </div>
//   </div>
// );
// };

// import classNames from 'classnames';
// import { ITodo } from '../../types/todo';
// import { deleteTodo } from '../../api/todos';
// import { title } from 'process';

// interface TodoItemProps extends ITodo { }

// export const TodoItem: React.FC<TodoItemProps> = ({ completed, id, item }) => {
//   const onTodoDelete = () => {
//     deleteTodo(id);
//   }

//   return (
//     <div
//       data-cy="Todo"
//       className={classNames('todo', { completed: completed })}
//     >
//       <label className="todo__status-label">
//         <input
//           data-cy="TodoStatus"
//           type="checkbox"
//           className="todo__status"
//           checked={completed}
//         />
//       </label>

//       <span data-cy="TodoTitle" className="todo__title">
//         {title}
//       </span>
//       <button
//         type="button"
//         className="todo__remove"
//         data-cy="TodoDelete"
//         onClick={onTodoDelete}
//       >
//         ×
//       </button>

//       <div data-cy="TodoLoader" className="modal overlay">
//         <div className="modal-background has-background-white-ter" />
//         <div className="loader" />
//       </div>
//     </div>
//   );
// };
