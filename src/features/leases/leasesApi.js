import { apiSlice } from '../../app/api'

export const leasesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeases: builder.query({
      query: () => 'leases/',
      providesTags: ['Lease'],
    }),
    getLeaseById: builder.query({
      query: (id) => `leases/${id}/`,
      providesTags: ['Lease'],
    }),
    createLease: builder.mutation({
      query: (data) => ({ url: 'leases/', method: 'POST', body: data }),
      invalidatesTags: ['Lease', 'Unit'],
    }),
    updateLease: builder.mutation({
      query: ({ id, ...data }) => ({ url: `leases/${id}/`, method: 'PATCH', body: data }),
      invalidatesTags: ['Lease'],
    }),
    deleteLease: builder.mutation({
      query: (id) => ({ url: `leases/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Lease'],
    }),
    getTerminationRequests: builder.query({
      query: () => 'lease-terminations/',
      providesTags: ['LeaseTermination'],
    }),
    createTerminationRequest: builder.mutation({
      query: (data) => ({ url: 'lease-terminations/', method: 'POST', body: data }),
      invalidatesTags: ['LeaseTermination'],
    }),
    approveTermination: builder.mutation({
      query: ({ id, ...data }) => ({ url: `lease-terminations/${id}/approve/`, method: 'POST', body: data }),
      invalidatesTags: ['LeaseTermination', 'Lease', 'Unit'],
    }),
    rejectTermination: builder.mutation({
      query: ({ id, ...data }) => ({ url: `lease-terminations/${id}/reject/`, method: 'POST', body: data }),
      invalidatesTags: ['LeaseTermination'],
    }),
  }),
})

export const {
  useGetLeasesQuery,
  useGetLeaseByIdQuery,
  useCreateLeaseMutation,
  useUpdateLeaseMutation,
  useDeleteLeaseMutation,
  useGetTerminationRequestsQuery,
  useCreateTerminationRequestMutation,
  useApproveTerminationMutation,
  useRejectTerminationMutation,
} = leasesApi