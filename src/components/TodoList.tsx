import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  todoIdsToDelete: number[];
  inputTodoRef: React.MutableRefObject<HTMLInputElement | null>;
};

export const TodoList: React.FC<TodoListProps> = React.memo(
  ({ todos, tempTodo, setTodos, setError, todoIdsToDelete, inputTodoRef }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {todos.map(todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                key={todo.id}
                todo={todo}
                setTodos={setTodos}
                setError={setError}
                todoIdsToDelete={todoIdsToDelete}
                inputTodoRef={inputTodoRef}
              />
            </CSSTransition>
          ))}
          {tempTodo && (
            <CSSTransition key={0} timeout={300} classNames="temp-item">
              <TodoItem todo={tempTodo} isLoad={true} />
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';
