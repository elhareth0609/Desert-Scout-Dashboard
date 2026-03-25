'use server';
/**
 * @fileOverview A Genkit flow for analyzing historical drone detection logs.
 *
 * - analyzeDetectionLogs - A function that handles the analysis of detection logs.
 * - AnalyzeDetectionLogsInput - The input type for the analyzeDetectionLogs function.
 * - AnalyzeDetectionLogsOutput - The return type for the analyzeDetectionLogs function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const DetectionLogEntrySchema = z.object({
  detectedType: z.string().describe('The type of object detected (e.g., "camel", "vehicle tracks").'),
  confidence: z.number().min(0).max(1).describe('The confidence score of the detection (0-1).'),
  latitude: z.number().describe('The latitude of the detection.'),
  longitude: z.number().describe('The longitude of the detection.'),
  timestamp: z.string().datetime().describe('The ISO 8601 timestamp of the detection event.'),
});

const AnalyzeDetectionLogsInputSchema = z.object({
  detectionLogs: z.array(DetectionLogEntrySchema).describe('An array of historical detection log entries.'),
  analysisRequest: z.string().optional().describe('Specific instructions or questions for the AI regarding the analysis (e.g., "Summarize activity", "Identify anomalies", "Find patterns in camel movements").'),
});
export type AnalyzeDetectionLogsInput = z.infer<typeof AnalyzeDetectionLogsInputSchema>;

// Output Schema
const AnalyzeDetectionLogsOutputSchema = z.object({
  summary: z.string().describe('A high-level summary of the detection activity during the analyzed period.'),
  patterns: z.array(z.string()).describe('A list of significant patterns identified in the detection data.'),
  anomalies: z.array(z.string()).describe('A list of unusual or anomalous detection events.'),
  insights: z.string().describe('Actionable insights or recommendations based on the analysis.'),
});
export type AnalyzeDetectionLogsOutput = z.infer<typeof AnalyzeDetectionLogsOutputSchema>;

// Prompt definition
const analyzeLogsPrompt = ai.definePrompt({
  name: 'analyzeLogsPrompt',
  input: { schema: AnalyzeDetectionLogsInputSchema },
  output: { schema: AnalyzeDetectionLogsOutputSchema },
  prompt: `You are an AI assistant specialized in analyzing drone detection logs from desert environments. Your task is to provide a comprehensive analysis of the provided historical detection logs.

Analyze the following detection logs and provide:
1. A summary of the detection activity.
2. Any significant patterns observed.
3. Any anomalies or unusual events.
4. Actionable insights or recommendations.

If a specific analysis request is provided, prioritize addressing that request in your analysis.

Detection Logs:
{{#if detectionLogs}}
{{#each detectionLogs}}
- Timestamp: {{this.timestamp}}, Detected Type: {{this.detectedType}}, Confidence: {{this.confidence}}, Location: (Lat: {{this.latitude}}, Lon: {{this.longitude}})
{{/each}}
{{else}}
No detection logs provided.
{{/if}}

{{#if analysisRequest}}
Specific Analysis Request: {{{analysisRequest}}}
{{/if}}

Please structure your response in a clear and concise manner, ensuring all four requested sections (summary, patterns, anomalies, insights) are present.
`
});

// Flow definition
const analyzeDetectionLogsFlow = ai.defineFlow(
  {
    name: 'analyzeDetectionLogsFlow',
    inputSchema: AnalyzeDetectionLogsInputSchema,
    outputSchema: AnalyzeDetectionLogsOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeLogsPrompt(input);
    return output!;
  }
);

// Wrapper function
export async function analyzeDetectionLogs(
  input: AnalyzeDetectionLogsInput
): Promise<AnalyzeDetectionLogsOutput> {
  return analyzeDetectionLogsFlow(input);
}
