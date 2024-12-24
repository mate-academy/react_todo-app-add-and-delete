import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodoHandler: (todoId: number) => Promise<void>;
  todoIdsToDel: number[];
};

export const TodoList: FC<Props> = props => {
  const { todos, tempTodo, deleteTodoHandler, todoIdsToDel } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodoHandler={deleteTodoHandler}
          isLoading={todoIdsToDel.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading
          deleteTodoHandler={deleteTodoHandler}
        />
      )}
    </section>
  );
};
