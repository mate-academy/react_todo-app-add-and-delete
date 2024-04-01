import React, { useContext } from 'react';
import { StateContext } from './MainContext';
import { Todo } from '../types/Todo';
import { Select } from '../types/Select';
import { TodoItem } from './TodoItem';

interface Props {
  tempTodo: Todo | null;
}

const getPreparedTodos = (todoList: Todo[], selectedTodo: string) => {
  switch (selectedTodo) {
    case Select.ACTIVE:
      return todoList.filter(todo => !todo.completed);
    case Select.COMPLETED:
      return todoList.filter(todo => todo.completed);

    default:
      return todoList;
  }
};

export const TodoList: React.FC<Props> = ({ tempTodo }) => {
  const { todos, selectPage } = useContext(StateContext);

  const visibleTodos = getPreparedTodos(todos, selectPage);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo: Todo) => {
        return <TodoItem todo={todo} key={todo.id} />;
      })}

      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
