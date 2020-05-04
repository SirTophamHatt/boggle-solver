/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 */
export function shuffle<T = unknown>(array: Array<T>): Array<T> {
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
