## Salesforce Commerce Cloud Discover Template Includes Tool 🔎

<img src="https://raw.githubusercontent.com/uzumaxy/awesome-sfcc/master/assets/sfcc-logo.png" width="256"/>

### How to use it
1. Run tool
```sh
npx sfcc-template-tools@latest
```
The tool will ask you for your cartridge path, cartridges names should be separated by ":"

![Cartridge path](https://i.imgur.com/8K842U4.png)

The second param will be the absoulte path of your ISML template, like `<absolute_path>/templateName.isml`

![Template path](https://i.imgur.com/RvntUBc.png)

All the templates included in the root template will be shown with indentation, to know which one is the children of.

![Includes results](https://i.imgur.com/uXJoLOd.png)

Also the tool will show you all the cartridges where all the templates are located.

![Cartridges results](https://i.imgur.com/cC60Jdz.png)

