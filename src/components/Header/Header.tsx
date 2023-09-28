import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { addTodo } from '../../api/todos';
import { TodosContext } from '../../TodosContext';
import { ErrorMessage } from '../../types/errorMessage';
import { Todo } from '../../types/Todo';

export const Header: React.FC = () => {
  const {
    todos, setTodos, errorNotificationHandler, userID, setTempTodo,
    setTodosIdsUpdating,
  } = useContext(TodosContext);
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const activeTodos = useMemo(() => (
    todos.filter(todo => todo.completed === false)), [todos]);

  const inputField = useRef<HTMLInputElement>(null);

  const addingTodo = (newTodo: Omit<Todo, 'id'>) => {
    setIsDisabled(true);

    const tempTodoData = {
      id: 0,
      ...newTodo,
    };

    setTempTodo(tempTodoData);
    setTodosIdsUpdating([tempTodoData.id]);

    addTodo(userID, newTodo)
      .then((response) => {
        setTodos([...todos,
          {
            ...response as Todo,
            title: title.trim(),
          }]);
        setTempTodo(null);
        setTitle('');
      })
      .catch(() => errorNotificationHandler(ErrorMessage.ADD))
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
        setTodosIdsUpdating([]);
      });
  };

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [todos]);

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      errorNotificationHandler(ErrorMessage.TITLE);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: userID,
      title: trimmedTitle,
      completed: false,
    };

    addingTodo(newTodo);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {activeTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          aria-label="delete"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmitHandler}>
        <input
          type="text"
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          ref={inputField}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
