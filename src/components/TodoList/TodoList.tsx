import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  visibaleTodos: Todo[],
  deleteTodo: (todoId: number) => void,
  tempTodo: Todo | null,
}

export const TodoList: React.FC<Props> = ({
  visibaleTodos,
  deleteTodo = () => {},
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {visibaleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={deleteTodo}
        />
      ))}

      {tempTodo !== null && (
        <TodoItem todo={tempTodo} />
      )}
    </section>
  );
};
