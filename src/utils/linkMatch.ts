const linkMatch = (target: string, source: string) => {
  if (typeof window === "undefined") return false;

  return new URL(target, location.href).pathname === new URL(source, location.href).pathname
}

export default linkMatch;