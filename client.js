function drawChart(d, totalAmount, year) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Country');
    data.addColumn('number', 'Million USD');
    data.addRows(d);

    var options = {
        width: 800, height: 500,
        title: 'Top 10 aid per country for ' + year + ' (Total: ' + totalAmount + ")",
        hAxis: { title: 'Country', titleTextStyle: { color: 'red'} }
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}
function reloadGraph(year) {
    $.getJSON('/country/' + year, function (data) {
        var graphData = _(data)
                    .chain()
                    .filter(function (d) { return d.name != "Globalt"; })
                    .map(function (d) { return [d.name, Math.round(parseFloat(d.amount_usd / 1000000))]; })
                    .sortBy(function (d) { return d[1]; })
                    .last(10)
                    .reverse()
                    .value();
        var totalAmount = Math.round(parseFloat(_(data)
                    .chain()
                    .filter(function (d) { return d.name === "Globalt"; })
                    .pluck('amount_usd')
                    .first()
                    .value()) / 1000000);
        drawChart(graphData, totalAmount, year);
    });
}
$(document).ready(function () {
    $('#year a').click(function (e) {
        e.preventDefault();
        var year = parseInt($(this).html(), 10);
        reloadGraph(year);
    });    
    reloadGraph(2008);
}); 