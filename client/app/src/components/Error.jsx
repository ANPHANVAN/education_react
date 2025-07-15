import React from 'react';

export const Error = ({ status, message }) => {
  return (
    <div
      class="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400"
      role="alert"
    >
      <span class="font-medium">{message}</span>
      {
        //Change a few things up and try submitting again.
      }
    </div>
  );
};
