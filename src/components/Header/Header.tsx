import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import TodosContext from '../../contexts/Todos/TodosContext';
import ErrorContext from '../../contexts/Errors/ErrorsContext';

export const Header = () => {
  const { todos } = TodosContext.useState();
  const todosContext = TodosContext.useContract();
  const { deleteTodo, clearCompleted } = todosContext;
  const { addTodo, updateTodo } = todosContext;

  const { raiseError } = ErrorContext.useContract();

  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ref = useRef<HTMLInputElement>(null);

  const isAllComplete = todos.every(todo => todo.completed);

  useEffect(() => {
    const focus = () => {
      if (ref.current) {
        ref.current.focus();
      }
    };

    deleteTodo.subscribe(focus);
    clearCompleted.subscribe(focus);

    return () => {
      deleteTodo.unsubscribe(focus);
      clearCompleted.unsubscribe(focus);
    };
  }, [deleteTodo, clearCompleted]);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [isSubmitting]);

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      raiseError('Title should not be empty');

      return;
    }

    setIsSubmitting(true);

    let isSuccsess = true;

    try {
      await addTodo(trimmedTitle);
    } catch {
      isSuccsess = false;
    }

    if (isSuccsess) {
      setTitle('');
    }

    setIsSubmitting(false);
  };

  const toggleAll = async () => {
    for (const todo of todos) {
      updateTodo(todo.id, { completed: !isAllComplete });
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        onClick={toggleAll}
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllComplete,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          ref={ref}
          value={title}
          onChange={event => setTitle(event.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
