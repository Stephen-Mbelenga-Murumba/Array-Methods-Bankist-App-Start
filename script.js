'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = (movements, sort = false) => {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach((mov, idx) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      idx + 1
    } ${type}</div>
          <div class="movements__value">${mov} €</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//// Show Account Balance
const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce(
    (accumulator, currentVal) => accumulator + currentVal,
    0
  );
  labelBalance.textContent = `${acc.balance} €`;
};
//// Create accounts summary
const calcDisplaySummary = acc => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} €`;
  const withdrawals = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(withdrawals)} €`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} €`;
};
//// Refactor
const updateUI = acc => {
  //// Display movements
  displayMovements(acc.movements);
  //// Display Balance
  calcDisplayBalance(acc);
  //// Display summary
  calcDisplaySummary(acc);
};
//////////////////
//// Event Handlers
let currentAccount;
btnLogin.addEventListener('click', e => {
  // Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //// Display UI message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //// Display UI
    containerApp.style.opacity = 100;
    //// Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //// Update UI
    updateUI(currentAccount);
  }
});
//// Implementing Transfers
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    //// Doing Transfers
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    ////// Update UI
    updateUI(currentAccount);
  }
});
//// Implementing Request Loan
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movements
    currentAccount.movements.push(amount);
    //// update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});
//// Implementing Close Account
btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    // console.log(index);
    //// Delete Account
    accounts.splice(index, 1);
    //// Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
//// Implementing Sort Function
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
////Compute User Names
const createUserName = accs => {
  accs.forEach(
    acc =>
      (acc.userName = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
};

createUserName(accounts);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
// Simple Array Methods
// SLICE

let arr = ['a', 'b', 'c', 'd', 'e'];

console.log([...arr].slice(1, -1));
console.log([...arr].slice(2, 4));
console.log([...arr].slice(-1));
console.log([...arr].slice(-2));
console.log([...arr].slice(1, 4));
//
// SPLICE
// arr.splice(-1);
// console.log(arr);
console.log([...arr].splice(-1));
console.log([...arr].slice(2, 4));
console.log([...arr].slice(0, 3));
console.log([...arr].slice(1, 3));
console.log(arr);
//
// REVERSE
const newArr = ['j', 'i', 'h', 'g', 'f'];
const letters = [...newArr].reverse();
console.log(letters, newArr);
//
// CONCAT
const alphaBet = [...arr].concat(letters);
const alphaBet2 = [...arr, ...letters];
console.log(alphaBet, alphaBet2);
// JOIN
console.log(alphaBet2.join('-'));
//

//// The new at Method
const arr = [23, 65, 14, 64];
// Getting elements at different positions
console.log(arr.at(-1)); // 64
console.log(arr.at(1), arr.splice(-1)[0]); // 64
console.log(arr[0], arr.at(0)); // 23
//
// LOOPING ARRAYS: forEach()
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [idx, movement] of movements.entries()) {
//   movement > 0
//     ? console.log(`Transaction ${idx + 1}: You deposited ${movement}`)
//     : console.log(`Transaction ${idx + 1}: You withdrew ${Math.abs(movement)}`);
// }

movements.forEach(function (movement, index) {
  movement > 0
    ? console.log(`Transaction ${index + 1}: You deposited ${movement}`)
    : console.log(
        `Transaction ${index + 1}: You withdrew ${Math.abs(movement)}`
      );
});
// forEach() Maps and Sets
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
currencies.forEach((value, key) => {
  console.log(`${key} : ${value}`);
});

const currenciesUnique = new Set([
  'KSH',
  'GBP',
  'EURO',
  'YEN',
  'UGS',
  'DIR',
  'GBP',
  'EURO',
  'YEN',
  'UGS',
]);
currenciesUnique.forEach((value, key) => {
  console.log(`${key}: ${value}`);
}); */
/////////////////////////////////////////
///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// const checkDogs = function (dogsJulia, dogsKate) {
//   const juliaArr = [...dogsJulia].splice(1, 2);
//   const corrected = [...juliaArr, ...dogsKate];
//   // console.log(corrected);
//   corrected.forEach((val, idx) => {
//     const type = val < 3 ? 'still a puppy 🐶' : 'an adult 🐕';
//     console.log(`Dog number ${idx + 1} is ${type}, and is ${val} years old`);
//   });
// };
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// // checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
//////////////
//// DATA TRANSFORMATIONS: map, filter, reduce
// map()
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const euroToUSD = 1.1;
// const conversionToUSD = movements.map(mov => mov * euroToUSD);
// console.log(conversionToUSD);
// const movementsDescription = movements.map(
//   (mov, idx) =>
//     `Transaction ${idx + 1}:  You ${
//       mov > 0 ? 'deposited' : 'withdrew'
//     } ${Math.abs(mov)}
// )`
// );
// console.log(movementsDescription);
//// filter()
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposits = movements.filter(mov => mov > 0);
// const withdrawals = movements.filter(mov => mov < 0);
// console.log(deposits);
// console.log(withdrawals);
//
////reduce () ---> SNOWBALL
// const balance = movements.reduce((accumulator, currentVal, idx) => {
//   console.log(`Iteration ${idx}: ${accumulator}`);
//   return accumulator + currentVal;
// }, 0);
// const balance = movements.reduce(
//   (accumulator, currentVal) => accumulator + currentVal,
//   0
// );
// console.log(balance);
//// Calculate Max Value with reduce
// const max = movements.reduce((acc, val) => {
//   if (acc > val) return acc;
//   else return val;
// }, movements[0]);
// const max = movements.reduce(
//   (acc, val) => (acc > val ? acc : val),
//   movements[0]
// );
// console.log(max);
///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
const calcAverageHumanAge = ages => {
  const humanAge = ages.map(age => (age <= 2 ? age * 2 : 16 + age * 4));
  const adults = humanAge.filter(age => age >= 18);
  // console.log(humanAge, adults);
  const averageAge = adults.reduce((acc, val) => acc + val, 0) / adults.length;
  return averageAge;
};
const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2);
//// CHAINING METHODS
// const euroToUSD = 1.1;
// const totalDeposits = movements
//   .filter(val => val > 0)
//   .map(val => val * euroToUSD)
//   .reduce((acc, val) => acc + val, 0);
// console.log(totalDeposits);
//// SOLUTION USING ARROW FUNCTION & CHAINING
const calcAverageHumanAge = ages => {
  const averageAge = ages
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, val, idx, arr) => acc + val / arr.length, 0);
  return averageAge;
};
const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2); */
////// FIND METHOD
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal);
// console.log(accounts);

// const checkOwner = accounts.find(acc => acc.owner === 'Sarah Smith');
// console.log(checkOwner);
// for...of
//////////////////////////////////
///// some & every
// console.log(movements);
//// EQUALITY
// const val = movements.includes(-130);
// console.log(val);
//
//// SOME:CONDITION
// const val2 = movements.some(mov => mov > 1500);
// console.log(val2);
// EVERY
// const deposits = account4.movements.every(val => val > 0);
// console.log(deposits);
////
//// FLAT & FLAT MAP
// const arr = [1, 2, 3, 4, 5, 6, 7, 9];
// console.log(arr.flat());
// const newArr = [[[1, 2], 3], 4, [[5, 6, 7], 9]];
// console.log(newArr.flat(2));
//
// const accountsMovements = accounts.map(acc => acc.movements);
// console.log(accountsMovements);
// const allMovements = accountsMovements.flat();
// console.log(allMovements);
// const overallDeposits = allMovements.reduce((acc, val) => acc + val, 0);
// console.log(overallDeposits);
//// CHAINING
//// flat
// const overallDeposits = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((accum, val) => accum + val, 0);
// console.log(overallDeposits);
//// flatMap
// const totalDeposits = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((accum, val) => accum + val, 0);
// console.log(totalDeposits);
//// SORTING ARRAYS
// const owners = ['Zach', 'Steve', 'Martha', 'Abel', 'Ben'];
// console.log([...owners].sort());
// //
// //// return a < 0, A, B Keep Order
// //// return a > 0, B, A Switch Order
// console.log(movements);
// //// Ascending Order
// // const movementSorted = [...movements].sort((a, b) => {
// //   if (a > b) return 1;
// //   if (a < b) return -1;
// // });
// const movementSorted = [...movements].sort((a, b) => a - b);
// console.log(movementSorted);
// //// Descending order
// // const movementsSorted = [...movements].sort((a, b) => {
// //   if (a > b) return -1;
// //   if (a < b) return 1;
// // });
// const movementsSorted = [...movements].sort((a, b) => b - a);
// console.log(movementsSorted);
//////////////////////////////////////
/////// MORE WAYS OF CREATING AND FILLING ARRAYS
// const arr = [1, 2, 3, 4, 5, 6, 7, 8];
// const newArr = new Array([...arr]);
// // console.log(arr, newArr);
// //// Empty arrays + fill method
// const arr2 = new Array(7); // Creates an empty array with a length of 7
// console.log(arr2);
// console.log(arr2.fill(1));
// // console.log(arr2.fill(1, 3, 6));
// console.log(arr2.fill(23, 3, 6));
//////
//// Array.from
// const y = Array.from({ length: 7 }, () => 1); // creates an array 1s of length 7
// console.log(y);
// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z, typeof z);
/////
// labelBalance.addEventListener('click', () => {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements_value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);
// });
//////////ARRAY PRACTICE////
//// 1.
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(val => val > 0)
//   .reduce((accum, currentVal) => accum + currentVal, 0);
// console.log(bankDepositSum);
// ///////
// //// 2.
// // const numDeposits1000 = accounts
// //   .flatMap(acc => acc.movements)
// //   .filter(mov => mov >= 1000).length;
// // console.log(numDeposits1000);
// //
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, curVal) => (curVal >= 1000 ? ++count : count), 0);
// console.log(numDeposits1000);
// /////////
// // Prefixed ++ Operator
// // let a = 10;
// // console.log(a++); //// Output: 10
// // console.log(a); //// Output: 11
// ////
// // let a = 10;
// // console.log(++a); //// Output: 11
// // console.log(a); //// Output: 1
// /////////
// ////// 3.
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sum, curVal) => {
//       // curVal > 0 ? (sum.deposits += curVal) : (sum.withdrawals += curVal);
//       // return sum; Refactor
//       sum[curVal > 0 ? 'deposits' : 'withdrawals'] += curVal;
//       return sum;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, Math.abs(withdrawals));
///////////
//// 4.
//// this is a nice title --> This Is a Nice Title
// const convertTitleCase = title => {
//   const capitalizeStr = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ['a', 'in', 'and', 'on', 'the', 'but', 'or', 'in', 'with'];
//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalizeStr(word)))
//     .join(' ');
//   return capitalizeStr(titleCase);
// };

// console.log(convertTitleCase('this is a NICE title'));
// console.log(convertTitleCase('this is A LONG title but not too LoNg'));
// console.log(convertTitleCase('and HERE is another TITLE with an Example.'));
// console.log(convertTitleCase('this is a NICE title TOO'));
///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
// // 1.
// dogs.forEach(dog => (dog.recFood = Math.ceil(dog.weight ** 0.75 * 28)));
// // console.log(dogs);
// //
// // 2.
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// // console.log(dogSarah);
// console.log(
//   `Sarah's dog eats too ${
//     dogSarah.curFood > dogSarah.recFood ? 'much.' : 'little.'
//   }`
// );
// ////
// // 3, 4, 5.
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recFood)
//   .flatMap(dog => dog.owners);
// console.log(`${ownersEatTooMuch.join(' and ')} dogs eats too much.`);

// //
// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recFood)
//   .flatMap(dog => dog.owners);
// console.log(`${ownersEatTooLittle.join(' and ')} dogs eat too little.`);
// ////
// //// 6.
// // const okFood = dogs.some(dog => dog.curFood === dog.recFood);
// // console.log(okFood);
// /////
// //// 7. Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10)
// const checkEatingOk = dog => {
//   return dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
// };
// console.log(dogs.some(checkEatingOk));
// //
// console.log(dogs.filter(checkEatingOk));
// ////////
// //// 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

// const sortedRecFood = dogs.slice().sort((a, b) => a.recFood - b.recFood);
// console.log(sortedRecFood);
