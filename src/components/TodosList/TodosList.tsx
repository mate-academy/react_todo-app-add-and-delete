import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { TodoItem } from '../TodoItem';

import { Props } from './TodoList.props';

export const TodosList: React.FC<Props> = ({
  todos,
  title,
  isAdding,
  onDelete,
  selectedTodos,
  setSelectedTodos,
  onUpdate,
  selectedTodo,
  setSelectedTodo,
}) => {
  const temp = {
    id: 0,
    title,
  };

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
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              selectedTodos={selectedTodos}
              setSelectedTodos={setSelectedTodos}
              onUpdate={onUpdate}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
              todos={todos}
            />
          </CSSTransition>
        ))}

        {isAdding && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="item"
          >
            <div
              data-cy="Todo"
              className="todo"
              key={temp.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>
              <span data-cy="TodoTitle" className="todo__title">
                {temp.title}
              </span>
              <div
                data-cy="TodoLoader"
                className="modal overlay is-active"
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
