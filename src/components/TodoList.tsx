import { Todo } from '../types/Todo';
import React, { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { TodoListContext } from '../variables/LangContext';

type Props = {
  visibleTodos: Todo[];
};

export const TodoList: React.FC<Props> = ({ visibleTodos }) => {
  const { tempTodo } = useContext(TodoListContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
