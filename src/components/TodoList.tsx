import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  loading: boolean;
  loadingIds: number[];
  addLoading: (id: number) => void;
  removeLoading: (id: number) => void;
  setError: (message: string | null) => void;
  newTodoRef: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  loadingIds,
  addLoading,
  removeLoading,
  setError,
  newTodoRef,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames={todo.isTemp ? 'temp-item' : 'item'}
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              setTodos={setTodos}
              loadingIds={loadingIds}
              addLoading={addLoading}
              removeLoading={removeLoading}
              setError={setError}
              onDelete={() => setTimeout(() => newTodoRef.current?.focus(), 0)}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
