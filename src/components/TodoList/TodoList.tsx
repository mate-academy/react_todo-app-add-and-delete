import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

type Props = {
  todos: Todo[];
  selectedTodoId: number;
  setSelectedTodoId: (id: number) => void;
  handleDeleteButtonClick: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  selectedTodoId,
  setSelectedTodoId,
  handleDeleteButtonClick,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isTodoLoading = todo.id === 0;

        return (
          <TodoItem
            todo={todo}
            selectedTodoId={selectedTodoId}
            setSelectedTodoId={setSelectedTodoId}
            isTodoLoading={isTodoLoading}
            handleDeleteButtonClick={handleDeleteButtonClick}
            key={todo.id}
          />
        );
      })}
    </section>
  );
};
