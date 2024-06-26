// /* eslint-disable jsx-a11y/label-has-associated-control */
// /* eslint-disable jsx-a11y/control-has-associated-label */
// import React, { useMemo } from 'react';
// import { CSSTransition } from 'react-transition-group';
// import { SelectedFilter } from '../../types/SelectedFilter';
// import { Todo } from '../../types/Todo';
// import { TodoItem } from '../TodoItem/TodoItem';

// type Props = {
//   todos: Todo[];
//   onChangeCheckbox: (id: number) => void | undefined;
//   onDelete: (todoId: number) => Promise<void>;
//   loadingIds: number[];
//   filter: SelectedFilter;
// };

// export const TodoList: React.FC<Props> = ({
//   todos,
//   onChangeCheckbox,
//   onDelete,
//   loadingIds,
//   filter,
// }) => {
//   const filteredTodos = useMemo(() => {
//     switch (filter) {
//       case SelectedFilter.ACTIVE:
//         return todos.filter(todo => !todo.completed);

//       case SelectedFilter.COMPLETED:
//         return todos.filter(todo => todo.completed);

//       default:
//         return todos;
//     }
//   }, [filter, todos]);

//   return filteredTodos.map((todo: Todo) => (
//     <CSSTransition key={todo.id} timeout={300} classNames="item">
//       <TodoItem
//         todo={todo}
//         onChangeCheckbox={onChangeCheckbox(todo.id)}
//         onDelete={onDelete}
//         loadingIds={loadingIds}
//       />
//     </CSSTransition>
//   ));
// };
