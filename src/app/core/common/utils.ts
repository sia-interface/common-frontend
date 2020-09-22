// execute something after delay (milliseconds)
export function later(delay: number) {
    return new Promise(function (resolve) {
        window.setTimeout(resolve, delay)
    })
}