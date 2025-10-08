import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  handleDeleteTodo: (id: number) => void;
  handleUpdateTodoText: (id: number, title: string) => void;
  handleUpdateTodoStatus: (
    todoId: number,
    title: string,
    newStatus: boolean,
  ) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  activeTodoId: number | null;
  setOriginalTitle: (title: string) => void;
  activeTodoIds: number[];
};

export const TodoList: React.FC<Props> = props => (
  <section className="todoapp__main" data-cy="TodoList">
    <div>
      {props.todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} {...props} />
      ))}
    </div>
  </section>
);
