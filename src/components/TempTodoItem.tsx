import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  tempTodo: Todo;
}

export const TempTodoItem: React.FC<Props> = ({ tempTodo }) => {
  return (
    <TodoItem
      todo={tempTodo}
      isLoading={true} // показываем загрузчик
      onToggle={() => {}}
      onDelete={() => {}}
    />
  );
};
