import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  removeTodo: (todo: Todo) => void
  tempTodo: Todo | null;
  completedTodos: Todo[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  completedTodos,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
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
        />
      )}
    </section>
  );
};
