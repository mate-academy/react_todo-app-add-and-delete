import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';
import { Errors } from '../../types/ErrorTypes';

type Props = {
  todos: Todo[],
  onCompletionChange: (todoId: number) => void,
  onRemoveTodo: (todoId: number) => void,
  onTodoEdited: (id: number, newTitle: string) => void,
  setErrorMsg: (errorMsg: Errors | null) => void,
};

export const TodoList: React.FC<Props> = (
  {
    todos, onCompletionChange, onRemoveTodo, onTodoEdited, setErrorMsg,
  },
) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos
      .map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onCompletionChange={onCompletionChange}
          onRemoveTodo={onRemoveTodo}
          onTodoEdited={onTodoEdited}
          setErrorMsg={setErrorMsg}
        />
      ))}
  </section>
);
