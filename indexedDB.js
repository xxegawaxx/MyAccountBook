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
  // 一覧を作成
  createList();
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

createList();
function createList() {
  let database = indexedDB.open(dbName);
  database.onsuccess = function (event) {
    let db = event.target.result;
    let transaction = db.transaction(storeName, 'readonly');
    let store = transaction.objectStore(storeName);
    store.getAll().onsuccess = function (data) {
      console.log(data);
      let rows = data.target.result;

      let section = document.getElementById('list');
      //入出金一覧のテーブルを作る
      let table = `
                <table>
                    <tr>
                        <th>日付</th>
                        <th>収支</th>
                        <th>カテゴリ</th>
                        <th>金額</th>
                        <th>メモ</th>
                        <th>削除
                    </th>
                </tr>
            `;

      //入出金のデータを表示
      rows.forEach(row => {
        console.log(row);
        table += `
                  <tr>
                      <td>${row.date}</td>
                      <td>${row.balance}</td>
                      <td>${row.category}</td>
                      <td>${row.amount}</td>
                      <td>${row.memo}</td>
                      <td><button onclick="deleteData('${row.id}')">×</button></td>
                  </tr>
              `;
      });
      table += `</table>`;
      section.innerHTML = table;
    };
  };
}

function deleteData(id) {
  let database = indexedDB.open(dbName, dbVersion);
  database.onupgradeneeded = function (event) {
    let db = event.target.result;
  };

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

    let deleteData = store.delete(id);
    deleteData.onsuccess = function (event) {
      console.log('削除成功');
      createList();
    };
    deleteData.onerror = function (event) {
      console.log('削除失敗');
    };
    db.close();
  };
  database.onerror = function (event) {
    console.log('データベースに接続できませんでした');
  };
}
