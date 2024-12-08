<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import woodtexture from '@/assets/images/woodtexture.jpg'
import blackSrc from '@/assets/images/black.png'
import whiteSrc from '@/assets/images/white.png'
import { GameState } from '@/gorule/gameState.js'
import { Move } from '@/gorule/move.js'
import { Point } from '@/gorule/point.js'

let socket

const sendMessage = (message) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(message)
  } else {
    console.error('WebSocket is not open. Ready state is:', socket.readyState)
  }
}

const lines = 19
let boardUpLeftX
let boardUpLeftY
let boardSize
let lineSpacing = ref(0)
const cursorConfig = ref(null)
const horizontalLines = ref([])
const verticalLines = ref([])
const stars = ref([])
const gameState = ref(GameState.newGame(lines))
const blackImage = ref(null)
const whiteImage = ref(null)
const moves = computed(() => {
  const moves = []
  const radius = boardSize * 0.05
  for (let i = 1; i <= lines; i++) {
    for (let j = 1; j <= lines; j++) {
      const color = gameState.value.board.getColor(new Point(i, j))
      if (color) {
        const position = { row: lines - i, col: j - 1 }
        moves.push({
          x: lineSpacing.value * position.col + boardUpLeftX - radius / 2,
          y: lineSpacing.value * position.row + boardUpLeftY - radius / 2,
          image: color.toString() === 'black' ? blackImage.value : whiteImage.value,
          width: radius,
          height: radius,
        })
      }
    }
  }

  return moves
})

const startPosition = [
  {
    row: 4,
    column: 4,
  },
  {
    row: 4,
    column: 10,
  },
  {
    row: 4,
    column: 16,
  },

  {
    row: 10,
    column: 4,
  },
  {
    row: 10,
    column: 10,
  },
  {
    row: 10,
    column: 16,
  },
  {
    row: 16,
    column: 4,
  },
  {
    row: 16,
    column: 10,
  },
  {
    row: 16,
    column: 16,
  },
]
const container = ref(null)

const stageConfig = ref({
  width: 0, // Initial value, updated dynamically
  height: 0,
})

const imageConfig = ref({
  x: 0, // Starting position (left)
  y: 0, // Starting position (top)
  width: 0, // Will be dynamically calculated
  height: 0, // Will be dynamically calculated
  strokeWidth: 0, // Border thickness
  image: null,
})

const updateStageSize = () => {
  const size = Math.min(container.value.offsetWidth, container.value.offsetHeight) // Ensure square shape
  stageConfig.value.width = size
  stageConfig.value.height = size

  // Set frame size (smaller square)
  const frameSize = size // 70% of the canvas size
  imageConfig.value.width = frameSize
  imageConfig.value.height = frameSize

  // Set the frame position (centered on the canvas)
  // imageConfig.value.x = (size - frameSize) / 2
  // imageConfig.value.y = (size - frameSize) / 2

  boardSize = size * 0.9

  boardUpLeftX = (size - boardSize) / 2
  boardUpLeftY = (size - boardSize) / 2

  // Grid density and line spacing
  const gridDensity = lines - 1 // Number of lines
  lineSpacing.value = boardSize / gridDensity

  // Clear previous lines
  horizontalLines.value = []
  verticalLines.value = []

  const strokeWidth = boardSize * 0.0025

  // Generate horizontal lines
  for (let i = 0; i <= gridDensity; i++) {
    horizontalLines.value.push({
      points: [
        boardUpLeftX,
        boardUpLeftY + i * lineSpacing.value,
        boardUpLeftX + boardSize,
        boardUpLeftY + i * lineSpacing.value,
      ], // Horizontal line
      stroke: 'black',
      strokeWidth: strokeWidth,
    })
  }

  // Generate vertical lines
  for (let i = 0; i <= gridDensity; i++) {
    verticalLines.value.push({
      points: [
        boardUpLeftX + i * lineSpacing.value,
        boardUpLeftY,
        boardUpLeftX + i * lineSpacing.value,
        boardUpLeftY + boardSize,
      ], // Vertical line
      stroke: 'black',
      strokeWidth: strokeWidth,
    })
  }

  stars.value = []

  for (let i = 0; i < startPosition.length; i++) {
    stars.value.push({
      x: lineSpacing.value * startPosition[i].column,
      y: lineSpacing.value * startPosition[i].row,
      radius: boardSize * 0.01,
      fill: 'black',
    })
  }
}

const loadImage = () => {
  const img = new Image() // Create an HTMLImageElement
  img.src = woodtexture // Set the imported image URL as the src

  // Once the image is loaded, set it in Konva's config
  img.onload = () => {
    imageConfig.value.image = img // Set the loaded image into Konva config
    updateStageSize() // Update grid after the image is loaded
  }

  // Error handling in case the image fails to load
  img.onerror = (err) => {
    console.error('Failed to load image:', err)
  }

  const blackImg = new Image()
  blackImg.src = blackSrc
  blackImg.onload = () => {
    blackImage.value = blackImg // Set the loaded image into Konva config
    updateStageSize() // Update grid after the image is loaded
  }

  const whiteImg = new Image()
  whiteImg.src = whiteSrc
  whiteImg.onload = () => {
    whiteImage.value = whiteImg // Set the loaded image into Konva config
    updateStageSize() // Update grid after the image is loaded
  }
}

onMounted(() => {
  loadImage()
  window.addEventListener('resize', updateStageSize)
  socket = new WebSocket('ws://127.0.0.1:8080/ws')
  socket.addEventListener('open', (event) => {
    console.log('WebSocket is open now.')
  })

  // Event listener for when a message is received from the server
  socket.addEventListener('message', (event) => {
    console.log('Message from server:', event.data)
  })

  socket.addEventListener('close', (event) => {
    console.log('WebSocket is closed now.')
  })

  socket.addEventListener('error', (event) => {
    console.error('WebSocket error observed:', event)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateStageSize)
})

const getCanvasPosition = (event) => {
  const stage = event.target.getStage() // Get the stage object
  const mousePosition = stage.getPointerPosition() // Get mouse position relative to the stage

  // Get the canvas position relative to the stage (if any transformation like scale or position is applied)
  const canvasX = mousePosition.x - stage.x() // Adjust x relative to the stage
  const canvasY = mousePosition.y - stage.y() // Adjust y relative to the stage

  return { x: canvasX, y: canvasY }
}

function getMovePosition(boardX, boardY) {
  const row = Math.round(boardY / lineSpacing.value)
  const col = Math.round(boardX / lineSpacing.value)
  return { row, col }
}

// Handle mouse move event
const handleMouseMove = (event) => {
  const canvasPosition = getCanvasPosition(event)

  // Get the canvas position relative to the stage (if any transformation like scale or position is applied)
  const canvasX = canvasPosition.x // Adjust x relative to the stage
  const canvasY = canvasPosition.y // Adjust y relative to the stage

  // console.log(`Mouse moved relative to canvas: x = ${canvasX}, y = ${canvasY}`);
  const boardX = canvasX - boardUpLeftX
  const boardY = canvasY - boardUpLeftY

  const { row, col } = getMovePosition(boardX, boardY)

  const centerX = boardUpLeftX + col * lineSpacing.value
  const centerY = boardUpLeftY + row * lineSpacing.value

  const cursorWidth = boardSize * 0.03

  if (row < 0 || row > lines - 1 || col < 0 || col > lines - 1) {
    cursorConfig.value = null
    return
  }

  cursorConfig.value = {
    x: centerX - cursorWidth / 2,
    y: centerY - cursorWidth / 2,
    fill: gameState.value.nextPlayer.toString(),
    width: cursorWidth,
    height: cursorWidth,
  }
}

const transFormPosition = ({ row, col }) => {
  return {
    row: lines - row,
    col: col + 1,
  }
}

const handleClick = (event) => {
  const canvasPosition = getCanvasPosition(event)

  // Get the canvas position relative to the stage (if any transformation like scale or position is applied)
  const canvasX = canvasPosition.x // Adjust x relative to the stage
  const canvasY = canvasPosition.y // Adjust y relative to the stage

  // console.log(`Mouse moved relative to canvas: x = ${canvasX}, y = ${canvasY}`);
  const boardX = canvasX - boardUpLeftX
  const boardY = canvasY - boardUpLeftY

  const { row, col } = transFormPosition(getMovePosition(boardX, boardY))

  const point = new Point(row, col)
  if (gameState.value.board.isOnGrid(point)) {
    const move = new Move(point, null, null)
    gameState.value = gameState.value.applyMove(move)
    sendMessage(JSON.stringify({ row, col }))
  }
}

const handleMouseLeave = () => {
  cursorConfig.value = null
}
</script>

<template>
  <div ref="container" class="stage-container">
    <v-stage
      :config="stageConfig"
      @click="handleClick"
      @mouseleave="handleMouseLeave"
      @mousemove="handleMouseMove"
    >
      <v-layer>
        <v-image :config="imageConfig"></v-image>
        <!-- Horizontal Lines -->
        <v-line v-for="(line, index) in horizontalLines" :key="'h-' + index" :config="line" />
        <!-- Vertical Lines -->
        <v-line v-for="(line, index) in verticalLines" :key="'v-' + index" :config="line" />

        <v-circle v-for="(star, index) in stars" :key="'v-' + index" :config="star" />
        <v-rect v-if="cursorConfig" :config="cursorConfig" />

        <!--        <v-circle v-for="move in moves" :key="move.x + '-' + move.y" :config="move" />-->
        <v-image v-for="move in moves" :key="move.x + '-' + move.y" :config="move" />
      </v-layer>
    </v-stage>
  </div>
</template>

<style scoped>
.stage-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw; /* Full width of the viewport */
  height: 100vh; /* Full height of the viewport */
  overflow: hidden;
}
</style>
