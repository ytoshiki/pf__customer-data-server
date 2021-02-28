import { generateDate } from './generateDate';
import axios from 'axios';
// One Time Only
// Set Default customers for a testing purpose

interface CustomerData {
  gender: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  dob: {
    age: number;
  };
  picture: {
    large: string;
    medium: string;
  };
  nat: string;
  registered: {
    date: string;
  };
}

export const generateCustomers = async () => {
  try {
    const response_01 = await axios('https://randomuser.me/api/?results=200&nat=gb,dk,fr,no,nl');
    const data_01 = await response_01.data;

    const customers_01: CustomerData[] = data_01.results;

    const customers_02 = customers_01.map((customer) => {
      return {
        username: customer.name.first + ' ' + customer.name.last,
        age: Math.floor(Math.random() * 25 + 17),
        nat: customer.nat,
        avator: customer.picture.large,
        email: customer.email,
        dateRegistered: generateDate(),
        gender: customer.gender
      };
    });

    return customers_02;
  } catch (error) {}
};
