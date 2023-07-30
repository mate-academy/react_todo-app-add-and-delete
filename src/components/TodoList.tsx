import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  isLoadingTodoIds: number[],
  handleToggleCompleted: (id: number) => void,
  handleDeleteTodo: (id: number) => void,

};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isLoadingTodoIds,
  handleToggleCompleted,
  handleDeleteTodo,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoadingTodoIds={isLoadingTodoIds}
        handleToggleCompleted={handleToggleCompleted}
        handleDeleteTodo={handleDeleteTodo}
      />
    ))}

    {tempTodo !== null && (
      <TodoItem
        key={tempTodo.id}
        todo={tempTodo}
        isLoadingTodoIds={[tempTodo?.id]}
        handleToggleCompleted={handleToggleCompleted}
        handleDeleteTodo={handleDeleteTodo}
      />
    )}

  </section>
);

// {/* This edited form is shown instead of the title and remove button
// <form>
//   <input
//     type="text"
//     className="todo__title-field"
//     placeholder="Empty todo will be deleted"
//     value="Todo is being edited now"
//   />
// </form> */}
