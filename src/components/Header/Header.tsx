/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { createTodo } from '../../api/todos';
import { USER_ID } from '../../utils/variables';
import { ErrorMessage, TodosContext } from '../TodosContext';

type Props = {};

export const Header: React.FC<Props> = () => {
  const {
    todos,
    setTodos,
    setAlarm,
    setTempTodo,
    isTodoChange,
    setIsTodoChange,
    setChangingItems,
  } = useContext(TodosContext);

  const titleInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  }, [isTodoChange]);

  const [inputValue, setInputValue] = useState('');

  const isAllCompletedTodos = todos.every(todo => todo.completed);

  const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
    createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        setInputValue('');
        setChangingItems([]);
      })
      .catch(() => {
        setAlarm(ErrorMessage.isUnableAddTodo);
        setTempTodo(null);
      })
      .finally(() => {
        setIsTodoChange(false);
      });
  };

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedInputValue = inputValue.trim();

    if (!trimmedInputValue) {
      setAlarm(ErrorMessage.isTitleEmpty);
      setInputValue('');

      return;
    }

    setChangingItems(current => [...current, 0]);
    setIsTodoChange(true);
    setTempTodo({
      id: 0,
      title: trimmedInputValue,
      userId: USER_ID,
      completed: false,
    });
    addTodo({ title: trimmedInputValue, userId: USER_ID, completed: false });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setAlarm(ErrorMessage.Default);
  };

  return (
    <header className="todoapp__header">
      { !!todos.length && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={cn(
            'todoapp__toggle-all',
            { active: isAllCompletedTodos },
          )}
        />
      )}

      <form onSubmit={handleSubmitForm}>
        <input
          data-cy="NewTodoField"
          value={inputValue}
          ref={titleInput}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInputChange}
          disabled={isTodoChange}
        />
      </form>
    </header>
  );
};
