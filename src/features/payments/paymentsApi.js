import { apiSlice } from '../../app/api'

export const paymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query({
      query: () => 'invoices/',
      providesTags: ['Invoice'],
    }),
    createInvoice: builder.mutation({
      query: (data) => ({ url: 'invoices/', method: 'POST', body: data }),
      invalidatesTags: ['Invoice'],
    }),
    getPayments: builder.query({
      query: () => 'payments/',
      providesTags: ['Payment'],
    }),
    stkPush: builder.mutation({
      query: (data) => ({ url: 'payments/mpesa/stk-push/', method: 'POST', body: data }),
      invalidatesTags: ['Payment', 'Invoice'],
    }),
  }),
})

export const {
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useGetPaymentsQuery,
  useStkPushMutation,
} = paymentsApi