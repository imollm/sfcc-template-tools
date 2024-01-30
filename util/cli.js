import { outro } from "@clack/prompts";
import colors from 'picocolors';

/**
 * Handles the process exit with the provided exit code and message.
 * 
 * @param {object} options - An object containing code and message properties.
 *                           Default values: { code: 0, message: 'You have cancelled the process' }
 */
export function handleExit({ code = 0, message = 'You have cancelled the process' } = {}) {
    outro(colors.yellow(message));
    process.exit(code);
}

/**
 * Formats the output of templates array with appropriate indentation.
 * 
 * @param {Array} templatesArray - An array of template objects.
 * @param {number} depth - The current depth of recursion (default: 0).
 * @returns {string} The formatted output string.
 */
export function formatOutput(templatesArray, depth = 0) {
    let outputPrint = '';

    templatesArray.forEach(templateObj => {
        const { template, children } = templateObj;
        outputPrint += '\t'.repeat(depth) + template + '\n\n';

        if (children && children.length > 0) {
            outputPrint += formatOutput(children, depth + 1);
        }
    });

    return outputPrint;
}