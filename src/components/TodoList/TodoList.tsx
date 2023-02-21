import React from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  removeTodoFromServer: (id: number) => void;
  updateTodoOnServer: (todo: Todo) => void;
  updatingStage: number[];
  handleEditingTodo: (id: number) => void;
  editedTodoId: number;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodoFromServer,
  updateTodoOnServer,
  updatingStage,
  handleEditingTodo,
  editedTodoId,
}) => (
  <section className="todoapp__main">
    {todos.map((todo) => (
      <TodoItem
        todo={todo}
        key={todo.id}
        removeTodoFromServer={removeTodoFromServer}
        updateTodoOnServer={updateTodoOnServer}
        updatingStage={updatingStage}
        handleEditingTodo={handleEditingTodo}
        editedTodoId={editedTodoId}
      />
    ))}
  </section>
);
