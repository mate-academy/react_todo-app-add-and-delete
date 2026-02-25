type Error = 'loading' | 'empty' | 'add' | 'delete' | 'update';

export interface ErrorType {
  type: Error;
  time: number;
}
