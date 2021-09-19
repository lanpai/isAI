document.addEventListener("DOMContentLoaded", () => {
    const query = window.location.search;
    const params = new URLSearchParams(query);

    var url = params.get('url');
    var prob = Math.round(parseFloat(params.get('prob'))*100);
    var net = Math.round(parseFloat(params.get('net'))*100);
    var size = params.get('size');
    var type = params.get('type');
    
    if (prob === 100) prob = 99;
    if (prob === 0) prob = 1;
    if (net === 100) net = 99;
    if (net === 0) net = 1;

    if (isNaN(net)) {
        document.getElementById('isAI-bar-text').innerHTML =
            'No other results found online...';
        document.getElementById('isAI-bar').style.width =
            '0%';
    }
    else {
        document.getElementById('isAI-bar-text').innerHTML =
            `${net}% according to ${size} other results`;
        document.getElementById('isAI-bar').style.width =
            `${net}%`;
    }

    document.getElementById('isAI-donut-text').textContent =
        `${prob}%`;

    document.getElementById('isAI-url').innerHTML = url;
    document.getElementById('isAI-type').innerHTML = type;

    document.getElementById('isAI-donut').style['stroke-dashoffset'] =
        `${474-(4.74*prob)}px`;

    if (prob >= 75) {
        document.getElementById('isAI-conclusion').innerHTML = 'Most likely AI 🤬'
    }
    else if (prob >= 40) {
        document.getElementById('isAI-conclusion').innerHTML = 'Likely AI 😡'
    }
    else if (prob >= 5) {
        document.getElementById('isAI-conclusion').innerHTML = 'Possibly AI 🤔'
    }
    else {
        document.getElementById('isAI-conclusion').innerHTML = 'Probably not AI 😕'
    }
});
