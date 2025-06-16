import React from 'react';
import { Todo as TodoInterface } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

interface TodoListProps {
  visibleTodos: TodoInterface[];
  deletedTodoId: TodoInterface['id'];
  changeDeletedTodoId: (deletedTodo: number) => void;
  tempTodo: TodoInterface | null;
  onDeleteTodo: (todoId: TodoInterface['id']) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos,
  deletedTodoId,
  changeDeletedTodoId,
  tempTodo,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos?.map(todo => {
        return (
          <Todo
            key={todo.id}
            todo={todo}
            deletedTodoId={deletedTodoId}
            changeDeletedTodoId={changeDeletedTodoId}
            onDeleteTodo={onDeleteTodo}
          />
        );
      })}
      {tempTodo && (
        <Todo
          key="temp"
          todo={tempTodo}
          deletedTodoId={deletedTodoId}
          changeDeletedTodoId={changeDeletedTodoId}
          onDeleteTodo={onDeleteTodo}
        />
      )}
    </section>
  );
};
