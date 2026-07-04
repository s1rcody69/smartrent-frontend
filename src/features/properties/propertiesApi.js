import { apiSlice } from '../../app/api'

export const propertiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: (params = '') => `properties/${params}`,
      providesTags: ['Property'],
    }),
    getPropertyById: builder.query({
      query: (id) => `properties/${id}/`,
      providesTags: ['Property'],
    }),
    createProperty: builder.mutation({
      query: (data) => {
        const formData = new FormData()
        Object.entries(data).forEach(([k, v]) => {
          if (v !== null && v !== undefined) formData.append(k, v)
        })
        return { url: 'properties/', method: 'POST', body: formData }
      },
      invalidatesTags: ['Property'],
    }),
    updateProperty: builder.mutation({
      query: ({ id, ...data }) => {
        const formData = new FormData()
        Object.entries(data).forEach(([k, v]) => {
          if (v !== null && v !== undefined) formData.append(k, v)
        })
        return { url: `properties/${id}/`, method: 'PATCH', body: formData }
      },
      invalidatesTags: ['Property'],
    }),
    deleteProperty: builder.mutation({
      query: (id) => ({ url: `properties/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Property'],
    }),
    getUnits: builder.query({
      query: (params = '') => `units/${params}`,
      providesTags: ['Unit'],
    }),
    getUnitById: builder.query({
      query: (id) => `units/${id}/`,
      providesTags: ['Unit'],
    }),
    createUnit: builder.mutation({
      query: (data) => ({ url: 'units/', method: 'POST', body: data }),
      invalidatesTags: ['Unit', 'Property'],
    }),
    updateUnit: builder.mutation({
      query: ({ id, ...data }) => ({ url: `units/${id}/`, method: 'PATCH', body: data }),
      invalidatesTags: ['Unit'],
    }),
    deleteUnit: builder.mutation({
      query: (id) => ({ url: `units/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Unit', 'Property'],
    }),
  }),
})

export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetUnitsQuery,
  useGetUnitByIdQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = propertiesApi