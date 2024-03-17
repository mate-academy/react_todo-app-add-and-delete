import React, { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';
import { TodoItem } from '../TodoItem';
import { TodosContext } from '../TodosContext/TodosContext';

interface Props {
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({ tempTodo }) => {
  const { todos, filter } = useContext(TodosContext);

  const filterTodos = () => {
    switch (filter) {
      case Status.ACTIVE:
        return todos.filter((todo) => !todo.completed);
      case Status.COMPLETED:
        return todos.filter((todo) => todo.completed);
      case Status.ALL:
      default:
        return todos;
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filterTodos().map((todo: Todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}

      {tempTodo && (
        <TodoItem todo={tempTodo} isLoading />
      )}
    </section>
  );
};
