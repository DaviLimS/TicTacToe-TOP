let table = ['', '', '', '', '', '', '', '', ''];

function player(mark, name) {
    return { mark, name }
}



const play = (() => {
    const add = (mark, coord) => {
        table[coord] = mark
    }
})