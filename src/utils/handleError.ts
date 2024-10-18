import { Errors } from './Errors';

export const handleError = (
  error: Errors,
  setErrorMessage: (error: Errors) => void,
) => {
  setErrorMessage(error);
  setTimeout(() => setErrorMessage(Errors.Default), 3000);
};
