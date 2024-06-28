import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from './todoItem';
import { Todo } from '../types/Todo';

interface TodoListProps {
  todos: Todo[];
  handleTodoClick: (id: number) => void;
  deleteTodos: (id: number) => void;
  isSubmitting: boolean;
  tempTodo: Todo | null;
}

const TodoList: React.FC<TodoListProps> = React.memo(
  ({ todos, handleTodoClick, deleteTodos, isSubmitting, tempTodo }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {todos.map(({ id, title, completed }) => (
            <CSSTransition key={id} timeout={300} classNames="item">
              <TodoItem
                todoId={id}
                todoTitle={title}
                isCompleted={completed}
                handleTodoClick={handleTodoClick}
                deleteTodos={deleteTodos}
                isSubmitting={isSubmitting}
                tempTodo={tempTodo}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';

export default TodoList;
