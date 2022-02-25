//create variable to hold db connection

let db;

//establish connection to indedDb db called 'pizza_hunt' and set to version 1

const request = indexedDB.open('pizza_hunt', 1)

request.onupgradeneeded = function(event) {
    //save ref to db
    const db = event.target.result;
    //create an object storre (table ) called new_pizza aet it to have autoincrement id
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

//when successful request

request.onsuccess = function(event) {
    //save ref to db in global variable
    db = event.target.result;

    //check if app is online
    if(navigator.onLine) {
       uploadPizza();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode)
};

//funct run after attemt to submit new pizza

function saveRecord(record) {
    //open new transaction with db and add read.write permission
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access object store for newpizza
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    //add record to store w add method

    pizzaObjectStore.add(record)
}

function uploadPizza() {
    //open trans on db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access obj store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    const getAll = pizzaObjectStore.getAll();

    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
          fetch('/api/pizzas', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          })
            .then(response => response.json())
            .then(serverResponse => {
              if (serverResponse.message) {
                throw new Error(serverResponse);
              }
              // open one more transaction
              const transaction = db.transaction(['new_pizza'], 'readwrite');
              // access the new_pizza object store
              const pizzaObjectStore = transaction.objectStore('new_pizza');
              // clear all items in your store
              pizzaObjectStore.clear();
    
              alert('All saved pizza has been submitted!');
            })
            .catch(err => {
              console.log(err);
            });
        }
      };
};

window.addEventListener('online', uploadPizza);