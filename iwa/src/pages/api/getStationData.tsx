// Import the required modules and database query function
import { NextApiRequest, NextApiResponse } from "next";
import { getDataFromDatabase } from "@/weatherData";

/**
 * The dataFetcher function is an async handler for NextApiRequest and NextApiResponse.
 * It processes incoming GET requests, retrieves the data from the database, and returns the data with an appropriate HTTP status.
 * @param {NextApiRequest} req - The NextApiRequest object.
 * @param {NextApiResponse} res - The NextApiResponse object.
 * @returns {Promise<void>} - An empty promise.
 */
export default async function dataFetcher(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; data?: any[]; missingData?: any[] }>
): Promise<void> {
  // Check if the request method is GET
  if (req.method === "GET") {
    try {
      // Retrieve data from the database
      const data = await getDataFromDatabase(req.query.id as string);

      // Send a successful HTTP status, message, and data
      res.status(200).json({ message: "Data fetched successfully", data });
    } catch (error) {
      // Log and return an error message and HTTP status if there's an error when fetching data
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Error fetching data from database" });
    }
  } else {
    // If the request method is not GET, send a 'Method Not Allowed' status and a message
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
  }
}
