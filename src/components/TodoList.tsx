import React, { useContext } from 'react';
import { Todo } from '../types/Todo';
import { StateContext } from './TodosContext';
import { Status } from '../types/Status';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const { filterBy, todos, tempTodo } = useContext(StateContext);

  const filterTodos = (allTodos: Todo[]): Todo[] => {
    switch (filterBy) {
      case Status.COMPLETED:
        return allTodos.filter(todo => todo.completed);
      case Status.ACTIVE:
        return allTodos.filter(todo => !todo.completed);
      default:
        return allTodos;
    }
  };

  const filteredTodos = filterTodos(todos);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos && (
        filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
          />
        ))
      )}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
        />
      )}
    </section>
  );
};
