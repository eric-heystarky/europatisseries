// Re-mounts on every navigation, replaying a subtle fade-in for each page.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
