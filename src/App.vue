<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import woodtexture from '@/assets/images/woodtexture.jpg'

const lines = 19
let upLeftX
let upLeftY
let boardSize
let lineSpacing
const cursorConfig = ref(null)
const horizontalLines = ref([])
const verticalLines = ref([])
const stars = ref([])
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
  imageConfig.value.x = (size - frameSize) / 2
  imageConfig.value.y = (size - frameSize) / 2

  boardSize = size * 0.9

  upLeftX = (size - boardSize) / 2
  upLeftY = (size - boardSize) / 2

  // Grid density and line spacing
  const gridDensity = lines - 1 // Number of lines
  lineSpacing = boardSize / gridDensity

  // Clear previous lines
  horizontalLines.value = []
  verticalLines.value = []

  const strokeWidth = boardSize * 0.0025

  // Generate horizontal lines
  for (let i = 0; i <= gridDensity; i++) {
    horizontalLines.value.push({
      points: [upLeftX, upLeftY + i * lineSpacing, upLeftX + boardSize, upLeftY + i * lineSpacing], // Horizontal line
      stroke: 'black',
      strokeWidth: strokeWidth,
    })
  }

  // Generate vertical lines
  for (let i = 0; i <= gridDensity; i++) {
    verticalLines.value.push({
      points: [upLeftX + i * lineSpacing, upLeftY, upLeftX + i * lineSpacing, upLeftY + boardSize], // Vertical line
      stroke: 'black',
      strokeWidth: strokeWidth,
    })
  }

  stars.value = []

  for (let i = 0; i < startPosition.length; i++) {
    stars.value.push({
      x: lineSpacing * startPosition[i].column,
      y: lineSpacing * startPosition[i].row,
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
}

onMounted(() => {
  loadImage()
  window.addEventListener('resize', updateStageSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateStageSize)
})

// Handle mouse move event
const handleMouseMove = (event) => {
  const stage = event.target.getStage() // Get the stage object
  const mousePosition = stage.getPointerPosition() // Get mouse position relative to the stage

  // Get the canvas position relative to the stage (if any transformation like scale or position is applied)
  const canvasX = mousePosition.x - stage.x() // Adjust x relative to the stage
  const canvasY = mousePosition.y - stage.y() // Adjust y relative to the stage

  // console.log(`Mouse moved relative to canvas: x = ${canvasX}, y = ${canvasY}`);

  const boardX = canvasX - upLeftX
  const boardY = canvasY - upLeftY

  const row = Math.round(boardY / lineSpacing)
  const col = Math.round(boardX / lineSpacing)

  const centerX = upLeftX + col * lineSpacing
  const centerY = upLeftY + row * lineSpacing

  const cursorWidth = boardSize * 0.03

  if (row < 0 || row > lines -1 || col < 0 || col > lines -1) {
    cursorConfig.value = null
    return
  }

  cursorConfig.value = {
    x: centerX - cursorWidth / 2,
    y: centerY - cursorWidth / 2,
    fill: 'black',
    width: cursorWidth,
    height: cursorWidth,
  }
}

const handleMouseLeave = () => {
  cursorConfig.value = null
}
</script>

<template>
  <div ref="container" class="stage-container">
    <v-stage :config="stageConfig" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
      <v-layer>
        <v-image :config="imageConfig"></v-image>
        <!-- Horizontal Lines -->
        <v-line v-for="(line, index) in horizontalLines" :key="'h-' + index" :config="line" />
        <!-- Vertical Lines -->
        <v-line v-for="(line, index) in verticalLines" :key="'v-' + index" :config="line" />

        <v-circle v-for="(star, index) in stars" :key="'v-' + index" :config="star" />
        <v-rect v-if="cursorConfig" :config="cursorConfig" />
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
