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
  todos: Todo[],
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  loading: boolean,
  setLoadingActiveTodoId: React.Dispatch<React.SetStateAction<number[]>>,
  loadingActiveTodoId: number[],
};

export const TodoList: React.FC<TodoListProps> = ({
  setTodos,
  filter,
  showErrorNotification,
  todos,
  setLoading,
  loading,
  setLoadingActiveTodoId,
  loadingActiveTodoId,
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
      setLoadingActiveTodoId(prev => [...prev, todoId]);
      setLoading(true);
      await deleteTodos(USER_ID, todoId);
      setTodos(todos.filter((todo) => todo.id !== todoId));
    } catch (error) {
      showErrorNotification('Unable to delete the todo');
    } finally {
      setLoadingActiveTodoId([]);
      setLoading(false);
    }
  };

  const handleTodoCheck = async (idTodo: number) => {
    try {
      setLoadingActiveTodoId([idTodo]);
      setLoading(true);
      const updatedTodo = todos.find((todo) => todo.id === idTodo) || null;

      if (!updatedTodo) {
        throw new Error('Todo not found');
      }

      updatedTodo.completed = !updatedTodo.completed;
      await updateTodos(USER_ID, idTodo, updatedTodo);

      setTodos((prevTodos) => prevTodos
        .map((todo) => (todo.id === idTodo ? updatedTodo : todo)));
    } catch (error) {
      showErrorNotification('Unable to update the todo');
    } finally {
      setLoading(false);
      setLoadingActiveTodoId([]);
    }
  };

  const handleTitleBlur = async (todoId: number) => {
    setLoading(true);
    setActiveTodoId(0);
    setLoadingActiveTodoId(prev => [...prev, todoId]);
    const updatedTodo = todos
      .find((todoItem) => todoItem.id === activeTodoId) || null;

    if (!updatedTodo?.title) {
      await handleTodoDelete(activeTodoId);
    } else {
      await updateTodos(USER_ID, activeTodoId, updatedTodo);
    }

    setLoading(false);
    setLoadingActiveTodoId([]);
  };

  const handleNewTitleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    todoId: number,
  ) => {
    event.preventDefault();
    setActiveTodoId(0);
    setLoading(true);
    setLoadingActiveTodoId(prev => [...prev, todoId]);
    const updatedTodo = todos
      .find((todoItem) => todoItem.id === activeTodoId) || null;

    if (!updatedTodo?.title) {
      await handleTodoDelete(activeTodoId);
    } else {
      await updateTodos(USER_ID, activeTodoId, updatedTodo);
    }

    setLoadingActiveTodoId([]);
    setLoading(false);
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
              handleTitleBlur={() => handleTitleBlur(todo.id)}
            />
          )}
          {loading && (
            <TodoLoader
              todo={todo}
              loadingActiveTodoId={loadingActiveTodoId}
            />
          )}
        </div>
      ))}
    </section>
  );
};
