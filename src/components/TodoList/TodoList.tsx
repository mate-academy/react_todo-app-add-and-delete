import React, { useContext, useMemo } from 'react';
import { StateContext } from '../../store/TodoContext';
import { FilterFields } from '../../store/types';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { filter, tempTodo } = useContext(StateContext);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterFields.Active:
          return !todo.completed;
        case FilterFields.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filter]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos?.map(todo => <TodoItem todo={todo} key={todo.id} />)}
      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
