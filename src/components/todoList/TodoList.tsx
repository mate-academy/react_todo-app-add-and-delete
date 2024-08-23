import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../todoItem/TodoItem';

interface Props {
  todoList: Todo[];
  tempTodo: Todo | null;
}

export const TodoList: FC<Props> = ({ todoList, tempTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
