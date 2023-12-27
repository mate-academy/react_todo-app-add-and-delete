import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { StateContext } from '../../../libs/state';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../../libs/types';
import { getFilteredTodos, getHash } from '../../../libs/helpers';

export const TodoList: React.FC = () => {
  const { todos, tempTodo } = useContext(StateContext);

  const [filteredTodos, setFilterdTodos] = useState<Todo[]>([]);

  const updateFilteredTodos = useCallback((updatedTodos: Todo[]) => {
    const filterHash = getHash();
    const filtered = getFilteredTodos(updatedTodos, filterHash);

    setFilterdTodos(filtered);
  }, []);

  useEffect(() => {
    updateFilteredTodos(todos);
  }, [todos, updateFilteredTodos]);

  useEffect(() => {
    const handleHashChange = () => {
      updateFilteredTodos(todos);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [todos, updateFilteredTodos]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(item => (
        <TodoItem key={item.id} item={item} />
      ))}
      {!!tempTodo && (
        <TodoItem item={tempTodo} />
      )}
    </section>
  );
};
