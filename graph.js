function createPieChart(rows) {
  const pieChartData = {};

  let category = '';
  rows.forEach(function (row) {
    category = row.category;
    if (category !== '収入') {
      if (pieChartData.category === undefined) {
        console.log(pieChartData);
        pieChartData[category] = Number(row.amount);
      } else {
        pieChartData[category] += Number(row.amount);
      }
    }
  });

  let keyArray = [];
  let valueArray = [];
  for (const key in pieChartData) {
    keyArray.push(key);
    valueArray.push(pieChartData[key]);
  }

  // Chart.jsの機能を使用してグラフを表示
  let pieChart = document.getElementById('pieChart');
  new Chart(pieChart, {
    type: 'pie',
    data: {
      labels: keyArray,
      datasets: [
        {
          backgroundColor: [
            '#EB5757',
            '#6FCF97',
            '#56CCF2',
            '#F2994A',
            '#F2C94C',
            '#2F80ED',
            '#9B51E0',
            '#BB6BD9',
          ],
          data: valueArray,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'カテゴリ毎の支出割合',
      },
    },
  });
}
