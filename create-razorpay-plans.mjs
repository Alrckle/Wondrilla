const keyId = "rzp_live_TFo5iPKrYG2Mos";
const keySecret = "jlhfdhTEEsszdJFeqH4M0vzU";
const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

async function createPlan(name, amountPaise, description) {
    const payload = {
        period: "monthly",
        interval: 1,
        item: {
            name: name,
            amount: amountPaise,
            currency: "INR",
            description: description
        }
    };

    console.log(`Creating plan: ${name} (${amountPaise / 100} INR)...`);
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
    const proPlan = await createPlan("Wondrilla Pro", 199900, "Wondrilla Pro Monthly Subscription");
    const studioPlan = await createPlan("Wondrilla Studio", 649900, "Wondrilla Studio Monthly Subscription");

    console.log("\n==========================================");
    console.log("RAZORPAY_PLAN_PRO=" + (proPlan ? proPlan.id : "FAILED"));
    console.log("RAZORPAY_PLAN_STUDIO=" + (studioPlan ? studioPlan.id : "FAILED"));
    console.log("==========================================\n");
}

main();
