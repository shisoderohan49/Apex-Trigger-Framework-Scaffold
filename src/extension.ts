import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { StringHelper } from "./helper";

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        "apex-trigger-framework-scaffold.createApexTriggerFrameworkSkeletion",
        async () => {
            const rootPath = vscode.workspace.rootPath;
            const workspaceFolders = vscode.workspace.workspaceFolders;

            if (!rootPath) {
                vscode.window.showErrorMessage(
                    "No Root Directory Present in Workspace. Please open a Salesforce DX Project."
                );
                return;
            }

            const sfdxProjectPath = path.join(rootPath, "sfdx-project.json");
            if(!fs.existsSync(sfdxProjectPath)){
                vscode.window.showErrorMessage(
                    "sfdx-project.json not found in the root directory. Please open a Salesforce DX Project."
                );
                return;
            }

            var objectApiName :string; 
            var triggerName :string; 
            var triggerHandlerName:string; 
            var serviceClassName :string;
            var apiVersion :string;

            objectApiName = (await vscode.window.showInputBox({prompt: "Enter API Name of Object"}))!;
            if(
                objectApiName === undefined ||
                objectApiName === null ||
                !StringHelper.isValidStringWithoutSpaces(objectApiName)
            ){
                vscode.window.showErrorMessage("Invalid User Input Provided. Please provide a valid Object API Name");
                return;
            }

            triggerName = (await vscode.window.showInputBox({prompt: "Enter name of Trigger"}))!;
            if(
                objectApiName === undefined ||
                objectApiName === null ||
                !StringHelper.isValidStringWithoutSpaces(triggerName)
            ){
                vscode.window.showErrorMessage("Invalid User Input Provided. Please provide a valid Trigger Name");
                return;
            }

            triggerHandlerName = (await vscode.window.showInputBox({prompt: "Enter name of Trigger Handler"}))!;
            if(
                objectApiName === undefined ||
                objectApiName === null ||
                !StringHelper.isValidStringWithoutSpaces(triggerHandlerName)
            ){
                vscode.window.showErrorMessage("Invalid User Input Provided. Please provide a valid Trigger Handler Name");
                return;
            }

            serviceClassName = (await vscode.window.showInputBox({prompt: "Enter name of Service Class"}))!;
            if(
                objectApiName === undefined ||
                objectApiName === null ||
                !StringHelper.isValidStringWithoutSpaces(serviceClassName)
            ){
                vscode.window.showErrorMessage("Invalid User Input Provided. Please provide a valid Service Class Name");
                return;
            }

            apiVersion = (await vscode.window.showInputBox({prompt: "Enter API Version"}))!;
            if(
                objectApiName === undefined ||
                objectApiName === null ||
                !StringHelper.isValidAPIVersion(apiVersion)
            ){
                vscode.window.showErrorMessage("Invalid User Input Provided. Please provide a valid API Version");
                return;
            }

            const overwriteOptions: vscode.QuickPickItem[] = [
                {
                    label: 'Yes',
                    description: 'Overwrite files if already existing',
                    detail: 'Yes'
                },
                {
                    label: 'No',
                    description: 'Don\'t overwrite files if already existing',
                    detail: 'No'
                }
            ];
            var overwriteContents = await vscode.window.showQuickPick(overwriteOptions,{
                placeHolder: "Do you want to overwrite existing files? (Yes/No)",
            });
            if(overwriteContents === undefined){
                return;
            }

            if (workspaceFolders) {
                const workspacePath = workspaceFolders[0].uri.fsPath;

                var [triggerFileContent,triggerHandlerFileContent,serviceClassFileContent,apexClassXMLContent,apexTriggerXMLContent] = 
                [
                    "triggerTemplate.trigger",
                    "triggerHandlerTemplate.cls",
                    "triggerServicesTemplate.cls",
                    "apexClassXML.xml",
                    "apexTriggerXML.xml"
                ].map((name) => {
                    var templatePath = path.join(context.extensionPath, "templates", name);
                    return fs.readFileSync(templatePath,"utf8").toString();
                });

                var triggerNewListName = "new" + StringHelper.toCamelCase(objectApiName!) + "List";
                var triggerOldListName = "old" + StringHelper.toCamelCase(objectApiName!) + "List";
                var triggerNewMapName = "new" + StringHelper.toCamelCase(objectApiName!) + "Map";
                var triggerOldMapName = "old" + StringHelper.toCamelCase(objectApiName!) + "Map";

                triggerFileContent = triggerFileContent
                                     .replace(/OBJECT_API_NAME/gi, objectApiName!)
                                     .replace(/TRIGGER_NAME/gi, triggerName!)
                                     .replace(/TRIGGER_HANDLER_NAME/gi, triggerHandlerName!);
                    
                triggerHandlerFileContent = triggerHandlerFileContent
                                            .replace(/OBJECT_API_NAME/gi, objectApiName!)
                                            .replace(/TRIGGER_HANDLER_NAME/gi, triggerHandlerName!)
                                            .replace(/TRIGGER_SERVICES_CLASS/gi,serviceClassName!)
                                            .replace(/newRecords/gi, triggerNewListName)
                                            .replace(/oldRecords/gi, triggerOldListName)
                                            .replace(/newRecordMap/gi, triggerNewMapName)
                                            .replace(/oldRecordMap/gi, triggerOldMapName);

                serviceClassFileContent = serviceClassFileContent
                                          .replace(/OBJECT_API_NAME/gi, objectApiName!)
                                          .replace(/TRIGGER_HANDLER_NAME/gi, triggerHandlerName!)
                                          .replace(/TRIGGER_SERVICES_CLASS/gi,serviceClassName!)
                                          .replace(/newRecords/gi, triggerNewListName)
                                          .replace(/oldRecords/gi, triggerOldListName)
                                          .replace(/newRecordMap/gi, triggerNewMapName)
                                          .replace(/oldRecordMap/gi, triggerOldMapName);

                apexClassXMLContent = apexClassXMLContent.replace(/{{API_VERSION}}/gi,apiVersion!);
                apexTriggerXMLContent = apexTriggerXMLContent.replace(/{{API_VERSION}}/gi,apiVersion!);

                const scaffold = [
                    { name: "classes", type: "folder" },
                    { name: "triggers", type: "folder" },
                    {
                        name: "classes/" + triggerHandlerName! + ".cls",
                        type: "file",
                        content: triggerHandlerFileContent,
                    },
                    {
                        name: "classes/" + triggerHandlerName! + ".cls-meta.xml",
                        type: "file",
                        content: apexClassXMLContent,
                    },
                    {
                        name: "classes/" + serviceClassName! + ".cls",
                        type: "file",
                        content: serviceClassFileContent,
                    },
                    {
                        name: "classes/" + serviceClassName! + ".cls-meta.xml",
                        type: "file",
                        content: apexClassXMLContent,
                    },
                    {
                        name: "triggers/" + triggerName! + ".trigger",
                        type: "file",
                        content: triggerFileContent,
                    },
                    {
                        name: "triggers/" + triggerName! + ".trigger-meta.xml",
                        type: "file",
                        content: apexTriggerXMLContent,
                    }
                ];

                scaffold.forEach((item) => {
                    const itemPath = path.join(
                        rootPath,
                        "force-app",
                        "main",
                        "default",
                        item.name
                    );
                    if (item.type === "folder") {
                        if (!fs.existsSync(itemPath)) {
                            fs.mkdirSync(itemPath, { recursive: true });
                        }
                    } else if (item.type === "file") {
						if(
                            item.content !== null && 
                            (
                                (fs.existsSync(itemPath) && overwriteContents?.label === 'Yes') || 
                                !fs.existsSync(itemPath)
                            )
                        ){
							fs.writeFileSync(
                                itemPath,
                                item.content!
                            );
						}
                    }
                });

                var displayText = `Trigger ${triggerName!} created with Handler Class ${triggerHandlerName!} and Service Class ${serviceClassName!}`;
                vscode.window.showInformationMessage(displayText);
            }
            
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
