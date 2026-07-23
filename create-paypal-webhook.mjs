const clientId = "AVlx9nLoBUHtovGofIXuTBKixEL59WVXENI9bK2RxJhQXVJ6e4rv8lc7DKiE9fLt4Kei_N4Cgp3-ZBl7";
const clientSecret = "EIs0LocxWeo3kVVMQ_a-bqwMqvtjPNCQ465DKdenWslcD8XjwaGNuNZfcbHmxKHi-tum-vQ-IY7AiMYc";
const authHeader = "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

const baseUrl = "https://api-m.paypal.com"; // LIVE Production

async function getAccessToken() {
    const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            "Authorization": authHeader,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
    });
    const data = await res.json();
    if (!res.ok) throw new Error("OAuth failed: " + JSON.stringify(data));
    return data.access_token;
}

async function createWebhook(token) {
    const payload = {
        url: "https://wondrilla.com/api/paypal/webhook",
        event_types: [
            { name: "BILLING.SUBSCRIPTION.ACTIVATED" },
            { name: "BILLING.SUBSCRIPTION.CANCELLED" },
            { name: "BILLING.SUBSCRIPTION.EXPIRED" },
            { name: "BILLING.SUBSCRIPTION.SUSPENDED" },
            { name: "BILLING.SUBSCRIPTION.UPDATED" },
            { name: "PAYMENT.SALE.COMPLETED" }
        ]
    };

    console.log("Creating PayPal Webhook for https://wondrilla.com/api/paypal/webhook ...");
    const res = await fetch(`${baseUrl}/v1/notifications/webhooks`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
        if (data.name === "WEBHOOK_URL_ALREADY_EXISTS") {
            console.log("Webhook URL already exists on PayPal App!");
            return "ALREADY_EXISTS";
        }
        throw new Error("Webhook creation failed: " + JSON.stringify(data));
    }

    console.log("SUCCESS! Created Live PayPal Webhook ID:", data.id);
    return data.id;
}

async function main() {
    try {
        const token = await getAccessToken();
        const webhookId = await createWebhook(token);
        console.log("PayPal Webhook Setup Completed:", webhookId);
    } catch (err) {
        console.error("ERROR:", err.message);
    }
}

main();
