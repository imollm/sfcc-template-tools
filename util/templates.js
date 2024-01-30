import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'node-html-parser';

/**
 * Processes a template file to extract information about included templates and their hierarchy.
 *
 * @param {string[]} asistidoPnblCartridgePath - Array of paths to the cartridges containing templates.
 * @param {string} cartridgesProjectFolder - The root folder of the project containing cartridges.
 * @param {string} templateToBeScanned - The path to the template file to be scanned.
 * @returns {Object[]} An array of objects representing the template hierarchy.
 */
export function processTemplate(asistidoPnblCartridgePath, cartridgesProjectFolder, templateToBeScanned) {
  const result = [];
  const fileContent = readFileSync(templateToBeScanned, 'utf-8');
  const root = parse(fileContent);
  const isIncludeTags = root.querySelectorAll('isinclude[template]');
  let absolutePath;

  for (let j = 0; j < isIncludeTags.length; j++) {
    const templatePath = `${isIncludeTags[j].getAttribute('template')}.isml`;

    for (let i = 0; i < asistidoPnblCartridgePath.length; i++) {
      absolutePath = resolve(
        `${cartridgesProjectFolder}${asistidoPnblCartridgePath[i]}/cartridge/templates/default`,
        templatePath
      );

      if (absolutePath.indexOf('components/modules') < 0) {
        if (existsSync(absolutePath)) {
          const children =
            processTemplate(asistidoPnblCartridgePath, cartridgesProjectFolder, absolutePath) ?? [];
          const obj = {
            template: absolutePath.split(cartridgesProjectFolder)[1],
          };
          if (children.length) {
            obj.children = children;
          }
          result.push(obj);
          break;
        }
      }
    }
  }

  return result;
}

/**
 * Retrieves the set of cartridges included in the template hierarchy.
 *
 * @param {Object[]} tempalteObjectsArray - An array of objects representing the template hierarchy.
 * @returns {Set} A set containing the names of the cartridges included in the template hierarchy.
 */
export function getIncludedCartridges(tempalteObjectsArray, cartridgesSet) {
  tempalteObjectsArray.forEach((obj) => {
    const cartridge = obj.template.split('/')[0];
    cartridgesSet.add(cartridge);

    if (Object.hasOwnProperty.call(obj, 'children')) {
      getIncludedCartridges(obj.children, cartridgesSet);
    }
  });

  return cartridgesSet;
}

/**
 * Retrieves the path to the folder containing cartridges based on a template path.
 *
 * @param {string} templatePath - The path to a template file.
 * @returns {string} The path to the folder containing cartridges.
 */
export function getCartridgesPathFolder(templatePath) {
  return `${templatePath.split('cartridges')[0]}cartridges/`;
}
