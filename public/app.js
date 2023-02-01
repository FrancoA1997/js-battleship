document.addEventListener('DOMContentLoaded', () => {
  const userGrid = document.querySelector('.user-grid')
  const aiGrid = document.querySelector('.ai-grid')
  const ships = document.querySelectorAll('.ship')
  const smShip = document.querySelector('.smShip-container')
  const mdShip = document.querySelector('.mdShip-container')
  const lgShip = document.querySelector('.lgShip-container')
  const displayGrid = document.querySelector('.grid-display')
  const startButton = document.querySelector('#start')
  const shipContainer = document.querySelector('#ships-container')
  const rotateButton = document.querySelector('#rotate')
  const turnDisplay = document.querySelector('#whose-go')
  const infoDisplay = document.querySelector('#info')
  let isHorizontal = true
  let isGameOver = false
  let currentPlayer = 'user'
  const userSquares = []
  const aiSquares = []
  const width = 10;

  function createBoard(grid, squares) {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div')
      square.dataset.id = i
      grid.appendChild(square)
      squares.push(square)
    }
  }
  createBoard(userGrid, userSquares)
  createBoard(aiGrid, aiSquares)

  const arrayShip = [{
      name: 'smShip',
      directions: [
        [0, 1],
        [0, width]
      ]
    },
    {
      name: 'mdShip',
      directions: [
        [0, 1, 2],
        [0, width, width * 2]
      ]

    },
    {
      name: 'lgShip',
      directions: [
        [0, 1, 2, 3],
        [0, width, width * 2, width * 3]
      ]
    },
  ]


  function generate(ship) {
    let randomDirection = Math.floor(Math.random() * ship.directions.length)
    let current = ship.directions[randomDirection]
    if (randomDirection === 0) direction = 1
    if (randomDirection === 1) direction = 10
    let randomStart = Math.abs(Math.floor(Math.random() * aiSquares.length - (ship.directions[0].length * direction)))
    const isTaken = current.some(index => aiSquares[randomStart + index].classList.contains('taken'))
    const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1)
    const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0)
    if (!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => aiSquares[randomStart + index].classList.add('taken', ship.name , 'ai-ship'))

    else generate(ship)

  }

  generate(arrayShip[0])
  generate(arrayShip[1])
  generate(arrayShip[2])


  function rotate() {
    if (isHorizontal) {
      displayGrid.classList.toggle('grid-display-vertical')
      smShip.classList.toggle('smShip-container-vertical', 'grid-display-vertical')
      mdShip.classList.toggle('mdShip-container-vertical', 'grid-display-vertical')
      lgShip.classList.toggle('lgShip-container-vertical', 'grid-display-vertical')
      isHorizontal = false
      console.log(isHorizontal)
      return
    }
    if (!isHorizontal) {
      displayGrid.classList.remove('grid-display-vertical')
      smShip.classList.toggle('smShip-container-vertical')
      mdShip.classList.toggle('mdShip-container-vertical')
      lgShip.classList.toggle('lgShip-container-vertical')
      isHorizontal = true
      console.log(isHorizontal)
      return
    }

  }

  rotateButton.addEventListener('click', rotate)



  ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
  userSquares.forEach(square => square.addEventListener('dragstart', dragStart))
  userSquares.forEach(square => square.addEventListener('dragover', dragOver))
  userSquares.forEach(square => square.addEventListener('dragenter', dragEnter))
  userSquares.forEach(square => square.addEventListener('dragleave', dragLeave))
  userSquares.forEach(square => square.addEventListener('drop', dragDrop))
  userSquares.forEach(square => square.addEventListener('dragend', dragEnd))

  let selectedShipNameWithIndex
  let draggedShip
  let draggedShipLength

  ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
    selectedShipNameWithIndex = e.target.id
   /// console.log(selectedShipNameWithIndex)
  }))

  function dragStart() {
    draggedShip = this
    draggedShipLength = draggedShip.children.length 
    console.log(draggedShip)
  }

  function dragOver(e) {
    e.preventDefault()
  }

  function dragEnter(e) {
    e.preventDefault()
  }

  function dragLeave() {
    console.log('drag leave')
  }

  function dragDrop() {
    let shipNameWithLastId = draggedShip.lastElementChild.id
    let shipClass = shipNameWithLastId.slice(0, -2)
    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))

    let shipLastId = lastShipIndex + parseInt(this.dataset.id)
    console.log(shipLastId)
    const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93]
    const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60]
    
    let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex)
    let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex)

    selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1))

    shipLastId = shipLastId - selectedShipIndex
    console.log(shipLastId)

    if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
      for (let i=0; i < draggedShipLength; i++) {
        
        userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipClass, "user-ship")
      }
    //As long as the index of the ship you are dragging is not in the newNotAllowedVertical array! This means that sometimes if you drag the ship by its
    //index-1 , index-2 and so on, the ship will rebound back to the displayGrid.
    } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
      console.log(draggedShipLength)
      for (let i=0; i < draggedShipLength; i++) {
        userSquares[parseInt(this.dataset.id) - selectedShipIndex + width*i].classList.add('taken', shipClass, "user-ship")
      }
    } else return
    displayGrid.removeChild(draggedShip)
  }

  function dragEnd() {
    console.log('dragend')
  }
  
  //Game Logic
 

  function playGame() {
    if (isGameOver) return
    if(displayGrid.childElementCount === 3){
    infoDisplay.innerHTML = 'Place your ships before starting the game'}
    if (currentPlayer === 'user' && displayGrid.childElementCount === 0) {
      infoDisplay.innerHTML = ''
      shipContainer.classList.toggle('hidden-btn')
      turnDisplay.classList.toggle('text-xl')
      startButton.classList.toggle('hidden-btn')
      rotateButton.classList.toggle('hidden-btn')
      turnDisplay.innerHTML = 'Your Turn'
      aiSquares.forEach(square => square.addEventListener('click', function (e) {
        revealSquare(square)
      }))
    }
    if (currentPlayer === 'computer') {
      turnDisplay.innerHTML = 'Computers Turn'
      setTimeout(computerGo, 1000)
    }
  }
  startButton.addEventListener('click', playGame)

  let smallShip = 0
  let mediumShip = 0
  let largeShip = 0
 
  function revealSquare(square) {
    if (!square.classList.contains('boom')) {
      if (square.classList.contains('smShip')) smallShip++
      if (square.classList.contains('mdShip')) mediumShip++
      if (square.classList.contains('lgShip')) largeShip++
    }
    if (square.classList.contains('taken')) {
      square.classList.add('boom')
    } else {
      square.classList.add('miss')
    }
    checkForWins()
    currentPlayer = 'computer'
    playGame()
  }


  let cpuSmallShip = 0
  let cpuMediumShip = 0
  let cpuLargeShip = 0

  function computerGo() {
    let random = Math.floor(Math.random() * userSquares.length)
    if (!userSquares[random].classList.contains('boom')) {
      userSquares[random].classList.add('boom')
      if (userSquares[random].classList.contains('smShip')) cpuSmallShip++
      if (userSquares[random].classList.contains('mdShip')) cpuMediumShip++
      if (userSquares[random].classList.contains('lgShip')) cpuLargeShip++
      checkForWins()
    } else computerGo()
    currentPlayer = 'user'
    turnDisplay.innerHTML = 'Your Turn'
  }
  function checkForWins() {
    if (smallShip === 2) {
      infoDisplay.innerHTML = '¡You sunk the computers small ship!'
      smallShip = 10
    }
    if (mediumShip === 3) {
      infoDisplay.innerHTML = '¡You sunk the computers medium ship!'
      mediumShip = 10
    }
    if (largeShip === 4) {
      infoDisplay.innerHTML = '¡You sunk the computers large ship!'
      largeShip = 10
    }
 
    if (cpuSmallShip === 2) {
      infoDisplay.innerHTML = '¡Your small ship got detroyed!'
      cpuSmallShip = 10
    }
    if (cpuMediumShip === 3) {
      infoDisplay.innerHTML = '¡Your medium ship got detroyed!'
      cpuMediumShip = 10
    }
    if (cpuLargeShip === 4) {
      infoDisplay.innerHTML = '¡Your large ship got detroyed!'
      cpuLargeShip = 10
    }
    
    if ((smallShip + mediumShip + largeShip ) === 30) {
      infoDisplay.innerHTML = "YOU WIN"
      gameOver()
    }
    if ((cpuSmallShip + cpuMediumShip + cpuLargeShip) === 30) {
      infoDisplay.innerHTML = "COMPUTER WINS"
      gameOver()
    }
  }

  function gameOver() {
    isGameOver = true
    startButton.removeEventListener('click', playGame)
  }

})