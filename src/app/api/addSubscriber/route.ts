// app/api/addSubscriber/route.ts

const GITHUB_TOKEN = process.env.GIST_TOKEN; // Store your PAT securely as an environment variable
const GIST_ID = process.env.GIST_ID; // Replace with your actual Gist ID

export async function POST(req: Request) {
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

    if (!gistResponse.ok) {
      console.error("Failed to fetch Gist:", gistResponse.statusText);
      return new Response(
        JSON.stringify({ message: "Failed to fetch Gist." }),
        { status: 500 }
      );
    }

    const gistData = await gistResponse.json();

    // Parse existing email addresses from the Gist content
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

    // Check if the email already exists
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

    // Update the Gist with the new list
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

    return new Response(
      JSON.stringify({ message: "Thank you for subscribing!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding subscriber:", error);
    return new Response(
      JSON.stringify({ message: "An error occurred. Please try again." }),
      { status: 500 }
    );
  }
}
