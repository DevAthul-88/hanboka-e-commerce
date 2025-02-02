export function getInitials(name) {
  if (!name) return "" // Handle empty or undefined names
  const words = name.split(" ") // Split the name into words
  const initials = words
    .map((word) => word[0]) // Get the first letter of each word
    .join("") // Join the initials together
  return initials.toUpperCase() // Convert to uppercase
}
