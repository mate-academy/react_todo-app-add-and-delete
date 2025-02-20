import React from 'react';
import './TodoList.scss';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  loadingTodoIds: number[];
  filterType: FilterType;
  selectedTodoId: number | null;
  onSelectTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  filterType,
  selectedTodoId,
  onSelectTodo,
  onDeleteTodo,
  tempTodo,
}) => {
  const getFilteredTodos = () => {
    switch (filterType) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'all':
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={loadingTodoIds.includes(todo.id)}
          isSelected={selectedTodoId === todo.id}
          onSelect={() => onSelectTodo(todo)}
          onDelete={() => onDeleteTodo(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          loading={true}
          isSelected={false}
          onSelect={() => {}}
          onDelete={() => {}}
        />
      )}
    </section>
  );
};
