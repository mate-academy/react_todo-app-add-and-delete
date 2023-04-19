import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import { deleteTodos, updateTodos } from '../api/todos';
import { TodoItemTitle } from './TodoItemTitle';
import { TodoItemForm } from './TodoItemForm';
import { TodoLoader } from './TodoLoader';
import { USER_ID } from '../api/userId';

type TodoListProps = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  filter: Filter,
  showErrorNotification: (error: string) => void,
  isAddingNewTodo: boolean,
  todos: Todo[],
};

export const TodoList: React.FC<TodoListProps> = ({
  setTodos, filter, showErrorNotification, isAddingNewTodo, todos,
}) => {
  const [activeTodoId, setActiveTodoId] = useState<number>(0);

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleTodoDelete = async (todoId: number) => {
    try {
      await deleteTodos(USER_ID, todoId);
      setTodos(todos.filter((todo) => todo.id !== todoId));
    } catch (error) {
      showErrorNotification('Unable to delete the todo');
    }
  };

  const handleTodoCheck = async (idTodo: number) => {
    setTodos((prevTodos) => prevTodos.map((todo) => {
      if (todo.id === idTodo) {
        const updatedTodo = {
          ...todo,
          completed: !todo.completed,
        };

        updateTodos(USER_ID, idTodo, updatedTodo);

        return updatedTodo;
      }

      return todo;
    }));
  };

  const handleTitleBlur = async () => {
    const updatedTodo = todos
      .find((todoItem) => todoItem.id === activeTodoId) || null;

    if (!updatedTodo?.title) {
      handleTodoDelete(activeTodoId);
    } else {
      await updateTodos(USER_ID, activeTodoId, updatedTodo);
    }

    setActiveTodoId(0);
  };

  const handleNewTitleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const updatedTodo = todos
      .find((todoItem) => todoItem.id === activeTodoId) || null;

    if (!updatedTodo?.title) {
      handleTodoDelete(activeTodoId);
    } else {
      await updateTodos(USER_ID, activeTodoId, updatedTodo);
    }

    setActiveTodoId(0);
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    const newTodos = todos.map((todo) => {
      if (todo.id === activeTodoId) {
        return { ...todo, title: event.target.value };
      }

      return todo;
    });

    setTodos(newTodos);
  };

  return (
    <section className="todoapp__main">
      {filteredTodos.map((todo) => (
        <div
          key={todo.id}
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleTodoCheck(todo.id)}
            />
          </label>

          {activeTodoId !== todo.id ? (
            <TodoItemTitle
              todo={todo}
              setActiveTodoId={setActiveTodoId}
              handleTodoDelete={handleTodoDelete}
            />
          ) : (
            <TodoItemForm
              handleNewTitleSubmit={handleNewTitleSubmit}
              todo={todo}
              handleTodoTitleChange={handleTodoTitleChange}
              handleTitleBlur={handleTitleBlur}
            />
          )}
          {isAddingNewTodo && (
            <TodoLoader
              todo={todo}
              activeTodoId={activeTodoId}
            />
          )}
        </div>
      ))}
    </section>
  );
};
