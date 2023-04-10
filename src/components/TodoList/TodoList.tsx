import { FC } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import './TodoList.scss';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  onRemove: (id: number) => void;
  loadTodoById: number[];
}

export const TodoList: FC<TodoListProps> = ({
  todos,
  tempTodo,
  onRemove,
  loadTodoById,
}) => {
  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              onRemove={onRemove}
              loadTodoById={loadTodoById}
            />
          </CSSTransition>
        ))}

        {tempTodo !== null && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              key={0}
              todo={tempTodo}
              onRemove={onRemove}
              loadTodoById={loadTodoById}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
