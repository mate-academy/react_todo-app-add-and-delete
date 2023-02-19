import React, { useEffect, useMemo, useState } from 'react';

import { removeTodos, saveTodo } from '../api/todos';

import { Todo } from '../types/Todo';
import { Header } from './Header';
import { Main } from './Main';
import { Footer } from './Footer';
import { TodoItem } from './TodoItem';

import { Filter } from '../types/Filter';
import { Error } from '../types/Error';

type Props = {
  todos: Todo[],
  changeTodos: (todos: Todo[]) => void,
  userId: number,
  onError: (errorText: Error) => void,
};

export const Content: React.FC<Props> = ({
  todos,
  changeTodos,
  userId,
  onError,
}) => {
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsAdded(true);

    if (newTodoTitle.length) {
      const newTodoData = {
        userId,
        title: newTodoTitle,
        completed: false,
      };

      setTempTodo({
        id: 0,
        userId,
        title: newTodoTitle,
        completed: false,
      });

      saveTodo(userId, newTodoData)
        .then(result => {
          changeTodos([...todos, result]);
          setNewTodoTitle('');
        })
        .catch(() => onError(Error.addError))
        .finally(() => {
          setIsAdded(false);
          setTempTodo(null);
        });
    } else {
      onError(Error.emptyError);
    }
  };

  const handleDeleteTodo = (id: number) => {
    setIsDeleted(true);

    removeTodos(id)
      .then(() => changeTodos(todos.filter(todo => todo.id !== id)))
      .catch(() => onError(Error.deleteError))
      .finally(() => setIsDeleted(false));
  };

  const handleDeleteCompletedTodo = () => {
    setIsDeleted(true);

    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodosId.forEach(id => {
      removeTodos(id)
        .then(() => changeTodos(todos.filter(todo => !todo.completed)))
        .catch(() => onError(Error.deleteError))
        .finally(() => setIsDeleted(false));
    });
  };

  useEffect(() => {
    setVisibleTodos(todos.filter(todo => {
      switch (filter) {
        case (Filter.all):
          return !!todo;

        case (Filter.active):
          return !todo.completed;

        case (Filter.completed):
          return todo.completed;

        default:
          return false;
      }
    }));
  }, [visibleTodos, filter]);

  const isAllActive = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );

  return (
    <div className="todoapp__content">
      <Header
        active={isAllActive}
        title={newTodoTitle}
        onChange={onChangeTitle}
        onAddTodo={handleAddTodo}
        onAdding={isAdded}
        todos={todos}
      />

      <Main
        visibleTodos={visibleTodos}
        onDeleting={isDeleted}
        onDeleteTodo={handleDeleteTodo}
      />

      {!tempTodo || <TodoItem todo={tempTodo} />}

      {(todos?.length || tempTodo) && (
        <Footer
          visibleTodos={visibleTodos}
          filter={filter}
          onChange={setFilter}
          onClearCompleted={handleDeleteCompletedTodo}
        />
      )}
    </div>
  );
};
