const linkMatch = (target: string, source: string) => {
  return new URL(target, location.href).pathname === new URL(source, location.href).pathname
}

export default linkMatch;