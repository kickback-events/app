export function winningShare(deposit, registered, attended) {
  return (deposit * registered) / attended
}
