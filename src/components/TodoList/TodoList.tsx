import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';
import { TodoItem } from '../TodoItem/TodoItem';
import './TodoList.scss';

type Props = {
  todos: Todo[];
  removeTodo: (todoId: number) => void;
  todoAction: number[];
  isAdding: boolean;
  newTodoName: string;
  user: User | null;
};

export const TodoList: React.FC<Props> = (
  {
    todos,
    removeTodo,
    todoAction,
    isAdding,
    newTodoName,
    user,
  },
) => {
  if (!user) {
    return null;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              removeTodo={removeTodo}
              todoAction={todoAction}
            />
          </CSSTransition>
        ))}
        {isAdding && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={{
                id: 0,
                title: newTodoName,
                completed: false,
                userId: user.id,
                createdAt: new Date(),
                updatedAt: new Date(),
              }}
              todoAction={[0]}
              removeTodo={removeTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
