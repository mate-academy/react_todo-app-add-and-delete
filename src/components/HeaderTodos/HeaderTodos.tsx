import classNames from 'classnames';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { focusInput } from '../../utils/focusInput';
import * as postServise from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  checkCompleted: boolean;
  errorNotification: (message: string) => void;
  setTempTodo: (todo: Todo | null) => void;
  setTodos: (todo: Todo) => void;
  setLoading: (todo: Todo, type: string) => void;
};

interface InputHandle {
  focus: () => void;
}

const HeaderTodos = React.forwardRef<InputHandle, Props>(
  (
    { checkCompleted, errorNotification, setTempTodo, setTodos, setLoading },
    ref,
  ) => {
    const [isInputDisabled, setIsInputDisabled] = useState(false);
    const [newInputTitle, setNewInputTitle] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
    }));

    const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewInputTitle(e.currentTarget.value);
    };

    const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const titleTrim = newInputTitle.trim();

      if (titleTrim.length === 0) {
        errorNotification('Title should not be empty');
        if (ref) {
          focusInput(inputRef);
        }

        return;
      }

      const newTodo = {
        id: 0,
        userId: postServise.USER_ID,
        title: titleTrim,
        completed: false,
      };

      setTempTodo(newTodo);
      setLoading(newTodo, 'turnOn');
      setIsInputDisabled(true);

      const { userId, title, completed } = newTodo;

      postServise
        .postTodos({ userId, title, completed })
        .then(newTodoFromServer => {
          setTodos(newTodoFromServer as Todo);
          setTempTodo(null);
          setNewInputTitle('');
          setLoading(newTodo, 'turnOff');
        })
        .catch(() => {
          setTempTodo(null);
          errorNotification(`Unable to add a todo`);
        })
        .finally(() => {
          setIsInputDisabled(false);
          focusInput(inputRef);
        });
    };

    return (
      <header className="todoapp__header">
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: checkCompleted,
          })}
          data-cy="ToggleAllButton"
        />

        <form onSubmit={addTodo}>
          <input
            data-cy="NewTodoField"
            type="text"
            value={newInputTitle}
            ref={inputRef}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            onChange={handleTitle}
            disabled={isInputDisabled}
          />
        </form>
      </header>
    );
  },
);

HeaderTodos.displayName = 'HeaderTodos';

export default HeaderTodos;
