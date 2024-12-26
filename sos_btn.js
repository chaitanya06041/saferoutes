document.getElementById('sos-btn').addEventListener('click', async function () {
    // Get the input values for origin and destination
    const origin = document.getElementById('origin-input').value.trim();
    const destination = document.getElementById('destination-input').value.trim();

    // Validate inputs
    if (!origin || !destination) {
        const errorMessageElement = document.getElementById('error-message');
        errorMessageElement.innerText = "Please enter both origin and destination.";
        errorMessageElement.style.color = "red";
        return;
    }

    // Call the function to send the message
    await sendSOSMessage(origin, destination);
});

async function sendSOSMessage(origin, destination) {
    const phoneNumbers = [
        "+918208955480" // Replace with your target WhatsApp number(s)
    ];

    try {
        const promises = phoneNumbers.map(async (number) => {
            const response = await fetch("https://graph.facebook.com/v21.0/422748917593803/messages", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer EAAHUg5KRZBisBO65fmQaH11yVvVg8rTku3T1wMZCrZAqWxZBroNLytk8F390gZAD7nOsvyhz4hmXJtSxltKUI034mZBQmjpU3DqrY2B1DxzpXfhrUMP2bygvVKWhPs8AQFD8oLsTPEpLTD0pTtnf9O8u8vs6ZBopWRvn9QiW4LbZBiBOPrOmt7Y0t1AxMSaJJlZAYk6o7U6yOmDQgxZB53eaNYtPE7V6vqM7XtffkZD", // Replace with your token
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: number,
                    type: "template", // Specify template message type
                    template: {
                        name: "sos_btn_msg_alert", // Template name
                        language: { code: "en" }, // Language code
                        components: [
                            {
                                type: "body",
                                parameters: [
                                    { type: "text", text: origin }, // Origin parameter ({{1}})
                                    { type: "text", text: destination } // Destination parameter ({{2}})
                                ]
                            }
                        ]
                    }
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error("Failed to send message:", responseData);
                throw new Error(`Failed to send message to ${number}: ${responseData.error.message}`);
            } else {
                console.log("Message sent successfully:", responseData);
            }
        });

        await Promise.all(promises);

        // Success message
        const successMessageElement = document.getElementById('success-message');
        if (successMessageElement) {
            successMessageElement.innerText = "Your SOS message has been sent successfully!";
            successMessageElement.style.color = "green";
        }

    } catch (error) {
        // Error message
        const errorMessageElement = document.getElementById('error-message');
        if (errorMessageElement) {
            errorMessageElement.innerText = `Failed to send SOS message: ${error.message}`;
            errorMessageElement.style.color = "red";
        }
    }
}
