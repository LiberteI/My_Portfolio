export class YoutubeConfigError extends Error {
  constructor(message) {
    super(message)
    this.name = 'YoutubeConfigError'
    this.statusCode = 500
    this.publicMessage = 'YouTube integration is not configured correctly'
  }
}

export class YoutubeApiError extends Error {
  constructor(message, statusCode = 502) {
    super(message)
    this.name = 'YoutubeApiError'
    this.statusCode = statusCode
    this.publicMessage = 'Failed to fetch YouTube videos'
  }
}
