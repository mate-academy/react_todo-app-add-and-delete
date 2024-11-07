import { useContext } from 'react';

import { TodosContext } from '../../../context/TodoContext';
import { useTodoForm } from '../../../hooks/useTodoForm';

export const TodoForm = () => {
  const { inputRef } = useContext(TodosContext);
  const { title, handleSubmit, handleChangeTitle, isInputDisabled } =
    useTodoForm();

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        ref={inputRef}
        disabled={isInputDisabled}
        onChange={handleChangeTitle}
      />
    </form>
  );
};
