/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { deleteTodo, updateTodo } from '../api/todos';
import { TodoComponent } from './TodoComponent';

interface TodoListProps {
  filteredTodos: Todo[];
  editingTodosId: number[];
  setEditingTodosId: (ids: number[]) => void;
  setError: (error: string) => void;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setFilteredTodos: (todos: Todo[]) => void;
  filter: string;
}
export function TodoList({
  todos,
  filteredTodos,
  editingTodosId,
  setEditingTodosId,
  setError,
  setTodos,
  setFilteredTodos,
}: TodoListProps) {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const TodoTitleFieldRef = React.useRef<HTMLInputElement>(null);

  function handleSelectedTodoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!selectedTodo) {
      return;
    }

    setSelectedTodo({
      ...selectedTodo,
      title: e.target.value,
    });
  }

  async function handleEditTitleOfTodo(todo: Todo) {
    try {
      if (!selectedTodo) {
        throw new Error('Unable to update todo');
      }

      setEditingTodosId([...editingTodosId, todo.id]);
      const updatedTodoFromServer = await updateTodo({
        ...todo,
        title: selectedTodo.title.trim(),
      });
      const newTodos = todos.map(t =>
        t.id === todo.id ? updatedTodoFromServer : t,
      );

      setTodos(newTodos);
      setFilteredTodos(newTodos);
      setEditingTodosId(editingTodosId.filter(id => id !== todo.id));
      setSelectedTodo(null);
    } catch (e) {
      setError('Unable to update a todo');
      setEditingTodosId(editingTodosId.filter(id => id !== todo.id));
      setSelectedTodo(todo);
    }
  }

  async function handleUpdateTodoStatus(todoId: number) {
    try {
      const todo = todos.find(t => t.id === todoId);

      setEditingTodosId([...editingTodosId, todoId]);
      if (!todo) {
        throw new Error('Todo not found');
      }

      const updatedTodo: Todo = { ...todo, completed: !todo.completed };
      const updatedTodoFromServer = await updateTodo(updatedTodo);
      const newTodos = todos.map(t =>
        t.id === todoId ? updatedTodoFromServer : t,
      );

      setEditingTodosId(editingTodosId.filter(id => id !== todoId));
      setTodos(newTodos);
      setFilteredTodos(newTodos);
    } catch (e) {
      setError('Unable to update a todo');
      setEditingTodosId(editingTodosId.filter(id => id !== todoId));
    }
  }

  async function handleRemoveTodo(todoId: number) {
    try {
      setEditingTodosId([...editingTodosId, todoId]);
      await deleteTodo(todoId);
      setEditingTodosId(editingTodosId.filter(id => id !== todoId));
      setTodos(todos.filter(t => t.id !== todoId));
      setFilteredTodos(filteredTodos.filter(t => t.id !== todoId));
    } catch (e) {
      setError('Unable to delete a todo');
      setEditingTodosId(editingTodosId.filter(id => id !== todoId));
    }
  }

  async function handleEditTodoTitle(
    e: React.FormEvent<HTMLFormElement>,
    todo: Todo,
  ) {
    e.preventDefault();
    if (!selectedTodo) {
      return;
    }

    if (selectedTodo && !selectedTodo.title) {
      await handleRemoveTodo(todo.id);

      return;
    } else if (selectedTodo.title === todo.title) {
      setSelectedTodo(null);

      return;
    } else if (selectedTodo.title !== todo.title) {
      await handleEditTitleOfTodo(selectedTodo);

      return;
    }
  }

  useEffect(() => {
    if (selectedTodo) {
      TodoTitleFieldRef.current?.focus();
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          setTimeout(() => setSelectedTodo(null), 500);
        }
      });
    }

    return () => {
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          setTimeout(() => setSelectedTodo(null), 500);
        }
      });
    };
  }, [selectedTodo]);

  return (
    <TransitionGroup component={null}>
      {filteredTodos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
          unmountOnExit
          appear
          enter
          exit
        >
          {
            <TodoComponent
              key={todo.id}
              todo={todo}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
              handleEditTodoTitle={handleEditTodoTitle}
              handleRemoveTodo={handleRemoveTodo}
              handleUpdateTodoStatus={handleUpdateTodoStatus}
              TodoTitleFieldRef={TodoTitleFieldRef}
              handleSelectedTodoChange={handleSelectedTodoChange}
              editingTodosId={editingTodosId}
            />
          }
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}
