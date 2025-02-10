import React from 'react';

export const inputChange = (e: any, setState: React.Dispatch<React.SetStateAction<any>>) => {
    e.preventDefault()
  const { name, value } = e.target;
  setState((prevState: any) => ({
    ...prevState,
    [name]: value,
  }

));
};