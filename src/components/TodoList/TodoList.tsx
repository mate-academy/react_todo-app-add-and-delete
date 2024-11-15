import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { FC } from 'react';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<Errors>>;
  deleteTodoId: number[];
  setDeleteTodoId: React.Dispatch<React.SetStateAction<number[]>>;
  onDeleteTodo: (id: number) => void;
};

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  isLoading,
  setTodos,
  setErrorMessage,
  deleteTodoId,
  setDeleteTodoId,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isLoading={isLoading}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            deleteTodoId={deleteTodoId}
            setDeleteTodoId={setDeleteTodoId}
            onDeleteTodo={onDeleteTodo}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={isLoading}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          deleteTodoId={deleteTodoId}
          setDeleteTodoId={setDeleteTodoId}
          onDeleteTodo={onDeleteTodo}
        />
      )}
    </section>
  );
};
