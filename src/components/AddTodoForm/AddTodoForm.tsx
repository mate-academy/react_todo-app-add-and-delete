/* eslint-disable import/no-cycle */
import React, { useContext, useState } from 'react';
import { TodosContext } from '../../context/TodosContext';
import { USER_ID } from '../../App';

export const AddTodoForm: React.FC = () => {
  const [searchField, setSearchField] = useState('');
  const { onAddNewTodo, todoLoading } = useContext(TodosContext);

  const onSubmitTodoForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchField) {
      return;
    }

    const newTodo = {
      title: searchField,
      userId: USER_ID,
      completed: false,
      id: 0,
    };

    onAddNewTodo(newTodo);
    setSearchField('');
  };

  return (
    <form onSubmit={onSubmitTodoForm}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={searchField}
        onChange={(event) => setSearchField(event.target.value)}
        disabled={todoLoading}
      />
    </form>
  );
};
