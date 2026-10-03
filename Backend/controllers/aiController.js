/**
 * Controller connecting Node.js Express Backend to Python FastAPI AI RAG Service
 * Default Local Endpoint: http://localhost:8000
 */

const getAIServiceURL = () => process.env.AI_SERVICE_URL || "http://localhost:8000";

/**
 * @desc    Query RAG model for solution answers and matching sources
 * @route   POST /api/ai/query
 * @access  Private
 */
export const queryAIRag = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Query text is required" });
    }

    const aiEndpoint = `${getAIServiceURL()}/rag/query`;

    try {
      const response = await fetch(aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          message: "AI service query error",
          error: errorText,
        });
      }

      const data = await response.json();
      return res.json({
        success: true,
        answer: data.answer,
        sources: data.sources || [],
      });
    } catch (fetchError) {
      console.warn("AI Local Service unreachable at:", aiEndpoint, fetchError.message);
      return res.status(503).json({
        message: "Local AI RAG service is currently unavailable. Ensure Python FastAPI is running on http://localhost:8000.",
        status: "offline",
      });
    }
  } catch (error) {
    console.error("AI Controller Query Error:", error);
    return res.status(500).json({ message: error.message || "Failed to query AI service" });
  }
};

/**
 * @desc    Add a single FAQ solution to Python vector database
 * @route   POST /api/ai/knowledge/faq
 * @access  Private (Admin, IT Manager, Tech)
 */
export const addFAQToKB = async (req, res) => {
  try {
    const { question, answer, category } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer are required" });
    }

    const aiEndpoint = `${getAIServiceURL()}/knowledge/faq`;

    try {
      const response = await fetch(aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answer,
          category: category || "General",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          message: "AI service knowledge addition error",
          error: errorText,
        });
      }

      const data = await response.json();
      return res.status(201).json({
        success: true,
        data,
      });
    } catch (fetchError) {
      console.warn("AI Local Service unreachable at:", aiEndpoint, fetchError.message);
      return res.status(503).json({
        message: "Local AI service is offline. Please start FastAPI on http://localhost:8000.",
      });
    }
  } catch (error) {
    console.error("Add FAQ Error:", error);
    return res.status(500).json({ message: error.message || "Failed to add FAQ" });
  }
};

/**
 * @desc    Add bulk FAQs to Python vector database
 * @route   POST /api/ai/knowledge/faqs
 * @access  Private (Admin, IT Manager)
 */
export const addBulkFAQsToKB = async (req, res) => {
  try {
    const { faqs } = req.body;

    if (!Array.isArray(faqs) || faqs.length === 0) {
      return res.status(400).json({ message: "faqs array is required" });
    }

    const aiEndpoint = `${getAIServiceURL()}/knowledge/faqs`;

    try {
      const response = await fetch(aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqs),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          message: "AI service bulk knowledge error",
          error: errorText,
        });
      }

      const data = await response.json();
      return res.status(201).json({
        success: true,
        data,
      });
    } catch (fetchError) {
      console.warn("AI Local Service unreachable at:", aiEndpoint, fetchError.message);
      return res.status(503).json({
        message: "Local AI service is offline. Please start FastAPI on http://localhost:8000.",
      });
    }
  } catch (error) {
    console.error("Add Bulk FAQs Error:", error);
    return res.status(500).json({ message: error.message || "Failed to add bulk FAQs" });
  }
};
