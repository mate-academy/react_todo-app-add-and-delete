import { useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import { NewTodoContext }
  from '../../providers/NewTodoProvider/NewTodoProvider';
import { TodosContext } from '../../providers/TodosProvider/TodosProvider';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const NewTodo = () => {
  const newTodoContext = useContext(NewTodoContext);
  const todosContext = useContext(TodosContext);

  if (!newTodoContext) {
    return null;
  }

  const { handleSubmit, handleInput, todoInput } = newTodoContext;

  if (!todosContext) {
    return null;
  }

  const { todos } = todosContext;

  return (
    <CSSTransition
      key={0}
      timeout={300}
      classNames="temp-item"
    >
      <header className="todoapp__header">
        {/* this buttons is active only if there are some active todos */}
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed === true),
          })}
          data-cy="ToggleAllButton"
        />

        {/* Add a todo on form submit */}
        <form onSubmit={(e) => handleSubmit(e, todoInput)}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={todoInput}
            onChange={handleInput}
          />
        </form>
      </header>
    </CSSTransition>
  );
};
