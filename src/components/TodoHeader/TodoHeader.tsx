import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useRef,
  useState,
} from 'react';

import { TodoListContext } from '../../contexts/TodoListContext';

import cn from 'classnames';

export const TodoHeader = () => {
  const todoField = useRef<HTMLInputElement>(null);
  const { todos, addTodo, errorMessage } = useContext(TodoListContext);
  const [queryTodo, setQueryTodo] = useState('');
  const isAllCompletedTodos = todos.every(item => item.completed);

  React.useEffect(() => {
    todoField.current?.focus();
  }, [todos]);

  const handlerChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQueryTodo(e.target.value);
  };

  const reset = () => {
    setQueryTodo('');
  };

  const handlerSumbit = (e: FormEvent) => {
    e.preventDefault();

    addTodo(queryTodo);

    if (!errorMessage) {
      reset();
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCompletedTodos,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handlerSumbit}>
        <input
          ref={todoField}
          value={queryTodo}
          onChange={handlerChangeQuery}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
