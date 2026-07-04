import { apiSlice } from '../../app/api'

export const reportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query({
      query: () => 'reports/dashboard/',
    }),
    getRevenueReport: builder.query({
      query: () => 'reports/revenue/',
    }),
    getOccupancyReport: builder.query({
      query: () => 'reports/occupancy/',
    }),
  }),
})

export const {
  useGetDashboardSummaryQuery,
  useGetRevenueReportQuery,
  useGetOccupancyReportQuery,
} = reportsApi