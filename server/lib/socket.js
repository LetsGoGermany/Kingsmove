let ioInstance = null

export function setIO(io) {
  ioInstance = io
}

export function getIO() {
  if (!ioInstance) {
    throw new Error("io not initialized")
  }
  return ioInstance
}


