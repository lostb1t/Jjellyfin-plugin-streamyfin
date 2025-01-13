export default function (view) {
    const SCHEMA_URL = window.ApiClient.getUrl('streamyfin/config/schema');
    const YAML_URL = window.ApiClient.getUrl('streamyfin/config/yaml')
    
    const yamlEditorEl = document.getElementById('yaml-editor');
    const jsonEditorEl = document.getElementById('json-editor');
    
    const Streamyfin = {
        pluginId: "1e9e5d38-6e67-4615-8719-e98a5c34f004",
        btnSave: document.querySelector("#saveConfig"),
        switchBtn: document.getElementById("switch-btn"),
        editor: null,
        jsonEditor: null,
        isYamlEditorActive: () => yamlEditorEl.style.display === 'block',
        toggleEditor: () => {
            if (Streamyfin.isYamlEditorActive()) {
                const yamlString = Streamyfin.editor.getModel().getValue();

                Streamyfin.jsonEditor.setValue(window.jsYaml.load(yamlString));
                yamlEditorEl.style.display = 'none';
                jsonEditorEl.style.display = 'block';
            }
            else {
                const json = Streamyfin.jsonEditor.getValue();

                Streamyfin.editor.getModel().setValue(window.jsYaml.dump(json));
                yamlEditorEl.style.display = 'block';
                jsonEditorEl.style.display = 'none';
            }
        },
        saveConfig: function (e) {
            e.preventDefault();
            Dashboard.showLoadingMsg();
            const data = JSON.stringify({
                Value: Streamyfin.isYamlEditorActive() 
                    ? Streamyfin.editor.getModel().getValue()
                    : window.jsYaml.dump(Streamyfin.jsonEditor.getValue())
            });

            window.ApiClient.ajax({type: 'POST', url: YAML_URL, data, contentType: 'application/json'})
                .then(async (response) => {
                    const {Error, Message} = await response.json();

                    if (Error) {
                        Dashboard.hideLoadingMsg();
                        Dashboard.alert(Message);
                    } else {
                        Dashboard.processPluginConfigurationUpdateResult();
                    }
                })
                .catch((error) => console.error(error))
                .finally(Dashboard.hideLoadingMsg);
        },
        loadConfig: function () {
            Dashboard.showLoadingMsg();
            const url = window.ApiClient.getUrl('streamyfin/config/yaml');
            
            window.ApiClient.ajax({ type: 'GET', url, contentType: 'application/json'})
                .then(async function (response) {
                    const { Value } = await response.json();
                    const yamlModelUri = monaco.Uri.parse('streamyfin.yaml');

                    Streamyfin.editor = monaco.editor.create(yamlEditorEl, {
                        automaticLayout: true,
                        language: 'yaml',
                        quickSuggestions: {
                            other: true,
                            comments: true,
                            strings: true
                        },
                        model: monaco.editor.createModel(Value, 'yaml', yamlModelUri),
                    });
                })
                .catch((error) => console.error(error))
                .finally(Dashboard.hideLoadingMsg);
        },
        init: function () {
            fetch(SCHEMA_URL).then(async (response) => {
                const schema = await response.json();

                // Yaml Editor
                monaco.editor.setTheme('vs-dark');
                monacoYaml.configureMonacoYaml(monaco, {
                    enableSchemaRequest: true,
                    hover: true,
                    completion: true,
                    validate: true,
                    format: true,
                    schemas: [
                        {
                            uri: SCHEMA_URL,
                            fileMatch: ["*"],
                            schema
                        },
                    ],
                });

                // Json Editor
                Streamyfin.jsonEditor = new JSONEditor(jsonEditorEl, {
                    schema: schema,
                    disable_edit_json: true,
                    disable_properties: true,
                    disable_collapse: true,
                    no_additional_properties: true,
                    use_default_values: false
                });
            })

            console.log("init");
            Streamyfin.loadConfig();
            Streamyfin.btnSave.addEventListener("click", Streamyfin.saveConfig);
            Streamyfin.switchBtn.addEventListener("click", Streamyfin.toggleEditor);
            stylizeFormForJellyfin();
        }
    }

    view.addEventListener("viewshow", function (e) {
        waitForScript();
    });

    function waitForScript() {
        if (typeof monaco === "undefined") {
            setTimeout(waitForScript, 50);
        } else {
            Streamyfin.init();
        }
    }
    
    function stylizeFormForJellyfin() {
        document.querySelectorAll(".form-control")?.forEach?.(parent => {
            parent.childNodes.forEach((child, index) => {
                const container = child.closest(".row")
                const sibling = child.previousElementSibling;

                // Jellyfin select
                if (child.tagName === 'SELECT') {
                    if (sibling?.tagName === 'LABEL') {
                        sibling.className = "selectLabel"
                    }

                    child.className = "emby-select-withcolor emby-select"
                    if (container) {
                        container.className = "selectContainer"
                    }
                }

                // Jellyfin input
                if (child.tagName === 'INPUT') {
                    if (sibling?.tagName === 'LABEL') {
                        sibling.className = "inputLabel inputLabelUnfocused"
                    }

                    child.className = "emby-input"
                    if (container) {
                        container.className = "inputContainer"
                    }
                }
            })
        })

        document.querySelectorAll(".je-form-input-label")?.forEach?.(description => {
            description.className = "fieldDescription"
        })

        document.getElementById('json-editor').childNodes.forEach((child, index) => {
            if (child.className === "je-object__container") {
                child.className = "verticalSection-extrabottompadding"
                // const title = child.querySelector('.je-header');
                // if (title) {
                //     title.className = ""
                // }
            }
        })
        
        document.querySelectorAll(".je-object__container")?.forEach?.(description => {
            description.className = "fieldDescription"
        })
    }
}


// waitForScript();
