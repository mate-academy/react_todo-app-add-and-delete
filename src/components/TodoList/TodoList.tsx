import React, { useContext } from 'react';
import { TodosContext } from '../../TodoProvider';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

export const TodoList: React.FC = () => {
  const { todos, filterType, tempTodo } = useContext(TodosContext);

  const filteredItems = (type: Filter): Todo[] => {
    switch (type) {
      case Filter.COMPLETED:
        return todos.filter(todo => todo.completed);
      case Filter.ACTIVE:
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  };

  return (
    <section className="todoapp__main">
      {filteredItems(filterType).map((todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} key={tempTodo.id} />}
    </section>
  );
};
