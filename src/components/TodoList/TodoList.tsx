import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  filteredTodos: Todo[],
  temporaryTodo: Todo,
  isAdding: boolean,
  todosIdsForDelete: number[],
  deleteTodoFromServer: (todoId: number) => void,
}

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  temporaryTodo,
  isAdding,
  todosIdsForDelete,
  deleteTodoFromServer,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {filteredTodos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isAdding={isAdding}
        todosIdsForDelete={todosIdsForDelete}
        deleteTodoFromServer={deleteTodoFromServer}
      />
    ))}

    {isAdding && (
      <TodoItem
        todo={temporaryTodo}
        isAdding={isAdding}
        todosIdsForDelete={todosIdsForDelete}
        deleteTodoFromServer={deleteTodoFromServer}
      />
    )}
  </section>
);
