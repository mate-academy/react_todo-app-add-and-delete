import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { Filter } from '../../utils/Filter';

type Props = {
  visibleTodos: Todo[];
  isTodoEditing: boolean;
  selectedPostId: number;
  setIsTodoEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPostId: React.Dispatch<React.SetStateAction<number>>;
  selectedFilter: Filter;
  onDelete: (todoId: number) => Promise<void>;
  onUpdate: (todo: Todo) => Promise<void>;
  tempTodo: Todo | null;
  processingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  isTodoEditing,
  selectedPostId,
  setIsTodoEditing,
  setSelectedPostId,
  selectedFilter,
  onDelete,
  onUpdate,
  tempTodo,
}) => {
  let todosCopy: Todo[];

  switch (selectedFilter) {
    case Filter.all:
      todosCopy = [...visibleTodos];
      break;

    case Filter.active:
      todosCopy = visibleTodos.filter(todo => !todo.completed);
      break;

    case Filter.completed:
      todosCopy = visibleTodos.filter(todo => todo.completed);
      break;

    default:
      todosCopy = [...visibleTodos];
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todosCopy.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              isTodoEditing={isTodoEditing}
              selectedPostId={selectedPostId}
              setIsTodoEditing={setIsTodoEditing}
              setSelectedPostId={setSelectedPostId}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              isTodoEditing={false}
              selectedPostId={0}
              setIsTodoEditing={() => {}}
              setSelectedPostId={() => {}}
              onDelete={async () => Promise.resolve()}
              onUpdate={async () => Promise.resolve()}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
