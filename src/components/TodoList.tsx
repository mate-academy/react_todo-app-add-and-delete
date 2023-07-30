import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  handleToggleCompleted: (id: number) => void,
  handleDeleteTodo: (id: number) => void,
  isLoadingTodoIds: number[],
  tempTodo: Todo | null,

};

export const TodoList: React.FC<Props> = ({
  todos, handleToggleCompleted, handleDeleteTodo,
  isLoadingTodoIds,
  tempTodo,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        handleToggleCompleted={handleToggleCompleted}
        handleDeleteTodo={handleDeleteTodo}
        isLoadingTodoIds={isLoadingTodoIds}
      />
    ))}

    {tempTodo !== null && (
      <TodoItem
        key={tempTodo.id}
        todo={tempTodo}
        handleToggleCompleted={handleToggleCompleted}
        handleDeleteTodo={handleDeleteTodo}
        isLoadingTodoIds={[tempTodo?.id]}
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

// {/* 'is-active' class puts this modal on top of the todo
// <div className="modal overlay is-active">
//   <div className="modal-background has-background-white-ter" />
//   <div className="loader" />
// </div> */}
