import { FC } from 'react';
import { Todo } from '../../types/Todo';
import TodoItem from '../TodoItem/TodoItem';

interface ITodoList {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
}

export const TodoList: FC<ITodoList> = ({ todos, onDeleteTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
            todo={todo}
            key={todo.id}
            onDeleteTodo={onDeleteTodo}
        />
      ))}
    </section>
  );
};
