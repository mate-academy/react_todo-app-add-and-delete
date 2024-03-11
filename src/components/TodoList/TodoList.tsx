import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  addTodoId: number | null;
  handleDeleteTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  addTodoId,
  handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          addTodoId={addTodoId}
          handleDeleteTodo={handleDeleteTodo}
        />
      ))}
    </section>
  );
};
