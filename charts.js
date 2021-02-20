/* Draw the charts */
// Load Visualization API and the corechart package.
google.charts.load('current', {
    'packages': ['corechart']
});

// Callback that creates and populates a data table,
// Initiates pie chart, passes in the data and
// draws it.
function drawCharts() {

    /* Organize data for the charts */
    let categories_for_charts = [
        ['Education', 0],
        ['Grocery', 0],
        ['Sports', 0],
    ];

    tasks.forEach(e => {

        let exists = categories_for_charts.find(el => el[0] === e.category_name);

        exists[1]++
    })



    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Category');
    data.addColumn('number', 'Tasks');
    data.addRows(categories_for_charts);

    // Set chart options
    var options = {
        'title': 'Tasks by categories',
        'width': '100%',
        'height': 500,
    };

    // Instantiate and draw our chart, passing in some options.
    var pie_chart = new google.visualization.PieChart(document.getElementById('pie_chart'));
    var bar_chart = new google.visualization.BarChart(document.getElementById('bar_chart'));
    pie_chart.draw(data, options);
    bar_chart.draw(data, options);
}