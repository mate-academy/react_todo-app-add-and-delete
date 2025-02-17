import React from 'react';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { FilteredTodos } from '../../utils/filteredTodos';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  filterBy: Status;
  handleDeleteTodo: (id: number) => void;
  loadingTodos: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  filterBy,
  handleDeleteTodo,
  loadingTodos,
}) => {
  const filteredTodos = FilteredTodos(todos, filterBy);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={loadingTodos.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={loadingTodos.includes(0)}
          handleDeleteTodo={() => {}}
        />
      )}
    </section>
  );
};
