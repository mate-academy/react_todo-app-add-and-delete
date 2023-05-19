import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onDelete: (todoToDelete: Todo) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
}) => {
  const createTodo = tempTodo?.id === 0;

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
        />
      ))}

      {createTodo && (
        <TodoInfo
          todo={tempTodo}
          tempTodoId={tempTodo.id}
        />
      )}
    </section>
  );
};
