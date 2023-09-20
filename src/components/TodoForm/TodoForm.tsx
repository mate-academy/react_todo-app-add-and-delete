import React, { useEffect, useRef, useState } from 'react';
import { addTodo } from '../../api/todos';
import { USER_ID } from '../../utils/user';
import { Todo } from '../../types/Todo';
import { ErrorMessages } from '../../types/ErrorMessages';
import { UseTodosContext } from '../../utils/TodosContext';
import { TempTodo } from '../../types/TempTodo';

type Props = {};

export const TodoForm: React.FC<Props> = () => {
  const context = UseTodosContext();
  const {
    todos,
    setTodos,
    setErrorMessage,
    setTempTodo,
  } = context;

  const titleField = useRef<HTMLInputElement>(null);

  const handleTodosUpdate = (newTodo: Todo) => {
    setTodos(prevState => [...prevState, newTodo]);
  };

  const [todoTitle, setTodoTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos.length, isDisabled]);

  const addNewTodo = (newTodo: Todo) => {
    setTodoTitle('');
    handleTodosUpdate(newTodo);
  };

  const finishAddingNewTodo = () => {
    setTempTodo(null);
    setIsDisabled(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalisedTitle = todoTitle.trim();

    if (!normalisedTitle.length) {
      setErrorMessage(ErrorMessages.NoEmptyTitle);

      return;
    }

    const tempTodoData: TempTodo = {
      completed: false,
      id: 0,
      title: normalisedTitle,
    };

    setIsDisabled(true);
    setTempTodo(tempTodoData);

    const newTodo = {
      completed: false,
      title: normalisedTitle,
      userId: USER_ID,
    };

    addTodo(newTodo)
      .then(addNewTodo)
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableToAdd);
        finishAddingNewTodo();
      })
      .finally(finishAddingNewTodo);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        ref={titleField}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={(event) => setTodoTitle(event.target.value)}
        disabled={isDisabled}
      />
    </form>
  );
};
