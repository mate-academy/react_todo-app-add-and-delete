import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useProducer, Producer } from '../../hooks/useProducer';

import { Todo, TodoPatchProps } from '../../types';

import server from '../../api/todos';
import ErrorsContext from '../Errors/ErrorsContext';

type State = {
  todos: Todo[];
  pendingTodo: Todo | null;
};

const StateContext = React.createContext<State | null>(null);

type Contract = {
  addTodo: (title: string) => Promise<void>;

  deleteTodo: Producer<() => void, (id: number) => Promise<void>>;

  updateTodo: (id: number, props: TodoPatchProps) => Promise<void>;
  clearCompleted: Producer<() => void, () => Promise<void>>;
};

const ContractContext = React.createContext<Contract | null>(null);

const Provider = ({ children }: PropsWithChildren) => {
  const { raiseError } = ErrorsContext.useContract();

  const [todos, setTodos] = useState([] as Todo[]);
  const [pendingTodo, setPeningTodo] = useState<Todo | null>(null);

  useEffect(() => {
    server
      .getTodos()
      .then(setTodos)
      .catch(() => raiseError('Unable to load todos'));
  }, [raiseError]);

  const state: State = {
    todos,
    pendingTodo,
  };

  const contract: Contract = {
    addTodo: async (title: string) => {
      const knownData = {
        title,
        userId: server.USER_ID,
        completed: false,
      };

      setPeningTodo({ ...knownData, id: 0 });

      try {
        const newTodo = await server.addTodo(knownData);

        setTodos(prev => [...prev, newTodo]);
      } catch (error) {
        raiseError('Unable to add a todo');

        throw error;
      } finally {
        setPeningTodo(null);
      }
    },

    deleteTodo: useProducer(async (consumers, id) => {
      try {
        await server.deleteTodo(id);

        setTodos(prev => prev.filter(todo => todo.id !== id));
      } catch {
        raiseError('Unable to delete a todo');
      }

      for (const consumer of consumers) {
        consumer();
      }
    }),

    updateTodo: async (id, props) => {
      try {
        await server.updateTodo(id, props);
      } catch {
        raiseError('Unable to update a todo');
      }

      setTodos(prev =>
        prev.map(item => (item.id === id ? { ...item, ...props } : item)),
      );
    },

    clearCompleted: useProducer(async consumers => {
      const completedIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      const results = await Promise.allSettled(
        completedIds.map(id => server.deleteTodo(id)),
      );

      const isDeleteError = results.some(({ status }) => status === 'rejected');

      if (isDeleteError) {
        raiseError('Unable to delete a todo');
      }

      const idsToRemove = results
        .map((result, index) => ({
          id: completedIds[index],
          isFulfilled: result.status === 'fulfilled',
        }))
        .filter(({ isFulfilled }) => isFulfilled)
        .map(({ id }) => id);

      setTodos(prev => prev.filter(todo => !idsToRemove.includes(todo.id)));

      for (const consumer of consumers) {
        consumer();
      }
    }),
  };

  return (
    <StateContext.Provider value={state}>
      <ContractContext.Provider value={contract}>
        {children}
      </ContractContext.Provider>
    </StateContext.Provider>
  );
};

export default {
  Provider,
  useState: () => useContext(StateContext) as State,
  useContract: () => useContext(ContractContext) as Contract,
};
