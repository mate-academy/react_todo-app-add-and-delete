import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  deleteTodo: (par: number) => void;
  updateTodo: (par: Todo) => void;
  searchCompletedTodos: () => void;
  tempTodo: Todo | null;

};

export const TodoList: FC<Props> = ({
  todos,
  deleteTodo,
  updateTodo,
  searchCompletedTodos,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          todo={todo}
          searchCompletedTodos={searchCompletedTodos}
          tempTodo={tempTodo}
        />
      ))}
    </section>
  );
};
