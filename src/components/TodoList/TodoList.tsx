import { FC } from 'react';
import { Todo } from '../Todo';
import { Todo as TodoType } from '../../types/Todo';
import {TransitionGroup, CSSTransition} from "react-transition-group";

interface Props {
  todos: TodoType[],
  tempTodo: Omit<TodoType, 'id'> | null,
  deleteTodo: (todoId: number) => void,
  showLoader: boolean,
}

export const TodoList: FC<Props> = (props) => {
  const {
    todos,
    tempTodo,
    deleteTodo,
    showLoader,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
        {todos.map(todo => (
            <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
            >
              <Todo
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          showLoader={showLoader}
        />
            </CSSTransition>
        ))}

      {tempTodo && (
          <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
          >
        <div
          className="todo"
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span className="todo__title">
            {tempTodo.title}
          </span>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
          </CSSTransition>
          )}
            </TransitionGroup >
    </section>
  );
};
