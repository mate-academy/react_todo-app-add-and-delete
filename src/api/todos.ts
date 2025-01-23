import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2248;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const getCompletedTodos = (allTodos: Todo[]) => {
  return allTodos.filter(todo => todo.completed);
};

export const getActiveTodos = (allTodos: Todo[]) => {
  return allTodos.filter(todo => !todo.completed);
};

export enum FilterEnum {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const filterTodos = (curFilter: FilterEnum, allTodos: Todo[]) => {
  switch (curFilter) {
    case FilterEnum.ALL:
      return allTodos;
    case FilterEnum.ACTIVE:
      const activeTodos = getActiveTodos(allTodos);

      return activeTodos;
    case FilterEnum.COMPLETED:
      const completedTodos = getCompletedTodos(allTodos);

      return completedTodos;
    default:
      throw new Error(`Unsupported filter type: ${curFilter}`);
  }
};

export const deleteTodo = (
  id: number,
  allTodos: Todo[],
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setLoadingTodoId: React.Dispatch<React.SetStateAction<number>>,
  selectedFilter: FilterEnum,
) => {
  setLoading(true);
  setLoadingTodoId(id);
  client
    .delete(`/todos/${id}`)
    .then(() => {
      const updatedTodos = allTodos.filter(todo => todo.id !== id);

      setAllTodos(updatedTodos);
      filterTodos(selectedFilter, allTodos);
    })
    .catch(() => {
      setError(true);
      setErrorMessage('Unable to delete a todo');
    })
    .finally(() => {
      setLoading(false);
    });
};

export const addTodo = (
  inputText: string,
  setError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setInputText: React.Dispatch<React.SetStateAction<string>>,
  allTodos: Todo[],
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  event: React.FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();
  setLoading(true);

  if (inputText.trim() === '') {
    setError(true);
    setErrorMessage('Title should not be empty');
    setLoading(false);

    return;
  }

  const newId =
    allTodos.length === 0 ? 1 : Math.max(...allTodos.map(todo => todo.id)) + 1;

  const newTodo = {
    id: newId,
    userId: 2248,
    completed: false,
    title: inputText.trim(),
  };

  const tempTodo = {
    ...newTodo,
    id: 0,
  };

  setTempTodo(tempTodo);

  client
    .post('/todos', newTodo)
    .then(() => {
      setAllTodos(prevTodos => [...prevTodos, newTodo]);
      setInputText('');
      setTempTodo(null);
    })
    .catch(() => {
      setError(true);
      setErrorMessage('Unable to add a todo');
    })
    .finally(() => {
      setLoading(false);
    });
};

export const clearCompleted = async (
  allTodos: Todo[],
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const todosIdToDelete = allTodos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const deletedIds: number[] = [];

  if (todosIdToDelete.length === 0) {
    return;
  }

  setLoading(true);

  try {
    await Promise.all(
      todosIdToDelete.map(async id => {
        try {
          await client.delete(`/todos/${id}`);
          deletedIds.push(id);
        } catch (error) {
          setError(true);
          setErrorMessage('Unable to delete a todo');
        }
      }),
    );

    setAllTodos(allTodos.filter(todo => !deletedIds.includes(todo.id)));
  } catch (error) {
    setError(true);
    setErrorMessage('Unable to delete one or more todos');
  } finally {
    setLoading(false);
  }
};

export const filterClick = (
  setSelectedFilter: React.Dispatch<React.SetStateAction<FilterEnum>>,
  curFilter: FilterEnum,
  selectedFilter: string,
  allTodos: Todo[],
) => {
  if (selectedFilter === curFilter) {
    return;
  }

  setSelectedFilter(curFilter);
  filterTodos(curFilter, allTodos);
};
