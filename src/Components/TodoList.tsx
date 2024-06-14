import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  completedTodoIds: number[];
  completedClearing: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  setTodos,
  setErrorMessage,
  inputRef,
  completedClearing,
  completedTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            inputRef={inputRef}
            completedClearing={completedClearing}
            completedTodoIds={completedTodoIds}
          />
        );
      })}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          inputRef={inputRef}
          completedClearing={completedClearing}
          completedTodoIds={completedTodoIds}
        />
      )}
    </section>
  );
};
