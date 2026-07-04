import { apiSlice } from '../../app/api'

export const maintenanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMaintenanceRequests: builder.query({
      query: () => 'maintenance/',
      providesTags: ['Maintenance'],
    }),
    createMaintenanceRequest: builder.mutation({
      query: (data) => ({ url: 'maintenance/', method: 'POST', body: data }),
      invalidatesTags: ['Maintenance'],
    }),
    updateMaintenanceRequest: builder.mutation({
      query: ({ id, ...data }) => ({ url: `maintenance/${id}/`, method: 'PATCH', body: data }),
      invalidatesTags: ['Maintenance'],
    }),
    deleteMaintenanceRequest: builder.mutation({
      query: (id) => ({ url: `maintenance/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Maintenance'],
    }),
  }),
})

export const {
  useGetMaintenanceRequestsQuery,
  useCreateMaintenanceRequestMutation,
  useUpdateMaintenanceRequestMutation,
  useDeleteMaintenanceRequestMutation,
} = maintenanceApi