import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { Status } from '../../types/Status';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  statusFilter: Status;
  setErrorMessage: (errorMessage: string) => void;
  loadingTodoIds: number[];
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  statusFilter,
  setTodos,
  setErrorMessage,
  loadingTodoIds,
  setLoadingTodoIds,
  tempTodo,
}) => {
  const filteredTodos = useMemo(() => {
    switch (statusFilter) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);

      case Status.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [statusFilter, todos]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          loadingTodoIds={loadingTodoIds}
          setLoadingTodoIds={setLoadingTodoIds}
        />
      ))}

      {tempTodo !== null && (
        <TodoItem
          todo={tempTodo}
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          loadingTodoIds={loadingTodoIds}
          setLoadingTodoIds={setLoadingTodoIds}
        />
      )}
    </section>
  );
};
