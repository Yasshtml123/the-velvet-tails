import PolicyPage from './PolicyPages';

export default function RefundPolicy() {
    return (
        <PolicyPage title="Refund/Return Policy">
            <section className="space-y-6">
                <p className="text-gray-700">
                    While most of the products available on the website www.thevelvettails.com ("Platform") can be returned, subject to the terms of this cancellation, return, exchange, and refund policy ("Policy"), please check the details of the product, before placing an order, to check if the product is eligible for a return or not.
                </p>

                <p className="text-gray-700">
                    To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You will also need the receipt or proof of purchase (digital or physical)
                </p>

                <div>
                    <p className="text-gray-700 mb-2">
                        Returns or exchanges of products in the following categories will not be accepted (unless received damaged or spoilt):
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>Food and treats</li>
                        <li>Bedding, Mats & Travel Supplies</li>
                        <li>Cat litter</li>
                        <li>Health and wellness products</li>
                        <li>Grooming & grooming supplies</li>
                        <li>Bowls & Feeders</li>
                        <li>Toys</li>
                        <li>Unopened units in a combo product (ex: If a product comprises 12 packets and out of it, 11 packets are unopened, then a return or refund or exchange request for such 11 packets will not be accepted)</li>
                    </ul>
                    <p className="text-gray-700 mt-3">
                        Product pages outline whether that product is returnable or not.
                    </p>
                </div>

                <p className="text-gray-700">
                    To initiate a return request, you can contact us at support@thevelvettails.com or at +91-9873062819.
                </p>

                <p className="text-gray-700">
                    You may cancel any order before the dispatch of the item has taken place. Or else you may call us at +91-9873062819 or email us at support@thevelvettails.com to initiate cancellation.
                </p>

                <p className="text-gray-700">
                    The Platform retains the right to cancel any order placed by you, at its sole discretion and shall intimate you of the same by way of an email/SMS. Further, the Platform may cancel an order wherein the quantities exceed the standard for individual consumption or the Platform has reason to believe or suspect that such an order is not placed by a consumer for personal use.
                </p>

                <p className="text-gray-700">
                    For any question relating to return or cancellation of any products, you can always contact us at support@thevelvettails.com
                </p>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Damages and issues</h2>
                    <p className="text-gray-700">
                        Please inspect your order upon receipt. Contact us immediately but no later than 10 (ten) days if the item is defective, damaged or if you receive the wrong item, or if your item is lost in transit, so that we can evaluate the issue and make it right.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Refunds</h2>
                    <p className="text-gray-700 mb-3">
                        In the event you place a return request for any product purchased by you, we will notify you once we've received and inspected the product returned by you, and let you know if the refund has been approved or not. If approved, you will automatically be refunded the relevant amount to your original payment method.
                    </p>
                    <p className="text-gray-700 mb-3">
                        In the event of cancellation of an order, any amount paid by you with respect to such a transaction shall be refunded on your original payment method.
                    </p>
                    <p className="text-gray-700">
                        All eligible refunds will be processed within 7 working days from the date of approval of the return or cancellation request. Refund timelines may vary slightly depending on the customer's bank or payment provider
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Shipping Cost Refunds</h2>
                    <p className="text-gray-700">
                        The Company shall bear the cost of return shipping. Customers who incur return-shipping expenses may reach out to us to submit a reimbursement claim.
                    </p>
                </div>
            </section>
        </PolicyPage>
    );
}
