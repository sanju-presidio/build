import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Function to read file from S3
async function readFileFromS3(
  bucketName: string,
  key: string,
): Promise<string> {
  const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: "ASIAWOHVYJJQCKIYKYXZ",
      secretAccessKey: "J7rMMMXcxtLsdTehXBd9thUAjEpGbWSStLSofjXV",
    },
  });
  console.log(s3Client);
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await s3Client.send(command);
    console.log(response);
    if (response.Body) {
      return await streamToString(response.Body as ReadableStream);
    }
    throw new Error("Empty response body");
  } catch (error) {
    console.error("Error reading file from S3:", error);
    throw error;
  }
}

// Helper function to convert stream to string
async function streamToString(stream: ReadableStream): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }

  return result + decoder.decode();
}

// Remove @ts-ignore and return a proper value or empty array
export async function getTestCases(): Promise<string[]> {
  try {
    const fileContent = await readFileFromS3(
      "factif-agent-testcase-source",
      "sample.json",
    );
    console.log("File content:", fileContent);

    // Parse the content as JSON if it's a JSON file, or adapt as needed
    return JSON.parse(fileContent).testcases;
  } catch (error) {
    console.error("Failed to read S3 file:", error);
    return [];
  }
}
