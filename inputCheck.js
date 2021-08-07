/** ラジオボタンによりカテゴリの有効無効切り替え */
function disableSelectBox(disabled) {
  document.getElementById('category').disabled = disabled;
}

/** 収支入力フォームの内容チェック */
function inputCheck() {
  let result = true;

  let radio = document.getElementsByName('balance');
  let balance = null;

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

  // 入力チェック
  if (date === '') {
    result = false;
    alert('日付が未入力です');
  } else if (category === '-選択してください-' && balance === '支出') {
    result = false;
    alert('カテゴリを選択してください');
  } else if (amount === 0 || amount === '') {
    result = false;
    alert('金額が未入力です');
  } else if (memo === '') {
    result = false;
    alert('メモが未入力です');
  }
  return result;
}
