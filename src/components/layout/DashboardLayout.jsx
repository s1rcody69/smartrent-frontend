import DashboardSidebar from './DashboardSidebar'

function DashboardLayout({ links, children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar links={links} />
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout