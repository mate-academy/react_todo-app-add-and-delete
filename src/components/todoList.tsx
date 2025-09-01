import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './todoItem';
// import { ErrorMesagges } from '../types/enums';
// import { deleteTodos } from '../api/todos';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => Promise<void>;
  deletingIds: number[] | null;

  setDeletingIds?: React.Dispatch<React.SetStateAction<number[] | []>>;
};

const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  onDelete,
  deletingIds,
  setDeletingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          deletingIds={deletingIds}
          setDeletingIds={setDeletingIds}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} key={tempTodo.id} />}
    </section>
  );
};

export default TodoList;
