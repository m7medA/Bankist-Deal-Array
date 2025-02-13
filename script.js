'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Mohamed Ayman',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2025-01-22T23:36:17.929Z',
    '2025-01-23T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Youssef Ayman',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
//bankist project
const createUsername = function(accounts){
  accounts.forEach(function(account){
    account.username = account.owner.toLowerCase()
    .split(' ')
    .map(element => element[0])
    .join("");
  })
}
createUsername(accounts);

const formatCur = function(account,num){
  const options = {
    style: 'currency',
    unit: 'celsius',
    currency: account.currency,
    //useGrouping : false;
  };

  return new Intl.NumberFormat(account.locale,options).format(num);
}

const displayMovements = function (account, sort = false){
    containerMovements.innerHTML = '';

    const combinedmovDate = account.movements.map((mov,i) => 
      ({
        movement : mov,
        date : account.movementsDates.at(i)
      }));

    if(sort) combinedmovDate.sort((a,b) => a.movement - b.movement);

    combinedmovDate.forEach(function(obj,i){
      const {movement , date} = obj;
      const type = movement > 0 ? 'deposit' : 'withdrawal';
      const day = calcDayPassed(new Date(),new Date(date));
      const mov = formatCur(account,movement);

      const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__date">${(day<=7)?displayDate(day):new Intl.DateTimeFormat(account.locale,{
            day: 'numeric',
            month: 'numeric',//long
            year: 'numeric',
            // weekday: 'long',
          }).format(new Date(date))}</div>
          <div class="movements__value">${mov}</div>
        </div>
      `;
      containerMovements.insertAdjacentHTML('afterbegin', html);
    });
}

const calcDisplaySummary = function(account){
  const income = account.movements.filter( mov => mov > 0).reduce( (accu , curr) => accu + curr ,0);
  const out = account.movements.filter( mov => mov < 0).reduce( (accu , curr) => accu + curr ,0);
  const interest = account.movements.filter( mov => mov > 0).map( mov => mov*account.interestRate/100).filter( int => int >= 1).reduce( (accu , curr) => accu + curr ,0);
  labelSumIn.textContent = `${formatCur(account,income)}`;
  labelSumOut.textContent = `${formatCur(account,Math.abs(out))}`;
  labelSumInterest.textContent = `${formatCur(account,interest)}`;
}

const calcDisplayBalance = function(account){
  account.balance = account.movements.reduce((accum,curr) => accum+curr ,0);
  labelBalance.textContent = `${formatCur(account,account.balance)}`;
}

const currentDate = function(acc){
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',//long
    year: 'numeric',
    // weekday: 'long',
  }
  labelDate.textContent = `${new Intl.DateTimeFormat(acc.locale,options).format(now)}`;
}

const calcDayPassed = (date1,date2) => Math.round(Math.abs((date2-date1))/(1000*60*60*24));

const displayDate = function(numDay){
  if(numDay===0) return "Today";
  if(numDay===1)return "Yesterday";
  return `${numDay} Days Ago`;
}

const displayUI = function(currentAccount){
      //display movments
      displayMovements(currentAccount);

      //display balance
      calcDisplayBalance(currentAccount);
  
      //display summary
      calcDisplaySummary(currentAccount);
      
      //calc Date
      currentDate(currentAccount);
}

const logOutTimer = function(){
  //set time 5 minute
  let time = 300;
  const tick = function(){
    //call the timer every second 
    const minute = String(Math.trunc(time/60)).padStart(2,0);
    const second = String(time%60).padStart(2,0);
    labelTimer.textContent = `${minute}:${second}`;
    //whhen timer = 0 close
    if(time===0){
      clearInterval(timerClose);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = '0';
    }
    //decrease
    time--;
  }
  tick();
  const timerClose = setInterval(tick,1000);
  return timerClose;
}

let currentAccount,timer ;
//fake open
// currentAccount = account1;
// displayUI(currentAccount);
// containerApp.style.opacity = '1';

btnLogin.addEventListener('click',function(event){
  //prevent form from submiting
  event.preventDefault();
  if(timer) clearInterval(timer);
  timer = logOutTimer();
  currentAccount = accounts.find( acc => acc.username === inputLoginUsername.value);
  
  if(currentAccount?.pin == inputLoginPin.value ){
    //Display UI message
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(" ")[0]}!`;
    containerApp.style.opacity = '1';

    //clear field inputs
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    //update UI
    displayUI(currentAccount);
  }
});

btnTransfer.addEventListener('click',function(event){
  event.preventDefault();
  if(timer) clearInterval(timer);
  timer = logOutTimer();
  const receiverAcc = accounts.find( acc => acc.username === inputTransferTo.value);
  const amount = Number(inputTransferAmount.value);
  inputTransferTo.value = inputTransferAmount.value = "";
  
  if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username){
    //doing the transfer
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movements.push(amount);    
    receiverAcc.movementsDates.push(new Date().toISOString());
    //update UI
    displayUI(currentAccount);
  }
});

btnLoan.addEventListener('click',function(event){
  event.preventDefault();
  if(timer) clearInterval(timer);
  timer = logOutTimer();
  const amount = Math.floor(+inputLoanAmount.value);
  inputLoanAmount.value = '';
  setTimeout(() =>{
    if(amount > 0 && currentAccount.movements.some( mov => mov >= amount*0.1 )){
      //add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      //update UI
      displayUI(currentAccount);
    }
  },2500)
});

btnClose.addEventListener('click',function(event){
  event.preventDefault();
  if(inputCloseUsername.value === currentAccount.username && +inputClosePin.value ===currentAccount.pin){
    const index = accounts.findIndex( acc => acc.username === currentAccount.username);
    //delete account
    accounts.splice(index,1);

    // hide UI
    containerApp.style.opacity = '0';
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sort = false;
btnSort.addEventListener('click', function(event){
  event.preventDefault();
  sort = !sort;
  displayMovements(currentAccount, sort);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//179. Converting and Checking Numbers
// console.log(0.1 + 0.2);
// console.log(0.1 + 0.2 === 0.3);//false

// console.log(Number.parseInt("30px"));
// console.log(Number.parseInt("   2.5rem"));
// console.log(Number.parseFloat("   2.5rem"));

//180. Math and Rounding
// const intRandom = (min,max) => Math.floor(Math.random() * (max-min+1) + min);
// console.log(intRandom(10,20));

//183. Working with BigInt
// console.log(20n > 15);
// console.log(20n === 20);
// console.log(20n == '20');
// console.log(10n / 3n); //make cutoff and return positive number
// console.log(10 / 3);
// console.log(Math.sqrt(16n));

//184. Creating Dates
// const now = new Date();
// console.log(now);
// console.log(new Date(2004,4,3,4,13,20));
// console.log(now.getFullYear());
// console.log(now.getMonth()+1);
// console.log(now.getDate());
// console.log(now.getDay());// number of day in week
// console.log(now.getHours());
// console.log(now.getMinutes());
// console.log(now.getSeconds());
// console.log(now.getMilliseconds());
// console.log(now.toISOString());//good format for date
// console.log(now.getTime());// return time from 1970 to now by milleSeconds
// console.log(new Date(1737735583719));

//187. Operations With Dates
// const future = new Date();
// console.log(+future);
// const calcDayPassed = (date1,date2) => Math.round(Math.abs((date2-date1))/(1000*60*60*24));
// const date1 = calcDayPassed(new Date(2025,3,5),new Date(2025,3,15));
// console.log(date1);

//188. Internationalizing Dates (Intl)
// const now = new Date();
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric',
//   weekday: 'long',
// }
// console.log(new Intl.DateTimeFormat('en-US',options).format(now));
// //to give format from browser 
// const local = navigator.language;
// console.log(local);
// console.log(new Intl.DateTimeFormat(local,options).format(now));

//189. Internationalizing Numbers (Intl)
// const num = 32145.25;
// const options = {
//   style: 'currency',
//   unit: 'celsius',
//   currency: 'EGP',
//   //useGrouping : false;
// };

// console.log('US:   ',new Intl.NumberFormat('en-US',options).format(num));
// console.log('DE:   ',new Intl.NumberFormat('de-DE',options).format(num));
// console.log('EGP:   ',new Intl.NumberFormat('ar-EG',options).format(num));
// console.log(navigator.language,new Intl.NumberFormat(navigator.language).format(num));

//190. Timers: setTimeout and setInterval
// const ingred = ['Olives','Beef'];
// const pizzaTimer = setTimeout((ing1,ing2) => console.log(`Here is your pizza🍕 ${ing1} and ${ing2}`),3000,...ingred);
// console.log('...waiting');
// if(ingred.includes('Beef')) clearTimeout(pizzaTimer);

// setInterval(function(){ 
//   const now = new Date();
//   console.log(now)},3000);



