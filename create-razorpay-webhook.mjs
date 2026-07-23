const keyId = "rzp_live_TFo5iPKrYG2Mos";
const keySecret = "jlhfdhTEEsszdJFeqH4M0vzU";
const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

async function createRazorpayWebhook() {
    const payload = {
        url: "https://wondrilla.com/api/razorpay/webhook",
        alert_email: "hello@wondrilla.com",
        secret: keySecret,
        events: [
            "subscription.charged",
            "subscription.authenticated",
            "subscription.activated",
            "subscription.completed",
            "subscription.cancelled",
            "payment.authorized",
            "payment.captured"
        ]
    };

    console.log("Creating Razorpay Webhook for https://wondrilla.com/api/razorpay/webhook ...");
    let res = await fetch("https://api.razorpay.com/v1/webhooks", {
        method: "POST",
        headers: {
            "Authorization": authHeader,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    let data = await res.json();
    if (!res.ok) {
        console.error("Razorpay API error:", data);
    } else {
        console.log("SUCCESS! Created Razorpay Live Webhook ID:", data.id);
    }
}

createRazorpayWebhook();
