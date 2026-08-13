// // // import http from 'k6/http';
// // // import { check, sleep } from 'k6';


// // // // Array of real product IDs from your DB
// // // const sampleProductIds = [
// // //   '6a60a6df8eea5651908de9aa',
// // //   '6a60a6df8eea5651908de9b0',
// // //   '6a60a6df8eea5651908de9a8',
// // //   '6a60a6df8eea5651908de9b2',
// // //   '6a60a6df8eea5651908de9b4',
// // //   '6a60a6df8eea5651908de9b6',
// // //   '6a60a6df8eea5651908de9b8',
// // //   '6a60a6df8eea5651908de9ba',
// // //   '6a60a6df8eea5651908de9ae',
// // //   '6a60a6df8eea5651908de9ac',
// // // ];

// // // export const options = {
// // //   stages: [
// // //     { duration: '10s', target: 5 },   // Ramp up to 5 concurrent checkout users
// // //     { duration: '20s', target: 20 },  // Spike to 20 concurrent checkout users
// // //     { duration: '10s', target: 0 },   // Cool down
// // //   ],
// // //   thresholds: {
// // //     // Write operations involve DB inserts + cryptographic signing, so 500ms SLA is standard
// // //     http_req_duration: ['p(95)<500'], 
// // //     http_req_failed: ['rate<0.01'],   // Error rate should be < 1%
// // //   },
// // // };

// // // const BASE_URL = 'http://localhost:5000';

// // // export default function () {

// // //     const randomProductId = sampleProductIds[Math.floor(Math.random() * sampleProductIds.length)];


// // //   const payload = JSON.stringify({
// // //     productId: randomProductId,
// // //     quantity: Math.floor(Math.random() * 3) + 1, // Random quantity between 1 and 3
// // //     shippingAddress: {
// // //       fullName: 'Test User',
// // //       address: '123 Test St',
// // //       city: 'Delhi',
// // //       postalCode: '110001',
// // //       phone: '9876543210'
// // //     }
// // //   });

// // //   const params = {
// // //     headers: {
// // //       'Content-Type': 'application/json',
// // //       // If your payment initiation route requires authentication, include JWT header:
// // //       // 'Authorization': 'Bearer YOUR_TEST_TOKEN'
// // //     },
// // //   };

// // //   const res = http.post(`${BASE_URL}/api/payments/initiate`, payload, params);

// // //   check(res, {
// // //     'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
// // //     'has transaction/payment payload': (r) => r.body.includes('payu') || r.body.includes('order') || r.body.includes('hash'),
// // //   });

// // //   sleep(1); // Shoppers take time before completing payment
// // // }




// // import http from 'k6/http';
// // import { check, sleep } from 'k6';

// // export const options = {
// //   stages: [
// //     { duration: '10s', target: 5 },   // Ramp up to 5 concurrent checkouts
// //     { duration: '20s', target: 20 },  // Peak at 20 concurrent checkouts
// //     { duration: '10s', target: 0 },   // Cool down
// //   ],
// //   thresholds: {
// //     // 95% of full checkout flows (Order write + Payment initiate) under 400ms
// //     http_req_duration: ['p(95)<400'],
// //     http_req_failed: ['rate<0.01'],   // Less than 1% failure rate
// //   },
// // };

// // const BASE_URL = 'http://localhost:5000';

// // // Replace these strings with 3-5 real Product IDs from your MongoDB database
// // const PRODUCT_IDS = [
// //    '6a60a6df8eea5651908de9aa',
// //    '6a60a6df8eea5651908de9b0',
// //    '6a60a6df8eea5651908de9a8',
// //    '6a60a6df8eea5651908de9b2',
// //    '6a60a6df8eea5651908de9b4',
// //    '6a60a6df8eea5651908de9b6',
// //    '6a60a6df8eea5651908de9b8',
// //    '6a60a6df8eea5651908de9ba',
// //    '6a60a6df8eea5651908de9ae',
// //    '6a60a6df8eea5651908de9ac',
// // ];



// // export default function () {
// //   const headers = { 'Content-Type': 'application/json' };

// //   // 1. Pick a random product from your DB
// //   const randomProductId = PRODUCT_IDS[Math.floor(Math.random() * PRODUCT_IDS.length)];

// //   // 2. STEP 1: Create a new order (MongoDB Write)
// //   const orderPayload = JSON.stringify({
// //     items: [{ product: randomProductId, quantity: 1 }],
// //     shippingAddress: {
// //       fullName: 'k6 Load Tester',
// //       address: '123 Test St',
// //       city: 'Delhi',
// //       postalCode: '110001',
// //       phone: '9876543210',
// //     },
// //   });

// //   const orderRes = http.post(`${BASE_URL}/api/orders`, orderPayload, { headers });

// //   const orderSuccess = check(orderRes, {
// //     'order created (200/201)': (r) => r.status === 200 || r.status === 201,
// //   });

// //   // 3. STEP 2: Initiate Payment on the new Order ID
// //   if (orderSuccess) {
// //     const orderData = JSON.parse(orderRes.body);
// //     const orderId = orderData._id || (orderData.order && orderData.order._id);

// //     if (orderId) {
// //       const paymentRes = http.post(`${BASE_URL}/api/payments/${orderId}/initiate`, {}, { headers });

// //       check(paymentRes, {
// //         'payment initiated (200)': (r) => r.status === 200,
// //         'has payu payload/hash': (r) => r.body && (r.body.includes('hash') || r.body.includes('payu')),
// //       });
// //     }
// //   }

// //   sleep(1); // 1-second pause between checkout loops
// // }



// import http from 'k6/http';
// import { check, sleep } from 'k6';

// export const options = {
//   stages: [
//     { duration: '10s', target: 5 },   // Ramp up to 5 concurrent buyers
//     { duration: '20s', target: 20 },  // Peak at 20 concurrent buyers
//     { duration: '10s', target: 0 },   // Cool down
//   ],
//   thresholds: {
//     http_req_duration: ['p(95)<500'], // Write ops + crypto compute target: < 500ms
//     http_req_failed: ['rate<0.01'],   // Error rate < 1%
//   },
// };

// const BASE_URL = 'http://localhost:5000';

// const PRODUCT_IDS = [
//    '6a60a6df8eea5651908de9aa',
//    '6a60a6df8eea5651908de9b0',
//    '6a60a6df8eea5651908de9a8',
//    '6a60a6df8eea5651908de9b2',
//    '6a60a6df8eea5651908de9b4',
//    '6a60a6df8eea5651908de9b6',
//    '6a60a6df8eea5651908de9b8',
//    '6a60a6df8eea5651908de9ba',
//    '6a60a6df8eea5651908de9ae',
//    '6a60a6df8eea5651908de9ac',
// ];
// export default function () {
//   const headers = { 'Content-Type': 'application/json' };

//   // Select a random product from array
//   const randomProductId = PRODUCT_IDS[Math.floor(Math.random() * PRODUCT_IDS.length)];

//   // 1. STEP 1: Create Order (Write Operation)
//   const orderPayload = JSON.stringify({
//     items: [
//       {
//         productId: randomProductId,
//         quantity: 1,
//       },
//     ],
//     shippingAddress: {
//       name: 'k6 Load Tester',
//       phone: '9876543210',
//       street: '123 Pet Lane',
//       city: 'Delhi',
//       state: 'Delhi',
//       pincode: '110001',
//     },
//     shippingCost: 50, // in Rupees (route converts to paise)
//   });

//   const orderRes = http.post(`${BASE_URL}/api/orders`, orderPayload, { headers });

//   const orderSuccess = check(orderRes, {
//     'order created (status 201)': (r) => r.status === 201,
//   });

//   // 2. STEP 2: Initiate Payment on Created Order ID
//   if (orderSuccess) {
//     const orderData = JSON.parse(orderRes.body);
//     const orderId = orderData.order?._id || orderData._id;

//     if (orderId) {
//       const paymentRes = http.post(`${BASE_URL}/api/payments/${orderId}/initiate`, {}, { headers });

//       check(paymentRes, {
//         'payment initiated (status 200)': (r) => r.status === 200,
//         'has payu transaction payload': (r) => r.body && (r.body.includes('hash') || r.body.includes('payu')),
//       });
//     }
//   }

//   sleep(1); // 1-second pause between iterations
// }

import http from 'k6/http';
import { check } from 'k6';

export const options = {
  // Simulate 10 concurrent Virtual Users hitting the webhook simultaneously
  vus: 10,
  duration: '10s',
};

const ORDER_ID = '6a60b6ef11134ee2b39a690b';
const BASE_URL = (typeof import_meta !== 'undefined' && import_meta.env ? import_meta.env.VITE_API_URL : (typeof process !== 'undefined' && process.env.VITE_API_URL)) || 'http://localhost:5000';

export default function () {
  const url = `${BASE_URL}/api/payments/success`;
  
  // Form-urlencoded payload mimicking PayU's actual callback structure
  // PayU sends form data containing udf1 (orderId), status, txnid, amount, hash, etc.
  const payload = {
    udf1: ORDER_ID,
    amount: '500.00',
    status: 'success',
    txnid: `TXN_${__VU}_${Date.now()}`,
    mihpayid: `MIHPAY_${__VU}_${Date.now()}`,
    hash: 'mock_test_hash_signature'
  };

  const params = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    // Prevent k6 from automatically following the 302 redirect to the frontend (port 5173)
    redirects: 0,
  };

  // Fire the request
  const res = http.post(url, payload, params);

  // Assertions: PayU webhook should respond with a 302 redirect (or 200 depending on route modifications)
  check(res, {
    'status is 302 redirect or handled gracefully': (r) => r.status === 302 || r.status === 200,
  });
}