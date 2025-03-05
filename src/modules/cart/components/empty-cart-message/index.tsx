import { Heading, Text } from "@medusajs/ui"

const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
)

const EmptyCartMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12" data-testid="empty-cart-message">
      <div className="mb-6">
        <ShoppingCartIcon />
      </div>
      <Heading
        level="h1"
        className="text-2xl font-semibold text-gray-900 mb-3"
      >
        Your Cart is Empty
      </Heading>
      <Text className="text-gray-600 text-center max-w-[24rem] mb-4">
        Looks like you haven't added anything yet. Start exploring our collection to find something you'll love!
      </Text>
    </div>
  )
}

export default EmptyCartMessage
