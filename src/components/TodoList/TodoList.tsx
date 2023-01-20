import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[]
  removeTodo: Todo[],
  handleDeleteClick: (todo: Todo) => void,
  isActive: boolean,
};

export const TodoList: React.FC<Props> = memo((props) => {
  const { todos, isActive, handleDeleteClick } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          isActive={isActive}
          handleDeleteClick={handleDeleteClick}
        />
      ))}
    </section>
  );
});
