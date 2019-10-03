export default function (value, firstWordOnly) {

    var splitStr = value.split(' '); //value.toLowerCase().split(' ');

    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);

        if (firstWordOnly) {
            break;
        }
    }

    return splitStr.join(' ');
};