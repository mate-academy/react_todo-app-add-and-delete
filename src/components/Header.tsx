import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoError } from '../types/TodoError';
import { USER_ID } from '../api/todos';
import * as todoService from '../api/todos';

type Props = {
  todos: Todo[],
  setErrorMesage: (errorMesage: TodoError) => void,
  setTodosFromServer: (todos: Todo[]) => void,
  setNewAddedTodoId: (todoId: number | null) => void,
};

export const Header: React.FC<Props> = ({
  todos,
  setErrorMesage,
  setTodosFromServer,
  setNewAddedTodoId,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const todoTemp = {
    id: 0,
    title: todoTitle,
    completed: false,
    userId: USER_ID,
  };

  const addTodo = ({ title, userId, completed }: Todo) => {
    setIsInputDisabled(true);

    return todoService.createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodosFromServer([...todos, newTodo]);
        setNewAddedTodoId(newTodo.id);
      })
      .catch(() => setErrorMesage(TodoError.add))
      .finally(() => {
        setTodoTitle('');

        setTimeout(() => {
          setIsInputDisabled(false);
          setNewAddedTodoId(null);
        }, 300);
      });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (todoTemp.title.trim() !== '') {
        addTodo(todoTemp);
      } else {
        setErrorMesage(TodoError.emtyTitle);
      }
    }
  };

  return (
    <header className="todoapp__header">
      {
        todos.length > 0 && (
          <button
            type="button"
            className="todoapp__toggle-all active"
            aria-label="toggle"
          />
        )
      }

      <form>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          onKeyDown={event => handleKeyPress(event)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
