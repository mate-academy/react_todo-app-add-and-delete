import React, { useState } from 'react';
import { client } from '../../utils/fetchClient';
import { URL, USER_ID } from '../../utils/Url';
import { Todo } from '../../types/Todo';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setErrorMessage: (a: string) => void;
  todos: Todo[];
};

export const TodoApp: React.FC<Props> = ({
  todos,
  setTodos,
  setErrorMessage,
}) => {
  const [value, setValue] = useState<string>('');

  const handleAddTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newValue: string = event.target.value;

    setValue(newValue);
  };

  const addNewTodo = async () => {
    if (value.trim()) {
      return;
    }

    try {
      const newTodoData = {
        title: value,
        completed: false,
        userId: USER_ID,
      };

      const addedTodo = await client.post<Todo>(URL, newTodoData);

      setTodos((prevTodos: Todo[]) => [...prevTodos, addedTodo]);

      setValue('');
    } catch (error) {
      setErrorMessage('Unable to add todo');
      throw new Error('Unable to add todo');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addNewTodo();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const activeTodos = todos.map((todo: Todo) => !todo.completed);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {activeTodos
        && (
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
          <button
            type="button"
            className="todoapp__toggle-all active"
          />
        )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={handleAddTodo}
          onKeyDown={handleKeyPress}
          required
        />
      </form>
    </header>
  );
};
