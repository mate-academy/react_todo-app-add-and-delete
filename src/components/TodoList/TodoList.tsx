import React from 'react';
import { Todo } from '../../types/Todo';
import TodoItem from '../TodoItem';

type Props = {
  throwErr: (msg: string) => void;
  deleteTodo: (id: number) => void;
  focusInput: () => void;
  todos: Todo[];
  showLoadingForCompletedTodos: boolean;
};

const TodoList: React.FC<Props> = ({
  throwErr,
  deleteTodo,
  focusInput,
  todos,
  showLoadingForCompletedTodos,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          throwErr={throwErr}
          deleteTodoFromArray={deleteTodo}
          focusInput={focusInput}
          todo={todo}
          isLoading={todo.completed && showLoadingForCompletedTodos}
        />
      ))}
    </section>
  );
};

export default React.memo(TodoList);
