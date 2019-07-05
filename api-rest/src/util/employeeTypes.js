/* eslint-disable import/prefer-default-export */
const types = new Map();
types.set('0', 'Employee');
types.set('1', 'Freelancer');

export const getType = value => types.get(value.toString());
