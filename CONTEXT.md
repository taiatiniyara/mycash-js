# mycash-js

Community TypeScript SDK for the MyCash e-Commerce API by Digicel Financial Services.

## Language

**Payment Request**:
A request to the MyCash gateway to initiate a payment from a customer's mobile wallet.
_Avoid_: transaction, charge

**OTP (One Time PIN)**:
A one-time code sent via SMS to the customer's mobile number for two-factor authentication.
_Avoid_: TAC, verification code, token

**approve Payment**:
The final step that confirms a payment request using the OTP received by the customer.
_Avoid_: confirm, settle, execute

**sendOtp**:
Sends a one-time PIN to the customer's mobile number via the MyCash gateway.
_Avoid_: sendPin, sendCode

**product_id**:
A unique identifier for the merchant's product or service, provided by MyCash during integration.
_Avoid_: sku, item_id, productId (on the wire only)

**request_id**:
A unique identifier returned by `paymentRequest`, used to track and approve the transaction.
_Aavoid_: txnId, reference

**response_code**:
A string returned by the MyCash API indicating success (`'0'`) or a specific error.
_Avoid_: status, code (use response_code for API fields, code for SDK error classes)

**merchant_mobile**:
The merchant's MyCash-registered mobile number, provided by MyCash during integration.
_Avoid_: sellerPhone, merchantPhone

**customer_mobile**:
The mobile number of the customer making the payment. Must be a valid MSISDN.
_Aavoid_: buyerPhone, customerPhone (on the wire only)

**narration**:
A payment description (max 200 characters). Used for reconciliation and display.
_Avoid_: description, memo, note
