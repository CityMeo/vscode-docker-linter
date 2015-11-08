"use strict";
import * as path from "path";
import { workspace, Disposable, ExtensionContext } from "vscode";
import { LanguageClient, LanguageClientOptions, SettingMonitor, RequestType } from "vscode-languageclient";

let langs = ["perl", "perlcritic"];

export function activate(context: ExtensionContext) {
	langs.forEach(lang => {

		// We need to go one level up since an extension compile the js code into
		// the output folder.
		let serverModule = path.join(__dirname, "..", "server", "server.js");
		let debugOptions = { execArgv: ["--nolazy", "--debug=6004"] };
		let serverOptions = {
			run: { module: serverModule },
			debug: { module: serverModule, options: debugOptions }
		};

		let clientOptions: LanguageClientOptions = {
			documentSelector: ["perl"],
			synchronize: {
				configurationSection: "docker-linter-"+lang
			}
		};

		let client = new LanguageClient("Docker Linter "+lang+"!", serverOptions, clientOptions);
		context.subscriptions.push(new SettingMonitor(client, "docker-linter-"+lang+".enable").start());
	});
}