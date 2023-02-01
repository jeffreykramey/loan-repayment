function parseDollarStr(str) {
    return parseInt(str.replace("$", "").replace(".", ""));
}

function toDollarStr(num) {
    return "$" + (num / 100).toLocaleString(undefined, {minimumFractionDigits: 2});
}

function date(dateStr) {
    const dateParts = dateStr.split('-');
    return `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;
}

module.exports = {parseDollarStr, toDollarStr, date}