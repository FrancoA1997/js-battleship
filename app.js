
const userGrid = document.querySelector('.user-grid')
const computerGrid = document.querySelector('.ai-grid')
const userSquares = []
const aiSquares = []
const width = 10;

function createBoard(grid, squares){
for(let i = 0; i < width*width; i++){
    const square = document.createElement('div')
    square.dataset.id = i
    grid.appendChild(square)
    squares.push(square)
}
}
createBoard(userGrid, userSquares)
createBoard(aiGrid, aiSquares)
