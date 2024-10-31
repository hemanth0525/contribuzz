// app/api/addSubscriber/route.ts

// Retrieve GitHub token and Gist ID from environment variables
const GITHUB_TOKEN = process.env.GIST_TOKEN;
const GIST_ID = process.env.GIST_ID;

export async function POST(req: Request) {
  // Extract email from the request body
  const { email } = await req.json();

  try {
    // Fetch the existing Gist to get the current content
    const gistResponse = await fetch(
      `https://api.github.com/gists/${GIST_ID}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    // Check if the Gist fetch was successful
    if (!gistResponse.ok) {
      console.error("Failed to fetch Gist:", gistResponse.statusText);
      return new Response(
        JSON.stringify({ message: "Failed to fetch Gist." }),
        { status: 500 }
      );
    }

    const gistData = await gistResponse.json();

    // Initialize email list from the Gist content
    let emailList = [];
    if (
      gistData.files["subscribers.json"] &&
      gistData.files["subscribers.json"].content
    ) {
      const currentContent = JSON.parse(
        gistData.files["subscribers.json"].content
      );
      emailList = currentContent.emailList || [];
    }

    // Check if the email already exists in the list
    if (emailList.includes(email)) {
      return new Response(
        JSON.stringify({
          message: "Email already exists in the notification list.",
        }),
        { status: 400 }
      );
    }

    // Add new email to the list
    emailList.push(email);

    // Update the Gist with the new email list
    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: {
          "subscribers.json": {
            content: JSON.stringify({ emailList }, null, 2), // Pretty-print with 2 spaces
          },
        },
      }),
    });

    // Respond with a success message
    return new Response(
      JSON.stringify({ message: "Thank you for subscribing!" }),
      { status: 200 }
    );
  } catch (error) {
    // Log and respond with an error message
    console.error("Error adding subscriber:", error);
    return new Response(
      JSON.stringify({ message: "An error occurred. Please try again." }),
      { status: 500 }
    );
  }
}
