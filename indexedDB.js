// indexedDBの設定
const dbName = 'kakeiboDB';
const storeName = 'kakeiboStore';
const dbVersion = 1;

// データベース接続
let database = indexedDB.open(dbName, dbVersion);

database.onupgradeneeded = function (event) {
  let db = event.target.result;
  db.createObjectStore(storeName, { keyPath: 'id' });
  console.log('データベースを新規作成しました');
};

database.onsuccess = function (event) {
  let db = event.target.result;
  db.close();
  console.log('データベースに接続できました');
};
database.onerror = function (event) {
  console.log('データベースに接続できませんでした');
};

/** フォームの内容をDBに登録 */
function regist() {
  if (inputCheck() === false) {
    return;
  }

  let radio = document.getElementsByName('balance');
  for (let i = 0; i < radio.length; i++) {
    if (radio[i].checked === true) {
      balance = radio[i].value;
      break;
    }
  }

  let date = document.getElementById('date').value;
  let category = document.getElementById('category').value;
  let amount = document.getElementById('amount').value;
  let memo = document.getElementById('memo').value;

  if (balance === '収入') {
    category = '収入';
  }

  // データベースに登録
  insertData(balance, date, category, amount, memo);
}

/** データ登録 */
function insertData(balance, date, category, amount, memo) {
  // 一意のIDを作成
  let uniqueID = new Date().getTime().toString();
  console.log(uniqueID);
  const data = {
    id: uniqueID,
    balance: balance,
    date: String(date),
    category: category,
    amount: amount,
    memo: memo,
  };

  /** データベースを開く */
  let database = indexedDB.open(dbName, dbVersion);
  database.onerror = function (event) {
    console.log('データベースに接続できませんでした');
  };
  /** データベースにデータを登録 */
  database.onsuccess = function (event) {
    let db = event.target.result;
    let transaction = db.transaction(storeName, 'readwrite');
    transaction.oncomplete = function (event) {
      console.log('トランザクション完了');
    };
    transaction.onerror = function (event) {
      console.log('トランザクションエラー');
    };

    let store = transaction.objectStore(storeName);
    let addData = store.add(data);
    addData.onsuccess = function () {
      console.log('データ登録しました');
      alert('登録しました');
    };
    addData.onerror = function () {
      console.log('データが登録できませんでした');
    };
    db.close();
  };
}
