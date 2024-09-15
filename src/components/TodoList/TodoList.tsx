/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC } from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { useTodos } from '../../providers';

export const TodoList: FC = () => {
  const { filteredTodos: todos, tempTodo } = useTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
