import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Text is required for analysis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analyzing text of length:", text.length);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create detailed prompt for deception analysis
    const systemPrompt = `You are an expert behavioral analyst specializing in text-based communication analysis. Analyze the provided text for indicators of potential deception or emotional inconsistency. 

CRITICAL: You are NOT detecting lies with certainty. You are analyzing patterns that MAY indicate deception.

Analyze these aspects:
1. Sentiment inconsistencies (emotional shifts that don't match context)
2. Linguistic anomalies (unusual word choices, overuse of qualifiers, distancing language)
3. Emotional mismatch (stated emotion vs. implied emotion)
4. Hesitation markers (uncertainty language, hedging)
5. Contradiction patterns (logical inconsistencies)

Provide a JSON response with this exact structure:
{
  "text_score": <number 0-100, where higher = more indicators of deception>,
  "confidence": <"low" | "medium" | "high">,
  "sentiment_analysis": {
    "overall_sentiment": <"positive" | "negative" | "neutral" | "mixed">,
    "inconsistencies": [<array of detected inconsistencies>],
    "emotional_shifts": <number of significant shifts>
  },
  "linguistic_analysis": {
    "distancing_language": <number of instances>,
    "qualifier_overuse": <number of instances>,
    "unusual_phrasing": [<array of unusual phrases>],
    "complexity_score": <number 1-10>
  },
  "emotional_analysis": {
    "stated_emotion": <detected stated emotion>,
    "implied_emotion": <detected implied emotion>,
    "mismatch_level": <"none" | "low" | "medium" | "high">,
    "stress_indicators": [<array of stress markers>]
  },
  "key_findings": [<array of 2-4 key observations>],
  "interpretation": <brief explanation of the score>
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this text for deception indicators:\n\n${text}` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI analysis failed");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;
    
    console.log("AI Response:", content);

    // Parse the JSON response from AI
    let analysisResult;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      analysisResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback to a default response
      analysisResult = {
        text_score: 50,
        confidence: "low",
        sentiment_analysis: {
          overall_sentiment: "neutral",
          inconsistencies: [],
          emotional_shifts: 0
        },
        linguistic_analysis: {
          distancing_language: 0,
          qualifier_overuse: 0,
          unusual_phrasing: [],
          complexity_score: 5
        },
        emotional_analysis: {
          stated_emotion: "unknown",
          implied_emotion: "unknown",
          mismatch_level: "none",
          stress_indicators: []
        },
        key_findings: ["Unable to fully analyze the text. Please try again."],
        interpretation: "Analysis could not be completed due to a technical issue."
      };
    }

    // Calculate final score (for now, just using text_score as we only have text input)
    const final_score = analysisResult.text_score;

    return new Response(
      JSON.stringify({
        text_score: analysisResult.text_score,
        final_score: final_score,
        confidence: analysisResult.confidence,
        sentiment_analysis: analysisResult.sentiment_analysis,
        linguistic_analysis: analysisResult.linguistic_analysis,
        emotional_analysis: analysisResult.emotional_analysis,
        key_findings: analysisResult.key_findings,
        interpretation: analysisResult.interpretation
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in analyze-text function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred during analysis"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});