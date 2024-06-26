import { Dispatch, FC } from 'react';

import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';
import { getFilteredTodos } from '../utils/getFilteredTodos';

interface Props {
  todos: Todo[];
  selectedStatus: Status;
  tempTodo: Todo | null;
  onErrorMessage: (message: string) => void;
  setTodos: Dispatch<React.SetStateAction<Todo[]>>;
  setDeletingId: Dispatch<React.SetStateAction<number>>;
  deletingId: number;
}

const TodoList: FC<Props> = ({
  todos,
  selectedStatus,
  tempTodo,
  onErrorMessage,
  setTodos,
  setDeletingId,
  deletingId,
}) => {
  const filteredTodos = getFilteredTodos(todos, selectedStatus);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onErrorMessage={onErrorMessage}
          setTodos={setTodos}
          setDeletingId={setDeletingId}
          deletingId={deletingId}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onErrorMessage={onErrorMessage}
          setTodos={setTodos}
          setDeletingId={setDeletingId}
          deletingId={deletingId}
        />
      )}
    </section>
  );
};

export default TodoList;
