// Import necessary AWS SDK clients
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { CloudFormationClient, CreateStackCommand } from "@aws-sdk/client-cloudformation";
import { SSMClient, SendCommandCommand } from "@aws-sdk/client-ssm";
import express from 'express';
import bodyParser from 'body-parser';
import { exec } from 'child_process'; // For executing shell commands
import path from 'path'; // Import path module for serving static files
import { fileURLToPath } from 'url'; // For ES module __dirname equivalent

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
const AWS_REGION = process.env.AWS_REGION || "us-west-2"; // Change to your desired AWS region
const BEDROCK_MODEL_ID = "anthropic.claude-3-5-sonnet-20240620-v1:0"; // Bedrock model ID

// Initialize AWS SDK clients
const bedrockClient = new BedrockRuntimeClient({ region: AWS_REGION });
const cloudformationClient = new CloudFormationClient({ region: AWS_REGION });
const ssmClient = new SSMClient({ region: AWS_REGION });

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
// Serve static files from the 'public' directory (for your original HTML/JS, if any)
// This line might be removed if you fully switch to React for all frontend.
app.use(express.static('public'));
// Serve the React build output from the 'build' directory inside the frontend project
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));


/**
 * Executes a shell command and returns the output via a Promise.
 * @param {string} command - The shell command to execute.
 * @returns {Promise<string>} A promise that resolves with the command's stdout.
 */
async function executeShellCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Execution Error: ${error}`);
                reject(new Error(stderr || error.message));
                return;
            }
            if (stderr) {
                console.warn(`Command stderr: ${stderr}`);
            }
            resolve(stdout);
        });
    });
}

/**
 * Calls AWS Bedrock to generate content based on a prompt.
 * @param {string} prompt - The prompt for Bedrock.
 * @returns {Promise<string>} A promise that resolves with the generated text.
 */
async function generateContentWithBedrock(prompt) {
    const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2000,
        messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
    };

    const command = new InvokeModelCommand({
        body: JSON.stringify(payload),
        contentType: "application/json",
        accept: "application/json",
        modelId: BEDROCK_MODEL_ID,
    });

    try {
        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        return responseBody.content[0].text.trim();
    } catch (error) {
        console.error("Error invoking Bedrock:", error);
        throw new Error(`Failed to generate content with Bedrock: ${error.message}`);
    }
}

// --- ITSM Specific Functions ---

/**
 * Calls AWS Bedrock to analyze an ITSM ticket and suggest troubleshooting steps.
 * @param {string} ticketDescription - A string containing the ticket details.
 * @returns {Promise<string>} A promise that resolves with the AI's analysis.
 */
async function analyzeItsmTicket(ticketDescription) {
    console.log(`Analyzing ITSM ticket: "${ticketDescription}" using AWS Bedrock...`);

    const prompt = `
    You are an expert IT Service Management (ITSM) analyst.
    Analyze the following IT support ticket and provide a brief, actionable analysis and troubleshooting plan.
    The output should be structured with clear headings.

    Ticket Details:
    "${ticketDescription}"

    Provide the following sections in your response:
    1.  **Summary of Issue:** A one-sentence summary of the problem.
    2.  **Potential Root Cause:** Briefly list 2-3 likely root causes.
    3.  **Recommended Actions:** Provide a numbered list of immediate troubleshooting steps or questions to ask the user.

    Do not include any introductory or concluding remarks, just the structured analysis.
    `;
    return await generateContentWithBedrock(prompt);
}

/**
 * Generates follow-up questions for an ITSM ticket using Bedrock.
 * @param {string} ticketDescription - A string containing the ticket details.
 * @returns {Promise<string>} A promise that resolves with the generated questions.
 */
async function generateFollowupQuestions(ticketDescription) {
    console.log(`Generating follow-up questions for ticket: "${ticketDescription}" using AWS Bedrock...`);

    const prompt = `
    Based on the following ITSM ticket description, generate 3-5 concise follow-up questions that a support agent could ask the customer to gather more information or clarify the issue.
    Format the questions as a numbered list.

    Ticket Description: "${ticketDescription}"

    Provide the questions as a numbered list. Do not include any introductory or concluding remarks.
    `;
    return await generateContentWithBedrock(prompt);
}

/**
 * Summarizes an ITSM ticket for management using Bedrock.
 * @param {string} ticketDescription - A string containing the ticket details.
 * @returns {Promise<string>} A promise that resolves with the management summary.
 */
async function summarizeForManagement(ticketDescription) {
    console.log(`Summarizing ticket for management: "${ticketDescription}" using AWS Bedrock...`);

    const prompt = `
    Create a concise, high-level summary of the following ITSM ticket, suitable for a management audience.
    Focus on the core problem, impact, and current status. Keep it to 2-3 sentences.

    Ticket Details:
    "${ticketDescription}"

    Provide only the summary. Do not include any introductory or concluding remarks.
    `;
    return await generateContentWithBedrock(prompt);
}

// --- Other backend functions (generateCloudFormation, deployCloudFormation, etc.) remain unchanged ---
// (Assuming these functions are already present in your original app.js)

// Placeholder for other cloud functions from your original app.js
// You would include the actual implementations here if they are not already in your app.js
async function generateCloudFormation(resourceDescription) {
    // Dummy implementation for demonstration
    return `AWSTemplateFormatVersion: '2010-09-09'
Description: A sample CloudFormation template for ${resourceDescription}
Resources:
  MyS3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: my-generated-bucket-${Date.now()}`;
}

async function deployCloudFormation(stackName, templateBody) {
    // Dummy implementation for demonstration
    return { stackId: `arn:aws:cloudformation:us-west-2:123456789012:stack/${stackName}/dummy-id` };
}

async function runSsmTask(taskDescription, instanceId) {
    // Dummy implementation for demonstration
    return {
        generatedScript: `echo "Running task: ${taskDescription} on ${instanceId}"`,
        commandId: `cmd-${Date.now()}`
    };
}

async function getSsmOutput(commandId, instanceId) {
    // Dummy implementation for demonstration
    return {
        status: 'Success',
        statusDetails: 'Command completed',
        responseCode: 0,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        standardOutputContent: `Output for ${commandId} on ${instanceId}: Task completed successfully.`,
        standardErrorContent: '',
        commandInvocation: { /* full dummy invocation details */ }
    };
}

async function runAwsCli(cliTaskDescription) {
    // Dummy implementation for demonstration
    return {
        generatedCommand: `aws s3 ls --query "Buckets[].Name"`,
        stdout: `Dummy S3 bucket list for: ${cliTaskDescription}`,
        stderr: ''
    };
}

async function generateAzureArm(resourceDescription) {
    // Dummy implementation
    return `{
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "resources": [
            {
                "type": "Microsoft.Storage/storageAccounts",
                "apiVersion": "2021-09-01",
                "name": "mystorageaccount${Date.now()}",
                "location": "[resourceGroup().location]",
                "sku": {
                    "name": "Standard_LRS"
                },
                "kind": "StorageV2",
                "properties": {}
            }
        ]
    }`;
}

async function deployAzureArm(resourceGroupName, templateBody) {
    // Dummy implementation
    return { deploymentName: `myDeployment-${Date.now()}` };
}

async function runAzureCommand(taskDescription, resourceGroup, vmName, osType) {
    // Dummy implementation
    return {
        generatedCommand: `az vm run-command invoke --command-id RunShellScript --name ${vmName} -g ${resourceGroup} --scripts "echo '${taskDescription}'"`,
        output: `Dummy output for Azure command: ${taskDescription}`,
        errorOutput: ''
    };
}

async function runAzureCli(cliTaskDescription) {
    // Dummy implementation
    return {
        generatedCommand: `az group list --query "[].name"`,
        stdout: `Dummy Azure resource group list for: ${cliTaskDescription}`,
        stderr: ''
    };
}

async function generateGcpDm(resourceDescription) {
    // Dummy implementation
    return `resources:
- name: my-gcs-bucket-${Date.now()}
  type: storage.v1.bucket
  properties:
    name: my-gcs-bucket-${Date.now()}
    location: US
    storageClass: STANDARD`;
}

async function deployGcpDm(deploymentName, configBody) {
    // Dummy implementation
    return { operationId: `operations/dummy-gcp-op-${Date.now()}` };
}

async function runGcpCli(cliTaskDescription) {
    // Dummy implementation
    return {
        generatedCommand: `gcloud storage ls`,
        stdout: `Dummy GCP storage list for: ${cliTaskDescription}`,
        stderr: ''
    };
}


// --- API Endpoints ---

// ITSM Ticket Analysis
app.post('/analyze-ticket-with-ai', async (req, res) => {
    const { ticketDescription } = req.body;
    if (!ticketDescription) {
        return res.status(400).json({ error: "Ticket description is required." });
    }
    try {
        const analysisResult = await analyzeItsmTicket(ticketDescription);
        res.json({ analysisResult: analysisResult });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// NEW API Endpoint for Generate Follow-up Questions
app.post('/generate-followup-questions', async (req, res) => {
    const { ticketDescription } = req.body;
    if (!ticketDescription) {
        return res.status(400).json({ error: "Ticket description is required." });
    }
    try {
        const questions = await generateFollowupQuestions(ticketDescription);
        res.json({ questions: questions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// NEW API Endpoint for Summarize for Management
app.post('/summarize-for-management', async (req, res) => {
    const { ticketDescription } = req.body;
    if (!ticketDescription) {
        return res.status(400).json({ error: "Ticket description is required." });
    }
    try {
        const summary = await summarizeForManagement(ticketDescription);
        res.json({ summary: summary });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// CloudFormation Endpoints
app.post('/generate-cf', async (req, res) => {
    const { resourceDescription } = req.body;
    if (!resourceDescription) {
        return res.status(400).json({ error: "Resource description is required." });
    }
    try {
        const template = await generateCloudFormation(resourceDescription);
        res.json({ cloudFormationTemplate: template });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/deploy-cf', async (req, res) => {
    const { stackName, templateBody } = req.body;
    if (!stackName || !templateBody) {
        return res.status(400).json({ error: "Stack name and template body are required." });
    }
    try {
        const result = await deployCloudFormation(stackName, templateBody);
        res.json({ stackId: result.stackId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SSM Endpoints
app.post('/run-ssm-task', async (req, res) => {
    const { taskDescription, instanceId } = req.body;
    if (!taskDescription || !instanceId) {
        return res.status(400).json({ error: "Task description and instance ID are required." });
    }
    try {
        const result = await runSsmTask(taskDescription, instanceId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/get-ssm-output', async (req, res) => {
    const { commandId, instanceId } = req.body;
    if (!commandId || !instanceId) {
        return res.status(400).json({ error: "Command ID and instance ID are required." });
    }
    try {
        const output = await getSsmOutput(commandId, instanceId);
        res.json(output);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// AWS CLI Endpoint
app.post('/run-aws-cli', async (req, res) => {
    const { cliTaskDescription } = req.body;
    if (!cliTaskDescription) {
        return res.status(400).json({ error: "CLI task description is required." });
    }
    try {
        const result = await runAwsCli(cliTaskDescription);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Azure ARM Endpoints
app.post('/generate-arm', async (req, res) => {
    const { resourceDescription } = req.body;
    if (!resourceDescription) {
        return res.status(400).json({ error: "Resource description is required." });
    }
    try {
        const template = await generateAzureArm(resourceDescription);
        res.json({ armTemplate: template });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/deploy-arm', async (req, res) => {
    const { resourceGroupName, templateBody } = req.body;
    if (!resourceGroupName || !templateBody) {
        return res.status(400).json({ error: "Resource group name and template body are required." });
    }
    try {
        const result = await deployAzureArm(resourceGroupName, templateBody);
        res.json({ deploymentName: result.deploymentName });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Azure Run Command Endpoint
app.post('/run-azure-command', async (req, res) => {
    const { taskDescription, resourceGroup, vmName, osType } = req.body;
    if (!taskDescription || !resourceGroup || !vmName || !osType) {
        return res.status(400).json({ error: "Task description, resource group, VM name, and OS type are required." });
    }
    try {
        const result = await runAzureCommand(taskDescription, resourceGroup, vmName, osType);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Azure CLI Endpoint
app.post('/run-azure-cli', async (req, res) => {
    const { cliTaskDescription } = req.body;
    if (!cliTaskDescription) {
        return res.status(400).json({ error: "CLI task description is required." });
    }
    try {
        const result = await runAzureCli(cliTaskDescription);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GCP Deployment Manager Endpoints
app.post('/generate-gcp-dm', async (req, res) => {
    const { resourceDescription } = req.body;
    if (!resourceDescription) {
        return res.status(400).json({ error: "Resource description is required." });
    }
    try {
        const config = await generateGcpDm(resourceDescription);
        res.json({ dmConfig: config });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/deploy-gcp-dm', async (req, res) => {
    const { deploymentName, configBody } = req.body;
    if (!deploymentName || !configBody) {
        return res.status(400).json({ error: "Deployment name and config body are required." });
    }
    try {
        const result = await deployGcpDm(deploymentName, configBody);
        res.json({ operationId: result.operationId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GCP CLI Endpoint
app.post('/run-gcp-cli', async (req, res) => {
    const { cliTaskDescription } = req.body;
    if (!cliTaskDescription) {
        return res.status(400).json({ error: "CLI task description is required." });
    }
    try {
        const result = await runGcpCli(cliTaskDescription);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Fallback for React app routing (important for client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
