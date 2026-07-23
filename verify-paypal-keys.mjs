const clientId = "AVlx9nLoBUHtovGofIXuTBKixEL59WVXENI9bK2RxJhQXVJ6e4rv8lc7DKiE9fLt4Kei_N4Cgp3-ZBl7";
const clientSecret = "EIs0LocxWeo3kVVMQ_a-bqwMqvtjPNCQ465DKdenWslcD8XjwaGNuNZfcbHmxKHi-tum-vQ-IY7AiMYc";

const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

async function testPayPal() {
    console.log("Testing Live PayPal API credentials...");
    try {
        const res = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "grant_type=client_credentials"
        });

        const data = await res.json();
        if (res.ok && data.access_token) {
            console.log("✅ PAYPAL API SUCCESS! Connected to Production PayPal.");
            console.log("Token Scope:", data.scope);
            console.log("App ID:", data.app_id);
        } else {
            console.error("❌ PAYPAL API ERROR:", data);
        }
    } catch (err) {
        console.error("❌ FETCH ERROR:", err.message);
    }
}

testPayPal();
