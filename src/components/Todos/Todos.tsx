/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  loadingTodoIds: number[];
  tempTodo: Todo | null;
  onTodoTitleUpdate?: (title: string) => Promise<void>;
  onTodoDelete?: (id: number) => void;
  onOneTodoToggle?: (id: number) => void;
};

const TodosComponent: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  tempTodo = null,
  onTodoTitleUpdate = () => Promise.resolve(),
  onTodoDelete = () => {},
  onOneTodoToggle = () => {},
}) => {
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);
  const [editQuery, setEditQuery] = useState('');

  const handleEditSubmit = () => {
    if (!editQuery.trim()) {
      return;
    }

    onTodoTitleUpdate(editQuery).then(() => setEditQuery(''));
    setEditedTodoId(null);
  };

  const handleDoubleClick = (id: number) => {
    setEditQuery(todos.find(todo => todo.id === id)?.title as string);
    setEditedTodoId(id);
  };

  const handleEditQueryChange = (newQuery: string) => {
    setEditQuery(newQuery);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              isEditing={todo.id === editedTodoId}
              isLoading={loadingTodoIds.includes(todo.id)}
              editQuery={editQuery}
              onOneTodoToggle={onOneTodoToggle}
              onEditSubmit={handleEditSubmit}
              onEditQueryChange={handleEditQueryChange}
              onDoubleClick={handleDoubleClick}
              onTodoRemove={onTodoDelete}
              key={todo.id}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              isEditing={false}
              isLoading={true}
              editQuery={''}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

export const Todos = React.memo(TodosComponent);
