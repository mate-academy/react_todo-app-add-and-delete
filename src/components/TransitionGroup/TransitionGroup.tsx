// import React from 'react';
// import { TodoItem } from '../TodoItem';
// import { CSSTransition } from 'react-transition-group';
// import { useTodos } from '../TodosProvider';

// export const TransitionGroup: React.FC = () => {
//   const { filteredTodos, deleteTodo } = useTodos();

//   return (
//     <section className="todoapp__main" data-cy="TodoList">
//       <TransitionGroup>
//         {filteredTodos.map(todo => (
//           <CSSTransition key={todo.id} timeout={300} classNames="item">
//             <TodoItem
//               todo={todo}
//               isProcessed={processings.includes(todo.id)}
//               onDelete={() => deleteTodo(todo.id)}
//               // onUpdate={updateTodo}
//             />
//           </CSSTransition>
//         ))}

//         {creating && (
//           <CSSTransition key={0} timeout={300} classNames="temp-item">
//             <TodoItem
//               todo={{
//                 id: Math.random(),
//                 title,
//                 completed: false,
//                 userId: user.id,
//               }}
//               isProcessed
//             />
//           </CSSTransition>
//         )}
//       </TransitionGroup>
//     </section>
//   );
// };
