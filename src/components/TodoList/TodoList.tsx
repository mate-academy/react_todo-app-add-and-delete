/* eslint-disable jsx-a11y/label-has-associated-control */
// // TodoList.tsx
// import React from 'react';
// import { TodoItem } from '../TodoItem/TodoItem';

// interface TodoListProps {
//   filteredTodos: { id: number; title: string; completed: boolean }[];
//   TodoDeleteButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
//   loadingTodoId: number | null;
// }

// export const TodoList: React.FC<TodoListProps> = ({
//   filteredTodos,
//   TodoDeleteButton,
//   loadingTodoId,
// }) => (
//   <section className="todoapp__main" data-cy="TodoList">
//     {filteredTodos.map(todo => (
//       <TodoItem
//         key={todo.id}
//         todo={todo}
//         TodoDeleteButton={TodoDeleteButton}
//         loadingTodoId={loadingTodoId}
//       />
//     ))}
//   </section>
// );

import React from 'react';
import TodoItem from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import TempTodo from '../TempTodo/TempTodo';

interface TodoListProps {
  filteredTodos: Todo[];
  tempTodo: { id: number; title: string; completed: boolean } | null;
  handleDeleteTodo: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loadingTodoId: number | null;
}
const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  tempTodo,
  handleDeleteTodo,
  loadingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          loadingTodoId={loadingTodoId}
        />
      ))}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};

export default TodoList;
