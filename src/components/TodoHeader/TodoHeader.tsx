/* eslint-disable no-param-reassign */
import React, { useState } from 'react';

import { Todo } from '../../types/Todo';
import { USER_ID, addTodos, getTodos, patchTodos } from '../../api/todos';

interface Props {
  setErrorMesage: React.Dispatch<React.SetStateAction<string>>;
  addNewTodo: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
}

export const TodoHeader: React.FC<Props> = ({
  setErrorMesage,
  addNewTodo,
  todos,
}) => {
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [isAdd, setIsAdd] = useState(false);

  function writeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (!isAdd) {
      setTodoTitle(e.target.value);
    }
  }

  const AddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (todoTitle === '') {
      setErrorMesage('Title should not be empty');

      return;
    }

    setIsAdd(true);

    const todo: Todo = {
      id: 0,
      title: todoTitle.trim(),
      completed: false,
      userId: USER_ID,
    };

    addTodos(todo)
      .then(newTodo => addNewTodo([...todos, newTodo]))
      .then(() => setIsAdd(false))
      .catch(error => {
        setIsAdd(false);
        setErrorMesage('Unable to load todos');
        throw error;
      })
      .then(() => {
        setTodoTitle('');
        setErrorMesage('');
      });
  };

  function getTodoArr(comp: boolean) {
    return todos.map(todo => {
      todo.completed = comp;

      patchTodos(todo);

      return todo;
    });
  }

  function changeTodosStatus() {
    if (todos.some(todo => !todo.completed)) {
      getTodos()
        .then(() => addNewTodo(getTodoArr(true)))
        .catch(error => {
          setErrorMesage('Unable to update a todo');
          throw error;
        });
    } else {
      getTodos()
        .then(() => addNewTodo(getTodoArr(false)))
        .catch(error => {
          setErrorMesage('Unable to update a todo');
          throw error;
        });
    }
  }

  return (
    <header className="todoapp__header">
      {todos.length > 0 ? (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : null}`}
          data-cy="ToggleAllButton"
          onClick={() => changeTodosStatus()}
        />
      ) : null}

      <form onSubmit={AddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          autoFocus
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={writeTitle}
        />
      </form>
    </header>
  );
};
