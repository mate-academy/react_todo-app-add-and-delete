import { useEffect, useState } from 'react';
import { deleteTodo, getTodos, postTodo } from '../api/todos';
import { TodoType } from '../types/Todo';
import { useErrorsContext }
  from '../providers/ErrorsProvider/ErrorsProvider';
import { Filters } from '../types/Filters';

export const useTodos = (userId: number) => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [loadingTodos, setLoadingTodos] = useState<boolean>(true);
  const { addError } = useErrorsContext();
  const [filter, setFilter] = useState<Filters>('all');
  const [uploading, setUploading] = useState<number[]>([]);
  const [clearInput, setClearInput] = useState<boolean | null>(null);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);

  useEffect(() => {
    getTodos(userId)
      .then(setTodos)
      .catch(() => addError('errorLoadingTodos'))
      .finally(() => setLoadingTodos(false));
  }, [userId]);

  const handleFilter = (fil: Filters) => {
    setFilter(fil);
  };

  const addTodo = (todo: TodoType) => {
    setUploading(prev => prev.concat(todo.id));
    setClearInput(null);
    setTodos(prev => [...prev, todo]);
    postTodo(userId, {
      completed: todo.completed,
      title: todo.title,
      userId,
    })
      .then(response => setTodos(prev => prev.map(t => {
        if (t.id === todo.id) {
          return {
            ...response,
          };
        }

        return t;
      })))
      .then(() => {
        setTempTodo({
          id: 0,
          userId,
          completed: false,
          title: 'tempTodo',
        });
      })
      .then(() => setClearInput(true))
      .catch(() => {
        addError('errorUnableToAddTodo');
        setTodos(prev => prev.filter(t => t.id !== todo.id));
        setTempTodo(null);
        setClearInput(false);
      })
      .finally(() => setUploading([]));
  };

  const editTodo = (todo: TodoType) => {
    setUploading([todo.id]);
    setTodos(prev => prev.map(t => {
      if (t.id === todo.id) {
        return todo;
      }

      return t;
    }));
    setUploading([]);
  };

  const delTodo = (todo: TodoType) => {
    setUploading(prev => prev.concat(todo.id));

    deleteTodo(todo)
      .then(() => setTodos(prev => prev.filter(t => t.id !== todo.id)))
      .catch(() => addError('errorUnableToDeleteTodo'))
      .finally(() => {
        setUploading([]);
      });
  };

  const visibleTodos = (fil: Filters) => {
    if (fil === 'active') {
      return [...todos].filter(todo => todo.completed === false);
    }

    if (fil === 'completed') {
      return [...todos].filter(todo => todo.completed === true);
    }

    return todos;
  };

  const visTodo = visibleTodos(filter);

  return {
    todos,
    loadingTodos,
    addTodo,
    setTodos,
    handleFilter,
    filter,
    visTodo,
    uploading,
    editTodo,
    delTodo,
    tempTodo,
    clearInput,
  };
};
