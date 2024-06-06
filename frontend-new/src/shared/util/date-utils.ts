export function toUtcDate(value: string): Date {
  if (value.includes('-')) {
    const temp: number[] = value.split('-').map(Number)
    return new Date(Date.UTC(temp[0], temp[1] - 1, temp[2]))
  } 
  if (value.includes('/')) {
    const temp: number[] = value.split('/').map(Number)
    return new Date(Date.UTC(temp[2], temp[0] - 1, temp[1]))
  } else {
    throw ("Undefined date format")
  }
}
