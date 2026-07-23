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

async function createProduct(token) {
    const res = await fetch(`${baseUrl}/v1/catalogs/products`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: "Wondrilla AI Workspace",
            description: "Multi-model AI workspace subscriptions for Wondrilla.com",
            type: "SERVICE",
            category: "SOFTWARE"
        })
    });
    const data = await res.json();
    if (!res.ok) throw new Error("Product creation failed: " + JSON.stringify(data));
    console.log("SUCCESS! Created PayPal Product ID:", data.id);
    return data.id;
}

async function createPlan(token, productId, name, priceStr, intervalUnit, description) {
    const payload = {
        product_id: productId,
        name: name,
        description: description,
        billing_cycles: [
            {
                frequency: {
                    interval_unit: intervalUnit, // "MONTH" or "YEAR"
                    interval_count: 1
                },
                tenure_type: "REGULAR",
                sequence: 1,
                total_cycles: 0,
                pricing_scheme: {
                    fixed_price: {
                        value: priceStr,
                        currency_code: "USD"
                    }
                }
            }
        ],
        payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee_failure_action: "CONTINUE",
            payment_failure_threshold: 3
        }
    };

    const res = await fetch(`${baseUrl}/v1/billing/plans`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(`Plan creation failed for ${name}: ` + JSON.stringify(data));
    console.log(`SUCCESS! Created PayPal Plan: ${name} -> Plan ID: ${data.id}`);
    return data.id;
}

async function main() {
    try {
        console.log("1. Authenticating with PayPal Live API...");
        const token = await getAccessToken();

        console.log("2. Creating PayPal Catalog Product for Wondrilla AI...");
        const productId = await createProduct(token);

        console.log("3. Creating PayPal Subscription Plans...");
        const proMonthlyId = await createPlan(token, productId, "Wondrilla Pro (Monthly)", "24.00", "MONTH", "Wondrilla Pro Monthly Subscription");
        const studioMonthlyId = await createPlan(token, productId, "Wondrilla Studio (Monthly)", "79.00", "MONTH", "Wondrilla Studio Monthly Subscription");
        const proYearlyId = await createPlan(token, productId, "Wondrilla Pro (Yearly - 20% OFF)", "228.00", "YEAR", "Wondrilla Pro Yearly Subscription");
        const studioYearlyId = await createPlan(token, productId, "Wondrilla Studio (Yearly - 20% OFF)", "756.00", "YEAR", "Wondrilla Studio Yearly Subscription");

        console.log("\n==========================================");
        console.log("PAYPAL_PLAN_PRO=" + proMonthlyId);
        console.log("PAYPAL_PLAN_STUDIO=" + studioMonthlyId);
        console.log("PAYPAL_PLAN_PRO_YEARLY=" + proYearlyId);
        console.log("PAYPAL_PLAN_STUDIO_YEARLY=" + studioYearlyId);
        console.log("==========================================\n");
    } catch (err) {
        console.error("ERROR:", err.message);
    }
}

main();
