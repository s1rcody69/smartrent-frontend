import { useGetDashboardSummaryQuery, useGetRevenueReportQuery, useGetOccupancyReportQuery } from '../../features/reports/reportsApi'
import { TrendingUp, DollarSign, Home, Building2, ArrowUpRight, Loader, Calendar, Clock, AlertCircle } from 'lucide-react'

function StatCard({ label, value, sub, accent, loading }) {
  return (
    <div className={`glass-panel ambient-shadow rounded-2xl p-5 border ${accent ? 'border-secondary/30' : 'border-outline-variant/30'}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${accent ? 'text-secondary' : 'text-on-surface-variant'}`}>{label}</p>
      {loading ? (
        <div className="animate-pulse">
          <div className={`h-8 w-24 rounded ${accent ? 'bg-secondary/30' : 'bg-surface-container'}`} />
        </div>
      ) : (
        <p className={`text-2xl font-black ${accent ? 'text-secondary' : 'text-on-surface'}`}>{value ?? '—'}</p>
      )}
      {sub && <p className={`text-xs mt-1 ${accent ? 'text-secondary/70' : 'text-on-surface-variant'}`}>{sub}</p>}
    </div>
  )
}

function AdminReports() {
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummaryQuery()
  const { data: revenue, isLoading: revLoading } = useGetRevenueReportQuery()
  const { data: occupancy, isLoading: occLoading } = useGetOccupancyReportQuery()

  const isLoading = summaryLoading || revLoading || occLoading

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-label-md text-label-md text-secondary font-bold uppercase tracking-[0.2em] mb-1">Analytics</p>
        <h2 className="text-display-lg text-display-lg text-primary tracking-tight">Reports & Analytics</h2>
        <p className="text-body-md text-body-md text-on-surface-variant mt-2">Platform-wide performance metrics</p>
      </header>

      {/* Revenue Summary */}
      <div>
        <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Revenue Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            label="Total Revenue Collected"
            value={revenue ? `KES ${Number(revenue.total_revenue).toLocaleString()}` : null}
            sub="All completed payments"
            accent
            loading={revLoading}
          />
          <StatCard
            label="Outstanding Balance"
            value={revenue ? `KES ${Number(revenue.outstanding_balance).toLocaleString()}` : null}
            sub="Pending invoices"
            loading={revLoading}
          />
          <StatCard
            label="Overdue Balance"
            value={revenue ? `KES ${Number(revenue.overdue_balance).toLocaleString()}` : null}
            sub="Overdue invoices"
            loading={revLoading}
          />
        </div>
      </div>

      {/* Monthly Breakdown */}
      {revLoading ? (
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-6 animate-pulse">
          <div className="h-6 bg-surface-container rounded w-48 mb-5" />
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 bg-surface-container rounded w-28" />
                <div className="flex-1 h-2.5 bg-surface-container rounded-full" />
                <div className="h-4 bg-surface-container rounded w-36" />
              </div>
            ))}
          </div>
        </div>
      ) : revenue?.monthly_breakdown?.length > 0 ? (
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-6">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-5">Monthly Revenue Breakdown</h3>
          <div className="space-y-3">
            {revenue.monthly_breakdown.map((entry, i) => {
              const max = Math.max(...revenue.monthly_breakdown.map(e => e.total))
              const pct = max > 0 ? (entry.total / max) * 100 : 0
              return (
                <div key={i} className="flex items-center gap-4">
                  <p className="text-sm text-on-surface-variant w-28 shrink-0">{entry.month}</p>
                  <div className="flex-1 bg-surface-container rounded-full h-2.5 overflow-hidden">
                    <div className="h-full bg-secondary rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-sm font-bold text-on-surface w-36 text-right shrink-0">KES {Number(entry.total).toLocaleString()}</p>
                  <p className="text-xs text-on-surface-variant w-20 text-right shrink-0">{entry.count} payment{entry.count !== 1 ? 's' : ''}</p>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      {/* Occupancy */}
      <div>
        <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Occupancy Overview</h3>
        <div className="grid grid-cols-4 gap-4 mb-5">
          <StatCard label="Total Units" value={occupancy?.total_units} sub="Across all properties" loading={occLoading} />
          <StatCard label="Occupied" value={occupancy?.occupied_units} sub="Currently leased" loading={occLoading} />
          <StatCard label="Vacant" value={occupancy?.vacant_units} sub="Available now" loading={occLoading} />
          <StatCard label="Occupancy Rate" value={occupancy ? `${occupancy.occupancy_rate}%` : null} sub="Platform-wide" accent loading={occLoading} />
        </div>

        {occLoading ? (
          <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-6 animate-pulse">
            <div className="h-3 bg-surface-container rounded-full w-full mb-4" />
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-surface-container rounded-xl" />)}
            </div>
          </div>
        ) : occupancy && (
          <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 bg-surface-container rounded-full h-3 overflow-hidden">
                <div className="h-full bg-secondary rounded-full transition-all duration-700" style={{ width: `${occupancy.occupancy_rate}%` }} />
              </div>
              <span className="text-on-surface font-black text-lg w-16 text-right">{occupancy.occupancy_rate}%</span>
            </div>

            {occupancy.property_breakdown?.length > 0 && (
              <>
                <h4 className="font-bold text-on-surface text-sm mb-3">Per Property</h4>
                <div className="space-y-2">
                  {occupancy.property_breakdown.map((p, i) => (
                    <div key={i} className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Building2 size={15} className="text-on-surface-variant shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{p.property_name}</p>
                          <p className="text-xs text-on-surface-variant">{p.city}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-on-surface-variant">{p.occupied_units}/{p.total_units} units</span>
                        <span className="font-black text-on-surface w-12 text-right">{p.occupancy_rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Platform Summary */}
      {summaryLoading ? (
        <div className="bg-primary-container rounded-2xl p-6 animate-pulse">
          <div className="h-6 bg-primary/20 rounded w-48 mb-5" />
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white/5 rounded-xl p-4">
                <div className="h-3 bg-white/10 rounded w-20 mb-2" />
                <div className="h-8 bg-white/10 rounded w-12" />
              </div>
            ))}
          </div>
        </div>
      ) : summary && (
        <div className="bg-primary-container rounded-2xl p-6">
          <h3 className="text-white font-bold mb-5 flex items-center gap-2">
            <TrendingUp size={17} className="text-secondary" />
            Platform Summary
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              ['Active Leases', summary.active_leases],
              ['Pending Maintenance', summary.pending_maintenance],
              ['Pending Invoices', summary.pending_invoices],
              ['Total Properties', summary.total_properties],
            ].map(([label, value]) => (
              <div key={label} className="bg-white/5 rounded-xl p-4">
                <p className="text-on-primary-container text-xs mb-1">{label}</p>
                <p className="text-white font-black text-2xl">{value ?? '—'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminReports