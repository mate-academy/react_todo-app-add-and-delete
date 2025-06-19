import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { ErrorMessage } from '../../types/ErrorStatusType';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (errorMessage: ErrorMessage) => void;
  todoIdsToDelete: number[];
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  setTodos,
  setErrorMessage,
  todoIdsToDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            setTodos={setTodos}
            todos={todos}
            setErrorMessage={setErrorMessage}
            todoIdsToDelete={todoIdsToDelete}
            isTempTodo={false}
          />
        );
      })}
      {tempTodo && <TodoItem todo={tempTodo} isTempTodo={true} />}
    </section>
  );
};
