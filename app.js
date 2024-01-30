import { existsSync } from "node:fs";
import { intro, outro, text, isCancel } from "@clack/prompts";
import colors from 'picocolors';
import { processTemplate, getIncludedCartridges, getCartridgesPathFolder } from "./util/templates.js";
import { handleExit, formatOutput } from "./util/cli.js";

intro(colors.inverse(`Welcome to SFCC include templates discover tool 🔎.`));

const cartridgePath = await text({
  message: colors.cyan('Enter the cartridge path separated with ":" 🚧'),
  validate: (value) => {
    if (value.indexOf(':') < 0) {
      return 'Cartridge path must be separated by :'
    }
  }
});

if (isCancel(cartridgePath)) handleExit({ message: 'You didn\'t provide any cartridge path.' });

const templateToBeScanned = await text({
  message: colors.cyan('Enter the path of the root template to be scanned 📃'),
  validate: (value) => {
    if (value.startsWith('~')) {
      return colors.yellow(`Don't start the path with ${colors.bold('~')}`)
    }
    if (!existsSync(value)) {
      return colors.red(`Path ${colors.bold(value)} does not exists`)
    }
  }
});

if (isCancel(templateToBeScanned)) handleExit({ message: 'You didn\'t provide any template to be scanned.' });

const cartridgesSet = new Set();
const cartridgePathSplitted = cartridgePath.split(':');
const cartridgesProjectFolder = getCartridgesPathFolder(templateToBeScanned);
const templates = processTemplate(cartridgePathSplitted, cartridgesProjectFolder, templateToBeScanned);
const cartridgesSetResult = getIncludedCartridges(templates, cartridgesSet);

outro(
  (templates && templates.length > 0)
    ? `Included templates inside ${colors.inverse(templateToBeScanned)} \n\n ${formatOutput(templates, 0)}`
    : `No includes for template ${colors.inverse(templateToBeScanned)}`
);

if (templates && templates.length > 0) {
  outro(`Cartridges where all templates are located ${Array.from(cartridgesSetResult).map(c => colors.inverse(c))}`);
}
