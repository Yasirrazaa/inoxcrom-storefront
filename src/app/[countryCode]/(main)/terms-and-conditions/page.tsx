import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions | INOXCROM",
  description: "Terms and conditions for INOXCROM products and services"
}

export default function TermsAndConditionsPage() {
  return (
    <div className="content-container py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Link href="/au" className="text-gray-600 hover:text-gray-800">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-500">Terms and Conditions</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">TERMS OF SALE</h2>
          <h3 className="text-xl font-semibold mb-4">1. GENERAL</h3>
          <p className="text-gray-600 mb-4">
            The following terms and conditions as well as the other related regulations adopted by Pensfrombcn, SL and established in accordance with the provisions of this document (together, the "Conditions of Sale") will apply to all sales of INOXCROM® products that you (the "Client" or "you") order Pensfrombcn, SL, a company incorporated under the laws of Spain and domiciled at Carrer Pallars, No. 85, floor 6 door 4, 08018 Barcelona, Spain with identification number Tax B67423954, ("Pensfrombcn" or hereinafter, "our" or "we"), online through the INOXCROM® website with domain name "www.inoxcrom.es" (the "Site").
          </p>
          <p className="text-gray-600 mb-4">
            These Conditions of Sale will be applied exclusively for purchases made through the Site.
          </p>
          <p className="text-gray-600 mb-4">
            Pensfrombcn may modify these Conditions of Sale at any time at its sole discretion. The Sales Conditions applicable to orders placed through the Site will be those in force at the time the order is placed by the Client. By accepting the conditions in the order confirmation section that appears on the Site before sending the order to Pensfrombcn, the Customer expresses the acknowledgment and full acceptance of these Conditions of Sale.
          </p>
          <p className="text-gray-600 mb-4">
            If the Client does not accept the provisions of these Conditions of Sale, he will not be able to order the INOXCROM® products from Pensfrombcn through the Site.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">2. PURCHASE REQUIREMENTS</h3>
          <p className="text-gray-600 mb-4">
            Only individuals who are of legal age (18 years) and have legal capacity to enter into contracts can place orders. If the Client is a minor or, where appropriate, cannot legally formalize a contract, it must be one of their parents or legal guardian who makes the request on their behalf. The orders that are made in breach of the indicated provision as well as the related contracts that are formalized from such orders will be void.
          </p>
          <p className="text-gray-600 mb-4">
            By placing an order through the Site, the Customer declares and guarantees that he is a bona fide end customer and that he will not deliver, sell or, where appropriate, distribute the Products or buy the Products for commercial purposes or other commercial benefit. If Pensfrombcn believes, in its sole discretion, that an order does not comply with the provisions of these Terms and Conditions, Pensfrombcn may reject the order or suspend its delivery.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">3. NATURE OF THE ORDERS</h3>
          <p className="text-gray-600 mb-4">
            The exhibition of the Products on the Site does not constitute an offer, but only an invitation for the Client to present an offer to Pensfrombcn. When placing an order, the Client presents an offer to Pensfrombcn for the purchase of the selected Product or Products.
          </p>
          <p className="text-gray-600 mb-4">
            Subsequently, Pensfrombcn will process the offer in accordance with the clauses set out below, especially clauses 6, 8 and 10 of this document. The purchase contract will only be concluded if Pensfrombcn expresses its acceptance by sending a written Order Confirmation (see clause 11).
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">4. AVAILABILITY AND QUANTITY OF PRODUCTS</h3>
          <p className="text-gray-600 mb-4">
            All orders made through the Site are subject to its availability and acceptance by Pensfrombcn according to its free commercial decision.
          </p>
          <p className="text-gray-600 mb-4">
            Pensfrombcn reserves the right to modify the range of Products presented on the Site and, in particular, may limit at any time the number of Products that a Client may order in a single purchase session.
          </p>
          <p className="text-gray-600 mb-4">
            The Products pages included in the Site offer the Client information about the Products that are presented for sale at that time. Please note that only Products that include the "Add to cart" button are available for sale through the Site. Pensfrombcn reserves the right to modify at any time the range of articles offered on its product pages. The Customer also has the possibility to call the Customer Service Center at 0034 93 250 04 56 where they will be provided with more information on the availability and characteristics of the Product and will be helped to make the purchase.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">5. PERSONAL INFORMATION</h3>
          <p className="text-gray-600 mb-4">
            In order to make an order through the Site, the Client must provide valid and updated personal information, such as his full name, Tax ID or DNI, telephone number and email address. As well as the delivery address of the Product.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">6. ORDERS</h3>
          <p className="text-gray-600 mb-4">
            The orders that the Customer makes through the Site will be processed as follows. After selecting the Product, you must click the "Add to cart" button to place the Product in the Customer's shopping cart. The Customer can continue to buy other Products and add them to their shopping cart (subject to availability and quantity limits). The Customer can also delete one or more Products that they have selected by clicking on the "Delete" icon next to the corresponding Product in the shopping cart.
          </p>
          <p className="text-gray-600 mb-4">
            The Client must provide the personal information that is indicated, such as delivery address, billing address and details of the payment method. The Client guarantees that all the personal information provided to Pensfrombcn is truthful and correct. For security and fraud control reasons, Pensfrombcn or its third-party providers may collect additional information that is necessary in this regard.
          </p>
          <p className="text-gray-600 mb-4">
            Regardless of what is provided in this document, Pensfrombcn reserves the right to reject, cancel or cancel orders at any time. By way of example, Pensfrombcn may reject, cancel or cancel an order from the Client if there is an outstanding unresolved conflict regarding the payment of a previous order or if Pensfrombcn suspects that the Client has carried out fraudulent activities or, where appropriate, has violated the provisions of these Conditions of Sale.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">7. PRICES, TAXES AND SHIPPING COSTS</h3>
          <p className="text-gray-600 mb-4">
            All prices shown on the Products pages included on the Site are in euros (VAT included) and do not include shipping costs and other applicable taxes, unless otherwise specified.
          </p>
          <p className="text-gray-600 mb-4">
            Pensfrombcn reserves the right to modify shipping prices and costs at any time without prior notice. Pensfrombcn will apply and comply with the price of the Product and the shipping costs shown on the Site, as detailed at all times by Pensfrombcn in the Order Confirmation.
          </p>
          <p className="text-gray-600 mb-4">
            Actual shipping charges and applicable VAT will be specified in the order before the Customer is asked to confirm the order. The shipping costs (if applicable) are detailed in the delivery policy that is included later in this document.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">8. REVIEW AND CONFIRMATION OF THE CLIENT</h3>
          <p className="text-gray-600 mb-4">
            The order procedure included in the INOXCROM® Site allows you to check and modify the errors of the order before sending it to Pensfrombcn. The Client must carefully review all the data before placing the order, including, by way of example, the data of each sale, specified on the Site.
          </p>
          <p className="text-gray-600 mb-4">
            After completely reviewing the purchase offer, the Client must check the box next to the text ”I agree to the terms of service and accept them without reservation. “To express your agreement to be bound by these Conditions of Sale, then you must click on the" Place order "button on the Site to place the order.
          </p>
          <p className="text-gray-600 mb-4">
            When placing an order through the Site, the Client presents an offer to Pensfrombcn for the purchase of the Products included in the Client's shopping basket.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">9. MEANS OF PAYMENT</h3>
          <p className="text-gray-600 mb-4">
            Pensfrombcn accepts the following payment methods: Visa, MasterCard and other credit cards with a billing address in Spain.
          </p>
          <p className="text-gray-600 mb-4">
            The Client must enter the payment details in the corresponding form. Pensfrombcn will not store the payment card number in any other way. Please refer to the Pensfrombcn Privacy Policy for more information on how Pensfrombcn may use or retain your personal information.
          </p>
          <p className="text-gray-600 mb-4">
            Payment card holders are subject to validation and authorization controls by the card issuing entity. If the issuing entity of the payment card does not authorize the payment to Pensfrombcn, the Client must contact the issuing entity of his card to solve the problem. In this case, Pensfrombcn will not be responsible for delays or non-delivery that occur.
          </p>
          <p className="text-gray-600 mb-4">
            Pensfrombcn applies measures —including administrative, technical and physical measures— to protect the Client's personal information against loss, theft and improper use, as well as against unauthorized disclosure, modification, destruction or access. Pensfrombcn uses an SSL (Secure Sockets Layer) encryption system on all web pages where personal information is collected. Unfortunately, sending information online is not 100% secure.
          </p>
          <p className="text-gray-600 mb-4">
            Although Pensfrombcn applies all reasonable measures at its disposal to protect the Client's personal information during the entire online sales process, Pensfrombcn cannot guarantee the integrity and security of the data that the Client sends to the Site and cannot be held responsible. damages or losses arising from the use of the internet network, such as in the case of hacker attacks, the appearance of Trojan viruses or computer viruses, which may occur despite the measures adopted to protect the security of the data of the Client. Please refer to the Pensfrombcn Privacy Policy for more information on how Pensfrombcn uses and protects Customer information.
          </p>
          <p className="text-gray-600 mb-4">
            The payments of the products purchased are without financing to the Client by Pensfrombcn.
          </p>
          <p className="text-gray-600 mb-4">
            If the payment is made by Visa, MasterCard or Paypal credit card, the charge to the client will be made in accordance with the rules that such organizations follow.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">10. ACKNOWLEDGMENT OF RECEIPT OF THE ORDER</h3>
          <p className="text-gray-600 mb-4">
            After placing an order through the Site, the Customer will receive by email an Order Acknowledgment in which the order details are specified. This Order Acknowledgment will include the order reference number assigned by Pensfrombcn. It is important that the Customer keep this order reference number in case they should make any queries related to it in the future. The Acknowledgment of Receipt of the Order does not mean acceptance of the order. After sending the Order Acknowledgment, Pensfrombcn will carry out the usual security and anti-fraud controls, then processing the order.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">11. CONFIRMATION OF THE ORDER BY Pensfrombcn</h3>
          <p className="text-gray-600 mb-4">
            At the time of sending the Products ordered by the Client and once the security and fraud controls by Pensfrombcn have been carried out, Pensfrombcn will send the Client a written Order Confirmation by email. The Order Confirmation represents the acceptance of the order by Pensfrombcn and constitutes a binding sale contract.
          </p>
        </section>

        <section className="mb-8">

          <h3 className="text-xl font-semibold mb-4">12. DELIVERY POLICY</h3>
          <p className="text-gray-600 mb-4">
            Pensfrombcn only delivers to addresses in Spain, including the Canary Islands. Pensfrombcn does not send to PO boxes, hotels, to addresses of public or military institutions.
          </p>
          <p className="text-gray-600 mb-4">
            Pensfrombcn will add the shipping costs to the price of the Products. Shipping costs will be applied according to the purchase value of the order as indicated in the following table.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left"></th>
                  <th className="px-4 py-2 text-left">Peninsula</th>
                  <th className="px-4 py-2 text-left">Balearic</th>
                  <th className="px-4 py-2 text-left">Canary I.</th>
                  <th className="px-4 py-2 text-left">International</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Less than 60 €</td>
                  <td className="border px-4 py-2">3,95 €</td>
                  <td className="border px-4 py-2">5,95 €</td>
                  <td className="border px-4 py-2">9,95 €</td>
                  <td className="border px-4 py-2">from 9,95 €</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">More than 60 €</td>
                  <td className="border px-4 py-2">0 €</td>
                  <td className="border px-4 py-2">3,95 €</td>
                  <td className="border px-4 py-2">5,95 €</td>
                  <td className="border px-4 py-2">from 5,95 €</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">More than 75 €</td>
                  <td className="border px-4 py-2">0 €</td>
                  <td className="border px-4 py-2">0 €</td>
                  <td className="border px-4 py-2">3,95 €</td>
                  <td className="border px-4 py-2">from 3,95 €</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">More than 100 €</td>
                  <td className="border px-4 py-2">0 €</td>
                  <td className="border px-4 py-2">0 €</td>
                  <td className="border px-4 py-2">0 €</td>
                  <td className="border px-4 py-2">0 €</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mt-4 mb-4">
            The above costs may vary without prior notice. Those indicated during the purchase process will always prevail.
          </p>
          <p className="text-gray-600 mb-4">
            Estimated delivery time: 3-4 days. This period may vary depending on various circumstances beyond the control of Pensfrombcn, SL, including but not limited to transport strikes, high demand seasons, location of the delivery point or various circumstances that affect the selected carrier.
          </p>
          <p className="text-gray-600 mb-4">
            * Saturdays and Sundays and national, provincial or local holidays in Barcelona and / or at the place of delivery of the Order, will not be considered business days for the purposes of calculating the estimated delivery time.
          </p>
          <p className="text-gray-600 mb-4">
            Pensfrombcn insures all purchases during the time they are in transit until they are delivered to the Client. Upon delivery, Pensfrombcn requires the signature of a person of legal age to confirm acceptance of each Product delivered, after which time the risk and responsibility for the Products purchased are transferred to the Customer. If the Client specifies a recipient for the shipment that is not the Client himself (for example, if it is a gift to a third party), in this case the Client understands and accepts that the signature proof of the recipient in question (or at the address of corresponding delivery) will be sufficient proof of the delivery and fulfillment of the sales contract by Pensfrombcn, transferring the risk and responsibility to the recipient in the same way as if the Product had been delivered to the Customer.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">13. INVOICES</h3>
          <p className="text-gray-600 mb-4">
            When you order from the Site, you, as a Customer, will receive the corresponding invoice by email. The Client also has the possibility of receiving the invoice by ordinary mail at the billing address by requesting it by phone at 0034 93 250 04 56, subject to their proper identification.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">14. RETURN POLICY AND CUSTOMER CANCELLATION RIGHTS</h3>
          <p className="text-gray-600 mb-4">
            The Customer may return the Products as long as they present a manufacturing defect or do not conform to the description specified on the Site.
          </p>
          <p className="text-gray-600 mb-4">
            The period to make it effective will be 7 business days from the date of receipt of the Product. To do this, you must contact us by calling 0034 93 250 04 56. The Product must be returned with the complete original packaging and without the Product having been tampered with.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">14.1. Nonconforming product</h3>
          <p className="text-gray-600 mb-4">
            At all times Pensfrombcn strives to ensure that all the Products strictly comply with the quality criteria and that they have passed all the controls, both technical and aesthetic.
          </p>
          <p className="text-gray-600 mb-4">
            If, despite this, the Customer receives a Product that appears to be defective or does not conform to the description specified on the Site ("Non-Conforming Product"), the Customer may return it to Pensfrombcn following the aforementioned return procedure. Once received, Pensfrombcn may classify the Product as a defective Product. Please note that Products deteriorated as a result of wear will not be considered defective.
          </p>
          <p className="text-gray-600 mb-4">
            If Pensfrombcn considers that the Product is a Non-Conforming Product, the Client may request Pensfrombcn to proceed as follows:
            1 Replace it with an identical Product (subject to availability);
            2 Repair the Product (if the repair is economically viable); or
            3 Refund the full price of the Product to the Customer. This refund of the price must take place within a maximum period of 30 calendar days from the request made by the Client in this regard.
          </p>
          <p className="text-gray-600 mb-4">
            Pensfrombcn may also (but will not be obliged to) offer to replace the Non-Conforming Product with another Product of equivalent or higher value (in the latter case subject to payment of the price difference by the Customer). The indicated substitution will be made in accordance with the substitution rules established in these Sales Conditions.
          </p>
          <p className="text-gray-600 mb-4">
            If the Client does not agree with Pensfrombcn's decision on whether the Product is a defective Product or not, Pensfrombcn may (but will not be obliged to) carry out an additional independent inspection and verification. The Customer must pay the cost of the inspection in the event that the inspector concludes that the Product is not defective. However, this circumstance will not affect the Client's legal rights
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">15. MISCELLANEOUS PROVISIONS</h3>
          <h4 className="text-lg font-semibold mb-4">15.1 Entire Agreement</h4>
          <p className="text-gray-600 mb-4">
            These Terms of Sale (as modified at any time), including the policies referred to in this document, constitute the entire agreement between the Client and Pensfrombcn on the purchase of Products by the Client through the Site and replace any other agreements, pacts, commitments or proposals, oral or written, that exist between the Client and Pensfrombcn in relation to the indicated purchase. The agreements or oral statements made by the parties will not serve to modify the interpretation of the Conditions of Sale.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">15.2 Independence of the clauses</h3>
          <p className="text-gray-600 mb-4">
            In the event that a Court declares for whatever reason that a provision of these Conditions of Sale is null or partially inapplicable, the provision in question will be null or inapplicable only to the extent indicated, not affected by the validity and applicability of the other provisions of these Conditions of Sale.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">15.3 Jurisdiction and applicable law</h3>
          <p className="text-gray-600 mb-4">
            The provisions of these Conditions of Sale shall be governed by the provisions of the laws of Spain. Likewise, the contract for the purchase of the Products and the conflicts or claims arising out of or related to it will be governed by the provisions of the laws of Spain. Except as provided by Law, if it attributes jurisdiction to the Courts and Tribunals of the Client's habitual domicile, the Client and Pensfrombcn accept that the Courts of the city of Barcelona (Spain) have exclusive jurisdiction.
          </p>
        </section>
      </div>
    </div>
  )
}