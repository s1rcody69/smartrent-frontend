import DashboardSidebar from './DashboardSidebar'

function DashboardLayout({ links, children }) {
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar links={links} />
      <main className="flex-1 ml-70 min-h-screen p-margin-desktop">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout