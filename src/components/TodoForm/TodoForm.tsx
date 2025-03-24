import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { addTodo, USER_ID } from '../../api/todos';

type Props = {
  todoList: Todo[];
  showErrorMessage: (message: string, delay?: number) => void;
  addNewTodo: (todo: Todo) => void;
  setTempTodo: (todo: Todo | null) => void;
};

export const TodoForm: React.FC<Props> = ({
  todoList,
  addNewTodo,
  setTempTodo,
  showErrorMessage,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newTodoInputRef = useRef<HTMLInputElement>(null);
  const areAllTodosCompleted = todoList?.every(todo => todo.completed);

  const handlerSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (todoTitle.trim() === '') {
      showErrorMessage('Title should not be empty');
      setIsSubmitting(false);

      return;
    }

    const tempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
    };

    setTempTodo(tempTodo);

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
    };

    addTodo(newTodo)
      .then(response => {
        addNewTodo(response);
        setTodoTitle('');
      })
      .catch(() => {
        showErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  useEffect(() => {
    if (newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, [todoList, isSubmitting]);

  return (
    <header className="todoapp__header">
      {todoList.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handlerSubmitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoInputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          disabled={isSubmitting}
          onChange={e => setTodoTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
