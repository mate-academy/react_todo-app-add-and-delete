import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  removeTodo: (todo: Todo) => void
  tempTodo: Todo | null;
  completedTodos: Todo[];
  updateTodoStatus: (isCompleted: boolean, todo: Todo) => void;
  updateTodoTitle: (title: string, todo: Todo) => void;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  removeTodo,
  completedTodos,
  updateTodoStatus,
  updateTodoTitle,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          updateTodoStatus={updateTodoStatus}
          updateTodoTitle={updateTodoTitle}
          tempTodoId={completedTodos.includes(todo)
            || (tempTodo?.id === todo.id)
            ? todo.id
            : null}
        />
      ))}
      {tempTodo?.id === 0 && (
        <TodoInfo
          todo={tempTodo}
          removeTodo={removeTodo}
          tempTodoId={tempTodo.id}
          updateTodoStatus={updateTodoStatus}
          updateTodoTitle={updateTodoTitle}
        />
      )}
    </section>
  );
});
