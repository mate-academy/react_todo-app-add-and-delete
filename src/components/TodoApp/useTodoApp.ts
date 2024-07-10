import { useContext, useEffect, useMemo, useState } from 'react';

import { deleteTodo, getTodos } from '../../api/todos';
import { Filter } from '../../types/common';
import { extractFilter } from '../../utils/helpers';
import { ErrorContext } from '../../context/Error.context';
import { TodoContext } from '../../context/Todo.context';

export const useTodoApp = () => {
  const { hash } = window.location;
  const initialFilter = extractFilter(hash);

  const {
    todos,
    inputRef,
    onAddTodos,
    onAddLoadingId,
    onDeleteTodo,
    clearLoadingIds,
  } = useContext(TodoContext);

  const [filter, setFilter] = useState<Filter | null>(initialFilter);
  const { onError } = useContext(ErrorContext);

  const { activeTodosQty, completedTodosQty } = useMemo(() => {
    if (!todos) {
      return {
        activeTodosQty: 0,
        completedTodosQty: 0,
      };
    }

    const activeTodos = todos.filter(({ completed }) => !completed);
    const activeTodosLength = activeTodos.length;

    return {
      activeTodosQty: activeTodosLength,
      completedTodosQty: todos.length - activeTodosLength,
    };
  }, [todos]);

  const filteredTodos = useMemo(() => {
    if (!filter) {
      return todos;
    }

    return todos.filter(({ completed }) => {
      if (filter === Filter.completed) {
        return completed;
      }

      return !completed;
    });
  }, [todos, filter]);

  useEffect(() => {
    getTodos()
      .then(response => {
        onAddTodos(response);
      })
      .catch(() => {
        onError('Unable to load todos');
      });
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  const onFilter = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const { href } = event.currentTarget;
    const selected = extractFilter(href);

    setFilter(selected);
  };

  const onDeleteAllCompleted = async () => {
    const completedTodos = todos.filter(({ completed }) => completed);
    const completedTodosPromises = completedTodos.map(({ id }) => {
      onAddLoadingId(id);

      return deleteTodo(id);
    });

    try {
      const result = await Promise.allSettled(completedTodosPromises);

      result.forEach(({ status }, idx) => {
        if (status === 'fulfilled') {
          const deletedTodo = completedTodos[idx];

          onDeleteTodo(deletedTodo.id);
        } else {
          onError('Unable to delete a todo');
        }
      });
    } catch {
      onError('Unable to delete a todo');
    } finally {
      clearLoadingIds();
      inputRef.current?.focus();
    }
  };

  return {
    todos: filteredTodos,
    filter,
    activeTodosQty,
    completedTodosQty,
    isFooterShown: !!todos.length,
    onFilter,
    onDeleteAllCompleted,
  };
};
