import { useContext } from 'react';
import cn from 'classnames';
import { NewTodoContext }
  from '../../providers/NewTodoProvider/NewTodoProvider';
import { TodosContext } from '../../providers/TodosProvider/TodosProvider';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const NewTodo = () => {
  const newTodoContext = useContext(NewTodoContext);
  const todosContext = useContext(TodosContext);

  const { handleSubmit, handleInput, todoInput } = newTodoContext;
  const { todos } = todosContext;

  return (
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
      <form onSubmit={() => handleSubmit}>
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
  );
};
