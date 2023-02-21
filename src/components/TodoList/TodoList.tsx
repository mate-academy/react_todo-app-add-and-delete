import React from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { TempTodo } from '../../types/TempTodo';
import { TemporaryTodo } from '../TemporaryTodo';

type Props = {
  todos: Todo[];
  removeTodoFromServer: (id: number) => void;
  updateTodoOnServer: (todo: Todo) => void;
  updatingStage: number[];
  handleTodoEditor: (id: number) => void;
  editedTodoId: number;
  tempTodo: TempTodo | null;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  removeTodoFromServer,
  updateTodoOnServer,
  updatingStage,
  handleTodoEditor,
  editedTodoId,
  tempTodo,
}) => (
  <section className="todoapp__main">
    {todos.map((todo) => (
      <TodoItem
        todo={todo}
        key={todo.id}
        removeTodoFromServer={removeTodoFromServer}
        updateTodoOnServer={updateTodoOnServer}
        updatingStage={updatingStage}
        handleTodoEditor={handleTodoEditor}
        editedTodoId={editedTodoId}
      />
    ))}
    {tempTodo && (
      <TemporaryTodo todo={tempTodo} />
    )}
  </section>
));
