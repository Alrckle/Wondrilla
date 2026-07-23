const keyId = "rzp_live_TFo5iPKrYG2Mos";
const keySecret = "jlhfdhTEEsszdJFeqH4M0vzU";
const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

async function createPlan(name, amountPaise, period, description) {
    const payload = {
        period: period, // "yearly"
        interval: 1,
        item: {
            name: name,
            amount: amountPaise,
            currency: "INR",
            description: description
        }
    };

    console.log(`Creating ${period} plan: ${name} (${amountPaise / 100} INR)...`);
    const res = await fetch("https://api.razorpay.com/v1/plans", {
        method: "POST",
        headers: {
            "Authorization": authHeader,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
        console.error(`Error creating ${name}:`, data);
        return null;
    }

    console.log(`SUCCESS! Created ${name}. Plan ID: ${data.id}`);
    return data;
}

async function main() {
    const proYearly = await createPlan("Wondrilla Pro Yearly (20% OFF)", 1599900, "yearly", "Wondrilla Pro Annual Subscription with 20% discount");
    const studioYearly = await createPlan("Wondrilla Studio Yearly (20% OFF)", 5199900, "yearly", "Wondrilla Studio Annual Subscription with 20% discount");

    console.log("\n==========================================");
    console.log("RAZORPAY_PLAN_PRO_YEARLY=" + (proYearly ? proYearly.id : "FAILED"));
    console.log("RAZORPAY_PLAN_STUDIO_YEARLY=" + (studioYearly ? studioYearly.id : "FAILED"));
    console.log("==========================================\n");
}

main();
