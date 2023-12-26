import { State } from '../types/State';
import { Action } from '../types/Action';

export const stateReducer = (state: State, action: Action): State => {
  let todos = [...state.todos];
  let loadings = [...state.loadings];

  switch (action.type) {
    case 'setTodos':
      todos = [...action.payload];

      return {
        ...state,
        todos,
      };

    case 'setTempTodo':
      return {
        ...state,
        tempTodo: action.payload,
      };

    case 'addTodo':
      todos.push(action.payload);

      return {
        ...state,
        todos,
      };

    case 'editTodo':
      todos = state.todos.map(todo => (
        todo.id === action.payload.id
          ? { ...todo, title: action.payload.title }
          : todo
      ));

      return {
        ...state,
        todos,
      };

    case 'deleteTodo':
      todos = state.todos.filter(todo => todo.id !== action.payload.id);

      return {
        ...state,
        todos,
      };

    case 'toggleTodo':
      todos = state.todos.map(todo => (
        todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed }
          : todo
      ));

      return {
        ...state,
        todos,
      };

    case 'addLoading':
      loadings.push(action.payload);

      return {
        ...state,
        loadings,
      };

    case 'deleteLoading':
      loadings = loadings.filter(loading => loading.id !== action.payload.id);

      return {
        ...state,
        loadings,
      };

    case 'setInputValue':
      return {
        ...state,
        inputValue: action.payload,
      };

    case 'setFilter':
      return {
        ...state,
        filter: action.payload,
      };

    case 'setError':
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
