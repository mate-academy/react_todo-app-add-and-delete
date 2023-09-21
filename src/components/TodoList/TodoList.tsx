import React from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Enum';
import { TodoItem } from '../TodoItem/TodoItem';
import { TempoTodoItem } from '../TempoTodoItem/TempoTodoItem';

type Props = {
  todos: Todo[];
  selectedFilter: string;
  tempoTodo: Todo | null;
};

function filteredTodos(todos: Todo[], selectedFilter: string) {
  switch (selectedFilter) {
    case Filter.Active:
      return todos.filter(item => !item.completed);
    case Filter.Complited:
      return todos.filter(item => item.completed);
    default:
      return todos;
  }
}

export const TodoList: React.FC<Props> = ({
  todos,
  selectedFilter,
  tempoTodo,
}) => {
  const updatedTodos = filteredTodos(todos, selectedFilter);

  return (
    <section className="todoapp__main">
      {updatedTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempoTodo !== null && (
        <TempoTodoItem tempoTodo={tempoTodo} key={tempoTodo.id} />
      )}
    </section>
  );
};
